const MY_SQL = require('mysql');
const EXPRESS = require('express');
const APP = EXPRESS();
const BODY_PARSER = require('body-parser').json();
const CORS = require('cors')();
const HTTP_SERVER = require('http').createServer(APP);

APP.use(BODY_PARSER);
APP.use(CORS); // Enable CORS if needed
APP.use(EXPRESS.static('public'));

// MySQL database configuration
const db_config = {
    host: '127.0.0.1',
    user: 'amir',
    password: '5590',
    database: 'stocks'
};

// Create a connection to the database
const connection = MY_SQL.createConnection(db_config);

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
    }

    console.log('Connected to database as ID ' + connection.threadId);
});

// Function to group data by ticker
function groupDataByTicker(data) {
    const groupedData = {};
    data.forEach(entry => {
        if (!(entry.ticker in groupedData)) {
            groupedData[entry.ticker] = [];
        }
        groupedData[entry.ticker].push(entry);
    });
    return groupedData;
}

// Define the endpoint to get stocks data
APP.get('/stocks', (req, res) => {
    const query = `SELECT * FROM stocks where Date > '2024-08-20'`;
    
    // Execute the query
    connection.query(query, (err, rows) => {
        if (err) {
            console.error('Error executing query: ' + err.stack);
            res.status(500).json({ error: 'Database query error' });
            return;
        }

        const data = groupDataByTicker(rows);
        res.json(data);
    });
});

// Start the server
HTTP_SERVER.listen(process.env.HTTP_PORT, () => console.log('http://localhost:' + process.env.HTTP_PORT));
