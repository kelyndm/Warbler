const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('./handlers/error');

const PORT = 8081;

app.use(cors());
app.use(bodyParser.json());

// all routes here


// If it gets to here.. return 404 error...
app.use(function(req,res,next) {
    let err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// use error handler to handle errors and respond with a json error message
app.use(errorHandler);

app.listen(PORT, function() {
    console.log(`Server is starting on port ${PORT}`);
});