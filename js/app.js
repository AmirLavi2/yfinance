const MY_SQL = require('mysql');
const EXPRESS = require('express');
const APP = EXPRESS();
const BODY_PARSER = require('body-parser').json();
const CORS = require('cors')();
const HTTP_SERVER = require('http').createServer(APP);
const { Server: SOCKET_SERVER } = require('socket.io');

APP.use(BODY_PARSER);
APP.use(EXPRESS.static('public'));

HTTP_SERVER.listen(process.env.HTTP_PORT, () => console.log('http://localhost:' + process.env.HTTP_PORT));

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

// Query to select all rows from the 'stocks' table
const query = `SELECT * FROM stocks where Date > '2024-03-01' limit 500`;



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



let data;

// Execute the query
connection.query(query, (err, rows) => {
    const IO = new SOCKET_SERVER(HTTP_SERVER);

    IO.on('connection', socket => {
        socket.on('chat msg', msg => {
            console.log('got this message from client:', msg);
            IO.emit('chat message back', data);
        });

        socket.on('pointAdd', msg => {
            console.log(msg);

            IO.emit('chat message back', data);
        });

    });

    if (err) {
        console.error('Error executing query: ' + err.stack);
        return;
    }

    data = rows;
    data = groupDataByTicker(data);
    // console.log(data);
    // Process the rows
    // rows.forEach((row) => {
    //     // console.log(row);
    // });

    // Close the connection
    connection.end();
});
