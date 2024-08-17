/** @format */

const express = require('express');
const app = express();
const cors = require('cors');
const apiRoute = require('./routes/form');

app.use(
	cors({
		origin: 'http://localhost:5173',
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		credentials: true,
	})
);
app.use(express.json());

app.use('/api', apiRoute);

const port = 3001;

app.get('/', async (req, res) => {
	await getConnection();
	res.send('forms application');
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
