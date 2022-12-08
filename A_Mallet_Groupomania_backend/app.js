const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const dotenv = require("dotenv").config();
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");


const app = express();

app.use(express.json());

app.use(helmet({ crossOriginResourcePolicy: false }));

const limiterApi = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", limiterApi);

const limiterImages = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/images", limiterImages);

mongoose.connect(process.env.URL_DATABASE,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Application connectée à MongoDB."))
  .catch(() => console.log("Impossible de se connecter à MongoDB."));



app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


app.use("/api/auth", userRoutes);
app.use("/api/post", postRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));


module.exports = app;