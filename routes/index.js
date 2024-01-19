const app = require("express")();

app.get("/", (req, res) => res.send("Welcome to myMovies APIs!"));
app.use("/role", require("./role.routes"));
app.use("/user", require("./user.routes"));
app.use("/movies", require("./movies.routes"));
app.use("/image", require("./uploadImage.routes"));

module.exports = app;
