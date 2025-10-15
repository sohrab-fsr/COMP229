const mongoose = require("mongoose");

const Book = mongoose.model(
  "Book",
  new mongoose.Schema({
    title: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: "Author" },
    year: Number,
  })
);

module.exports = Book;
