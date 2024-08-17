/** @format */

const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router();

const PORT = process.env.PORT || 3001;

// Helper function to fetch metadata
const fetchMetadata = async (url) => {
	try {
		const { data } = await axios.get(url);
		const $ = cheerio.load(data);

		const title = $('head title').text() || null;
		const description = $('meta[name="description"]').attr('content') || null;
		const image = $('meta[property="og:image"]').attr('content') || null;

		return { title, description, image };
	} catch (error) {
		console.error(`Failed to fetch metadata for ${url}:`, error);
		throw new Error('Could not retrieve metadata');
	}
};

// API endpoint to get metadata for a URL
router.get('/metadata', async (req, res) => {
	const { url } = req.query;

	if (!url) {
		return res.status(400).json({ error: 'URL is required' });
	}

	try {
		const metadata = await fetchMetadata(url);
		res.json(metadata);
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch metadata' });
	}
});

// const url = 'https://www.facebook.com';
// (async () => {
// 	const res = await fetchMetadata(url);
// 	console.log(res);
// })();

module.exports = router;
