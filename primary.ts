import cluster from 'node:cluster';
import os from 'node:os';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const cpuCount = os.cpus().length;
const 

console.log(`The total number of CPUs is, ${cpuCount}`);
console.log(`Primary pid=${process.pid}`);

cluster.setupPrimary({
		exec: __dirname + "/main.ts",
});

for (let i = 0; i < cpuCount; i++) {
		cluster.fork();
}

cluster.on('exit', (worker, code, signal) => {
		console.log(`worker ${worker.process.pid} has been killed`);
		console.log('Starting another worker');
		cluster.fork();
});
