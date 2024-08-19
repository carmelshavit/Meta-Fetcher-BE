/** @format */

const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router();

const PORT = process.env.PORT || 3001;

// Helper function to fetch metadata
const fetchMetadata = async (url) => {
	try {
		console.log(`Fetching metadata for URL: ${url}`);

		const { data } = await axios.get(url);
		console.log(`Data fetched successfully for URL: ${url}`);

		const $ = cheerio.load(data);

		const title = $('head title').text() || null;
		const description = $('meta[name="description"]').attr('content') || null;
		const image = $('meta[property="og:image"]').attr('content') || null;

		console.log(`Extracted metadata for URL: ${url}`, {
			title,
			description,
			image,
		});

		return { title, description, image };
	} catch (error) {
		console.error(`Failed to fetch metadata for ${url}:`, error);
		throw new Error('Could not retrieve metadata');
	}
};

// API endpoint to get metadata for a URL
router.get('/metadata', async (req, res) => {
	const { url } = req.query;
	console.log('server 40:', req);

	if (!url) {
		console.error('No URL provided in request');
		return res.status(400).json({ error: 'URL is required' });
	}

	try {
		console.log(`Received request to fetch metadata for URL: ${url}`);

		const metadata = await fetchMetadata(url);
		console.log(`Sending metadata response for URL: ${url}`, metadata);

		res.json(metadata);
	} catch (error) {
		console.error(`Error occurred while fetching metadata for URL: ${url}`);
		res.status(500).json({ error: 'Failed to fetch metadata' });
	}
});

module.exports = router;
