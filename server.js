// server.js
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const SECRET_KEY = "your_secret_key";

// Sample in-memory data
let books = {
  "9781234567897": {
    title: "Node.js Basics",
    author: "John Doe",
    reviews: { "user1": "Great book for beginners!" }
  },
  "9789876543210": {
    title: "Express in Action",
    author: "Jane Smith",
    reviews: {}
  }
};

let users = [
  { username: "user1", password: "pass1" }
];

// Middleware to protect routes
function authenticate(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).send("Access Denied: No Token Provided!");
  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.user = verified;
    next();
  } catch (err) {
    return res.status(400).send("Invalid Token");
  }
}

// Task 1: Get all books
app.get("/books", (req, res) => {
  res.json(books);
});

// Task 2: Get book by ISBN
app.get("/books/isbn/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  if (book) res.json(book);
  else res.status(404).send("Book not found");
});

// Task 3: Get books by author
app.get("/books/author/:author", (req, res) => {
  const authorBooks = Object.entries(books)
    .filter(([isbn, book]) => book.author.toLowerCase() === req.params.author.toLowerCase())
    .map(([isbn, book]) => ({ isbn, ...book }));
  res.json(authorBooks);
});

// Task 4: Get books by title
app.get("/books/title/:title", (req, res) => {
  const titleBooks = Object.entries(books)
    .filter(([isbn, book]) => book.title.toLowerCase() === req.params.title.toLowerCase())
    .map(([isbn, book]) => ({ isbn, ...book }));
  res.json(titleBooks);
});

// Task 5: Get book review
app.get("/books/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  if (book) res.json(book.reviews);
  else res.status(404).send("Book not found");
});

// Task 6: Register new user
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (users.find(u => u.username === username)) {
    return res.status(400).send("User already exists");
  }
  users.push({ username, password });
  res.send("User registered successfully");
});

// Task 7: Login user
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(400).send("Invalid credentials");
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ token });
});

// Task 8: Add/Modify a book review (protected)
app.put("/review/:isbn", authenticate, (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  if (!books[isbn]) return res.status(404).send("Book not found");
  books[isbn].reviews[req.user.username] = review;
  res.send("Review added/modified");
});

// Task 9: Delete a book review (protected)
app.delete("/review/:isbn", authenticate, (req, res) => {
  const { isbn } = req.params;
  if (!books[isbn]) return res.status(404).send("Book not found");
  delete books[isbn].reviews[req.user.username];
  res.send("Review deleted");
});

// Task 10-13: Axios calls demo

// Task 10: Get all books using async callback function
async function getAllBooksCallback(callback) {
  try {
    const response = await axios.get("http://localhost:3000/books");
    callback(null, response.data);
  } catch (error) {
    callback(error);
  }
}

// Task 11: Search by ISBN using promises
function getBookByIsbn(isbn) {
  return axios.get(`http://localhost:3000/books/isbn/${isbn}`).then(res => res.data);
}

// Task 12: Search by Author
function getBooksByAuthor(author) {
  return axios.get(`http://localhost:3000/books/author/${author}`).then(res => res.data);
}

// Task 13: Search by Title
function getBooksByTitle(title) {
  return axios.get(`http://localhost:3000/books/title/${title}`).then(res => res.data);
}

// Example usage (comment out in production)
// getAllBooksCallback((err, books) => { if (!err) console.log("All books:", books); });
// getBookByIsbn("9781234567897").then(console.log).catch(console.error);
// getBooksByAuthor("John Doe").then(console.log).catch(console.error);
// getBooksByTitle("Node.js Basics").then(console.log).catch(console.error);

app.listen(3000, () => console.log("Server running on port 3000"));
