const express = require('express');
const app = express();
const path = require('path');

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Dynamic route to serve resume based on username
app.get('/:username/resume', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'resume.html'));
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
