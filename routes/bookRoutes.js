const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

// GET /books  → list all (with author info)
router.get("/", async (req, res) => {
  const books = await Book.find().populate("author", "name bio");
  res.json(books);
});

// POST /books  → create one
router.post("/", async (req, res) => {
  const book = req.body; // { title, author, year }
  if (!book.title || !book.author) {
    return res.status(401).json({ error: "title and author are required" });
  }
  const created = await Book.create(book);
  res.json(created);
});

// GET /books/:id  → get one (with author info)
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const book = await Book.findById(id).populate("author", "name bio");
  if (!book) return res.status(404).json({ error: "book not found" });
  res.json(book);
});

// PUT /books/:id  → update one
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const updated = await Book.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updated) return res.status(404).json({ error: "book not found" });
  res.json(updated);
});

// DELETE /books/:id  → delete one
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const deleted = await Book.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ error: "book not found" });
  res.json({ deleted: true });
});

module.exports = router;
