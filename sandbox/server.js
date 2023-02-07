import path from 'path';
import express from 'express';

const app = express();
const __dirname = path.resolve();
const srcPath = path.join(__dirname, 'src');
const buildPath = path.join(__dirname, 'build');
const sandboxPath = path.join(__dirname, 'sandbox');

app.use('/', express.static(sandboxPath));
app.use('/src', express.static(srcPath));
app.use('/build', express.static(buildPath));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'sandbox/index.html'));
});

app.listen(process.env.PORT || 9006, () => {
    console.log(`App listening on port ${9006}!`);
});