/** @format */

const express = require('express');
const rateLimitMiddleware = require('./rateLimiter');
const path = require('path');

const app = express();
const cors = require('cors');
const apiRoute = require('./routes/form');

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.resolve('public')));
} else {
	app.use(
		cors({
			origin: 'http://localhost:5173',
			methods: ['GET', 'POST', 'PUT', 'DELETE'],
			credentials: true,
		})
	);
}

app.use(express.json());
app.use(rateLimitMiddleware);

app.use('/api', rateLimitMiddleware, apiRoute);

const port = 3001;

app.get('/', async (req, res) => {
	await getConnection();
	res.send('forms application');
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
