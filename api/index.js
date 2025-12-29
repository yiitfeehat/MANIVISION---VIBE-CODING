const express = require('express');
const cors = require('cors');
const google = require('googlethis');
const axios = require('axios');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Router
const router = express.Router();

// Proxy Endpoint
router.get('/proxy-image', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).send('URL is required');

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
            res.status(error.response.status).send(error.response.statusText);
        } else {
            console.error('Proxy error:', error.message);
            res.status(500).send('Failed to fetch image');
        }
    }
});

// Search Endpoint
router.post('/search', async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) return res.status(400).json({ error: 'Query is required' });

        const options = {
            page: 0,
            safe: false,
            additional_params: {}
        };

        const images = await google.image(query, options);

        const results = images
            .filter(img => img.url && img.url.startsWith('http'))
            .map(img => ({
                url: img.url,
                thumbnail: img.url,
                title: img.origin?.title || query,
                width: img.width,
                height: img.height
            }))
            .slice(0, 20);

        res.json(results);

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Failed to fetch images' });
    }
});

// Mount Router at /api
app.use('/api', router);

// Export for Vercel Serverless
module.exports = app;
