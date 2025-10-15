// 15 Import dependencies
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Import route files
const authorRoute = require("./routes/authorRoutes");
const bookRoute = require("./routes/bookRoutes");

// 8 create variable for app object
const app = express();
// 9 Configure environment variables
dotenv.config();

// 10 nstall express.json() middleware in your app.js
app.use(express.json());
// serve static frontend
app.use(express.static("public"));


// 11 Use mongoose.connect and pass necessary arguments to establish a DB connection.
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("DB connected"))
  .catch((error) => console.error(`Error while connecting DB: ${error}`));

// 12 Identify the models and routes that you need to build from the question
// 16 Invoke the routes in request processing pipeline by using app.use.
app.use("/author", authorRoute);
app.use("/book", bookRoute);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API is up at port ${PORT}`);
});
