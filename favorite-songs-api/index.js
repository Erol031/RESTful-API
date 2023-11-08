const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.json());


app.get('/songs', (req, res) => {
  fs.readFile('songs.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    const songs = JSON.parse(data);
    res.json(songs);
  });
});


app.get('/songs/:id', (req, res) => {
  const songId = parseInt(req.params.id);

  fs.readFile('songs.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    const songs = JSON.parse(data);
    const song = songs.find((s) => s.id === songId);

    if (!song) {
      res.status(404).json({ error: 'Song not found' });
      return;
    }

    res.json(song);
  });
});


app.post('/songs', (req, res) => {
  const song = req.body;

  fs.readFile('songs.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    const songs = JSON.parse(data);
    song.id = songs.length + 1;
    songs.push(song);

    fs.writeFile('songs.json', JSON.stringify(songs, null, 2), (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      res.status(201).json(song);
    });
  });
});


app.put('/songs/:id', (req, res) => {
  const songId = parseInt(req.params.id);
  const updatedSong = req.body;

  fs.readFile('songs.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    let songs = JSON.parse(data);
    const index = songs.findIndex((s) => s.id === songId);

    if (index === -1) {
      res.status(404).json({ error: 'Song not found' });
      return;
    }

    songs[index] = { ...songs[index], ...updatedSong };

    fs.writeFile('songs.json', JSON.stringify(songs, null, 2), (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      res.json(songs[index]);
    });
  });
});


app.delete('/songs/:id', (req, res) => {
  const songId = parseInt(req.params.id);

  fs.readFile('songs.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    let songs = JSON.parse(data);
    const index = songs.findIndex((s) => s.id === songId);

    if (index === -1) {
      res.status(404).json({ error: 'Song not found' });
      return;
    }

    const deletedSong = songs.splice(index, 1)[0];

    fs.writeFile('songs.json', JSON.stringify(songs, null, 2), (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      res.json(deletedSong);
    });
  });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});