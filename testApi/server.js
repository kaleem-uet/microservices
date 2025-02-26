const express = require('express');
const autocannon = require('autocannon');

const app = express();
const port = 3000;


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);

    // Run autocannon to test the / endpoint
    autocannon({
        url: `http://localhost:3001`,
        connections: 10, // Number of concurrent connections
        duration: 30 // Duration of the test in seconds
    }, (err, result) => {
        if (err) {
            console.error('Error running autocannon:', err);
        } else {
            console.log('Total requests:', result.requests.total);
        }
    });

    // Run autocannon to test the /test endpoint in parallel
    autocannon({
        url: `http://localhost:3001/test`,
        connections: 10, // Number of concurrent connections
        duration: 30 // Duration of the test in seconds
    }, (err, result) => {
        if (err) {
            console.error('Error running autocannon on /test endpoint:', err);
        } else {
            console.log('Total requests to /test endpoint:', result.requests.total);
        }
    });
});