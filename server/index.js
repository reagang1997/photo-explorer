const express = require('express');
const path = require('path');
const routes = require('./routes');
const app = express();

const port = process.env.PORT || 8080;

app.use("/home", express.static(path.join(__dirname, 'home')))
app.use(express.json()); // This line is important for parsing JSON in the request body
app.use(routes)

app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from Express backend!' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
