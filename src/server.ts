import express from 'express';

const app = express();

// app.use();

app.get('/users', (req, res) => {
  res.json(['Runa','RR']);
});

app.listen(3333);