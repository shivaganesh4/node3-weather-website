const path = require("path");
const express = require("express");
const hbs = require("hbs");
const forecast = require("./utils/forecast");
const geocode = require("./utils/geocode");

const app = express();
const port = process.env.PORT || 4000;

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");
// setup handlebars engine and views loacation
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "weather app",
    name: "Andrew",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide a address!",
    });
  }
  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({
          error,
        });
      }
      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({
            error,
          });
        }
        res.send({
          forecast: forecastData,
          location,
          address: req.query.address,
        });
      });
    }
  );
  // res.send({
  //   forecast: "It's snowing",
  //   location: "Philadelphia",
  //   address: req.query.address,
  // });
});

app.get("/products", (req, res) => {
  console.log(req.query);
  res.send({
    products: [],
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About me",
    name: "Andrew",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    helpText: "This is some helpful text.",
    title: "Help",
    name: "Andrew",
  });
});

app.get("/help/*", (req, res) => {
  res.render("error", {
    title: "404",
    name: "Andrew",
    errorMessage: "Help article not found",
  });
});

app.get("*", (req, res) => {
  res.render("error", {
    title: "404",
    name: "Andrew",
    errorMessage: "Page not found",
  });
});

app.listen(port, () => {
  console.log("Server is up on port" + port);
});
