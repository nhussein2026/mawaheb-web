import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files from the current directory (dist contents will be at root)
app.use(express.static(path.join(__dirname, '.')));

// Handle SPA routing - serve index.html for all non-file routes
app.get('{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Mawaheb server is running on port ${PORT}`);
});
