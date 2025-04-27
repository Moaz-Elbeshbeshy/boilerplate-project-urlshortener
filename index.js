require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const url = require('url')


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

let urlDatabase = {
  123: 'https://www.google.com',
  456: 'https://www.freecodecamp.org',
  789: 'https://www.github.com'
}
let idCounter = 1


app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.get('/api/shorturl/:short_url', function (req, res) {
  const { short_url } = req.params;
  const original_url = urlDatabase[short_url]
  if (original_url) {
    return res.status(200).redirect(original_url)
  } else {
    res.status(404).json({ error: 'No short URL found for the given input' });
  }
})

app.post('/api/shorturl', function (req, res) {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'No URL provided' })
  }

  // validate URL
  try {
    const validUrl = new URL(url)
    if (validUrl.protocol !== 'http:' && validUrl.protocol !== 'https:') {
      return res.json({ error: 'Invalid URL' })
    }
  } catch (error) {
    return res.status(400).json({ error: 'Invalid URL' })
  }

  const shortUrl = idCounter++
  urlDatabase[shortUrl] = url

  res.status(200).json({
    original_url: url,
    short_url: shortUrl
  })
})



app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
