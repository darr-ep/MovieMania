require("dotenv").config();
const express = require("express");
const session = require("express-session");
// const authRoutes = require("./routes/authRoutes");
const pageRoutes = require("./routes/pageRoutes");
// const crudRoutes = require("./routes/crudRoutes");

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

// app.use("/auth", authRoutes);
// app.use("/crud", crudRoutes);
app.use("/", pageRoutes);

app.listen(process.env.PORT, () => {
    console.log(
      `Servidor corriendo en http://localhost:${process.env.PORT}`
    );
  });