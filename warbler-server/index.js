require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('./handlers/error');
const authRoutes = require('./routes/auth');
const messagesRoutes = require('./routes/messages');
const { loginRequired, ensureCorrectUser } = require('./middleware/auth');
const db = require("./models");
const PORT = 8081;

app.use(cors());
app.use(bodyParser.json());

// all routes here
app.use('/api/auth', authRoutes);
app.use(
    '/api/users/:id/messages', 
    loginRequired, 
    ensureCorrectUser, 
    messagesRoutes
);

app.get("/api/messages", loginRequired, async function(req, res, next) {
    try {
      let messages = await db.Message.find()
        .sort({ createdAt: "desc" })
        .populate("user", {
          username: true,
          profileImageUrl: true
        });
      return res.status(200).json(messages);
    } catch (err) {
      return next(err);
    }
  });
  

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