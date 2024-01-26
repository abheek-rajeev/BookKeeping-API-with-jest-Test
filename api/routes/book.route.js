const express = require("express");
const { verifyAdmin, verifyToken } = require("../utils/verifyUser.js");
const { all, createbook, deleteBook, one, updateBook } = require("../controllers/book.controller.js");

const router = express.Router();

router.post("/createBook", verifyAdmin, createbook);

router.get("/all", verifyToken, all);

router.get("/one", verifyToken, one);

router.put("/updateBook/:isbn", verifyAdmin, updateBook);

router.delete("/deleteBook", verifyAdmin, deleteBook);

module.exports = router;
