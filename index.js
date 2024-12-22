require("dotenv").config();
const express = require("express");
const session = require("express-session");
const authRoutes = require("./routes/authRoutes");
const pageRoutes = require("./routes/pageRoutes");
const movieRoutes = require("./routes/movieRoutes");

const app = express();

app.set("views", "./src/views");
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

app.use(
  session({
    secret: process.env.app_secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use("/", pageRoutes);
app.use("/auth", authRoutes);
app.use("/movie", movieRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${process.env.PORT}`);
});
