const express = require("express");
const router = express.Router();
// Import Users
const { createUsers, getAllUsers, getDetailUsers, updateUsers, deleteUsers } = require("../handler/v1/users");
// Import Profiles
const { createProfiles, getDetailProfiles, updateProfiles } = require("../handler/v1/profiles");

// Import Products
const { createProducts, getAllProducts, getDetailProducts, updateProducts, deleteProducts } = require("../handler/v1/products");

// Import Transactions
const { createTransactions, getAllTransactions, getDetailTransaction, updateTransactions, deleteTransactions } = require("../handler/v1/transactions");

// router main url
router.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    message: " Welcome to learn Restful APIs - Challange Chapter 4",
    data: null,
  });
});

// router url users
router.post("/users", createUsers);
router.get("/users", getAllUsers)
router.get("/users/:userID", getDetailUsers);
router.put("/users/:userID", updateUsers);
router.delete("/users/:userID", deleteUsers);

// router url profiles
router.post("/profiles", createProfiles);
router.get("/profiles/:profileID", getDetailProfiles);
router.put("/profiles/:profileID", updateProfiles);

// router url products
router.post("/products", createProducts);
router.get("/products", getAllProducts)
router.get("/products/:productID", getDetailProducts);
router.put("/products/:productID", updateProducts);
router.delete("/products/:productID", deleteProducts);

// router url transactions
router.post("/transactions", createTransactions);
router.get("/transactions", getAllTransactions);
router.get("/transactions/:transactionID", getDetailTransaction);
router.put("/transactions/:transactionID", updateTransactions);
router.delete("/transactions/:transactionID", deleteTransactions);


// exports router
module.exports = router;