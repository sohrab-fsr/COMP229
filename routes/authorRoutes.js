const express = require("express");
const router = express.Router();
const Author = require("../models/Author");

// GET all authors
router.get("/", async (req, res) => {
  const authors = await Author.find();
  res.json(authors);
});

// POST a new author
router.post("/", async (req, res) => {
  const author = req.body;
  if (!author.name || !author.bio) {
    return res.status(401).json({ error: "name and bio are required" });
  }

  const dbResponse = await Author.create(author);
  res.json(dbResponse);
});

// GET author by ID
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const author = await Author.findById(id);
  res.json(author);
});

// UPDATE author by ID
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const author = req.body;
  const updatedAuthor = await Author.findByIdAndUpdate(id, author, {
    new: true,
  });
  res.json(updatedAuthor);
});

// DELETE author by ID
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const dbResponse = await Author.findByIdAndDelete(id);
  res.json(dbResponse);
});

module.exports = router;
