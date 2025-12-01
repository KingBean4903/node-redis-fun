import express from 'expres';

const app = express();

const PORT = 8800;


app.listen(PORT, () => {
		console.log(`We are live on port ${PORT}`);
});
