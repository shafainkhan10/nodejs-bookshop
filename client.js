const axios = require("axios");

// --------------------
// Task 6: Register new user
async function registerUser() {
  try {
    const response = await axios.post("http://localhost:3000/register", {
      username: "user2",
      password: "pass2"
    });
    console.log("Task 6 Response:", response.data);
  } catch (error) {
    console.error("Error in Task 6:", error.response?.data || error.message);
  }
}

// Task 7: Login as a registered user
async function loginUser() {
  try {
    const response = await axios.post("http://localhost:3000/login", {
      username: "user2",
      password: "pass2"
    });
    console.log("Task 7 Response (Token):", response.data);
    return response.data.token;
  } catch (error) {
    console.error("Error in Task 7:", error.response?.data || error.message);
  }
}

// Task 8: Add/Modify a book review
async function addOrModifyReview(token) {
  try {
    const response = await axios.put(
      "http://localhost:3000/review/9781234567897",
      { review: "Amazing book, very helpful!" },
      { headers: { Authorization: token } }
    );
    console.log("Task 8 Response:", response.data);
  } catch (error) {
    console.error("Error in Task 8:", error.response?.data || error.message);
  }
}

// Task 9: Delete book review
async function deleteReview(token) {
  try {
    const response = await axios.delete(
      "http://localhost:3000/review/9781234567897",
      { headers: { Authorization: token } }
    );
    console.log("Task 9 Response:", response.data);
  } catch (error) {
    console.error("Error in Task 9:", error.response?.data || error.message);
  }
}

// Task 10: Get all books (async callback)
async function getAllBooksTask10() {
  async function getAllBooksCallback(callback) {
    try {
      const response = await axios.get("http://localhost:3000/books");
      callback(null, response.data);
    } catch (error) {
      callback(error);
    }
  }
  getAllBooksCallback((err, books) => {
    if (err) console.error("Error in Task 10:", err.message);
    else console.log("Task 10 - All books:", books);
  });
}

// Task 11: Get book by ISBN
async function getBookByISBN(isbn) {
  try {
    const response = await axios.get(`http://localhost:3000/books/isbn/${isbn}`);
    console.log("Task 11 - Book by ISBN:", response.data);
  } catch (error) {
    console.error("Error in Task 11:", error.response?.data || error.message);
  }
}

// Task 12: Get books by Author
async function getBooksByAuthor(author) {
  try {
    const response = await axios.get(`http://localhost:3000/books/author/${author}`);
    console.log("Task 12 - Books by Author:", response.data);
  } catch (error) {
    console.error("Error in Task 12:", error.response?.data || error.message);
  }
}

// Task 13: Get books by Title
async function getBooksByTitle(title) {
  try {
    const response = await axios.get(`http://localhost:3000/books/title/${title}`);
    console.log("Task 13 - Books by Title:", response.data);
  } catch (error) {
    console.error("Error in Task 13:", error.response?.data || error.message);
  }
}

// --------------------
// Run Tasks 6 → 13 sequentially
(async () => {
  await registerUser(); // Task 6
  const token = await loginUser(); // Task 7

  await addOrModifyReview(token); // Task 8
  await deleteReview(token);      // Task 9

  await getAllBooksTask10(); // Task 10
  await getBookByISBN("9781234567897"); // Task 11
  await getBooksByAuthor("John Doe");   // Task 12
  await getBooksByTitle("Node.js Basics"); // Task 13
})();
