import express from 'express';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(join(__dirname, '../public/')));

app.get('/', (_, res) => res.sendFile(join(__dirname, '../public/index.html')));

app.listen(3000, err => err ? console.error(err) : console.log(`Server started at port 3000`));

//template ver 1.0
