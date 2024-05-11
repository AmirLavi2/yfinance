const mysql = require('mysql');

// MySQL database configuration
const db_config = {
    host: '127.0.0.1',
    user: 'amir',
    password: '5590',
    database: 'stocks'
};

// Create a connection to the database
const connection = mysql.createConnection(db_config);

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
    }

    console.log('Connected to database as ID ' + connection.threadId);
});

// Query to select all rows from the 'stocks' table
const query = 'SELECT * FROM stocks';

// Execute the query
connection.query(query, (err, rows) => {
    if (err) {
        console.error('Error executing query: ' + err.stack);
        return;
    }

    // Process the rows
    rows.forEach((row) => {
        console.log(row);
    });

    // Close the connection
    connection.end();
});
