const mongoose = require("mongoose");

const Author = mongoose.model(
  "Author",
  new mongoose.Schema({
    name: String,
    bio: String,
  })
);

module.exports = Author;
