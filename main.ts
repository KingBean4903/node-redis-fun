import express from 'express';
import { createClient } from 'redis';

const app = express();
const PORT = 8800;

const client = createClient({
		url: process.env.REDIS_URL
});

await client.connect();

const ATTEMPTS_PER_WORKER = 10;
const SKU_KEY = 'sku:1001';
const LOCK_KEY = 'lock:sku:1001';
const LOCK_TTL = 1000;


console.log(`worker pid=${process.pid}`);


(async () => {

		for (let i = 0; i < ATTEMPTS_PER_WORKER; i++) {
				const lock = await client.set(LOCK_KEY, process.id, { NX: true, PX: LOCK_TTL })
				if (lock) {
						let stock = await client.get(SKU_KEY) || 100;
						stock = await client.decr(SKU_KEY);
						process.send({ success: stock >= 0 });
						await client.del(LOCK_KEY);
				} else {
						process.send({ success: false })
				}
				await new Promise(r => setTimeout(r, Math.random() * 20)); // jitter
		}
		
		await client.quit();
		process.exit(0);
})();



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
