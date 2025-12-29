const express = require('express');
const cors = require('cors');
const google = require('googlethis');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Image Proxy Endpoint to bypass hotlink protection
app.get('/api/proxy-image', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).send('URL is required');
  }

  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://www.google.com/',
        'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8'
      }
    });

    res.set('Content-Type', response.headers['content-type']);
    res.send(response.data);
  } catch (error) {
    if (error.response) {
      // Forward upstream status code (e.g., 404, 403)
      res.status(error.response.status).send(error.response.statusText);
    } else {
      console.error('Proxy error:', error.message);
      res.status(500).send('Failed to fetch image');
    }
  }
});

// Search API
app.post('/api/search', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const options = {
      page: 0,
      safe: false, // Allow broad search, filter in frontend if needed
      additional_params: {
        // Enforce large images if possible, or leave default
      }
    };

    const images = await google.image(query, options);

    // googlethis returns an array of objects. We want to return a simplified list.
    // Structure: [ { url, width, height, origin: { title } }, ... ]

    // Filter for valid URLs and map
    const results = images
      .filter(img => img.url && img.url.startsWith('http'))
      .map(img => ({
        url: img.url,
        thumbnail: img.url, // googlethis might provide a separate preview, but often main url is fine for MVP
        title: img.origin?.title || query,
        width: img.width,
        height: img.height
      }))
      .slice(0, 20); // Limit to 20 images

    res.json(results);

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

// Export for Vercel Serverless
module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
