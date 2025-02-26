const express = require('express');
const morgan = require('morgan');

const app = express();
const port = 3001;

// Use morgan to log requests
app.use(morgan('combined'));

app.get('/', (req, res) => {
    let message = '';
    for (let i = 0; i < 5; i++) {
        message += `Hello World ${i + 1}! `;
    }
    res.send(message.trim());
});

app.get("/test", (req, res) => {
  let message = "";
  for (let i = 0; i < 5; i++) {
    message += `Hello World ${i + 3}! `;
  }
  res.send(message.trim());
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});