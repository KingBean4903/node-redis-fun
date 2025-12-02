import express from 'express';
import { createClient } from 'redis';

const app = express();
const PORT = 8800;

const client = createClient({
		url: process.env.REDIS_URL
});

console.log(`worker pid=${process.pid}`);

app.post('/', (req, res, next) => {

		let total = 0;
		for (let i = 0; i < 5_000_000; i++) {
				total++;
		}
		res.send(`Massively intesive CPU task ${total}\n`);
});



app.listen(PORT, () => {
		console.log(`We are live on port ${PORT}`);
});   
