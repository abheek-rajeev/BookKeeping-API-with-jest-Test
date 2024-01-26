const Book = require("../models/book.model.js");
const { errorHandler } = require("../utils/error.js");

exports.createbook = async (req, res, next) => {
    const { isbn, title, author, price, quantity } = req.body;
    const newBook = new Book({ isbn, title, author, price, quantity });
    try {
        await newBook.save();
        console.log("book created successfully");
        res.status(201).json("Book created successfully");
    } catch (err) {
        next(err);
    }
};

exports.all = async (req, res, next) => {
    try {
        const books = await Book.find();
        if (!books) {
            return next(errorHandler(404, "No books found!!"));
        }
        res.json(books);
    } catch (err) {
        next(err);
    }
};

exports.one = async (req, res, next) => {
    const { isbn } = req.body;
    try {
        const validBook = await Book.findOne({ isbn });
        if (!validBook) {
            return next(errorHandler(404, "Invalid ISBN||Book not Found"));
        } else {
            res.json(validBook);
        }
    } catch (err) {
        next(err);
    }
};

exports.updateBook = async (req, res, next) => {
    try {
        const { title, author, price, quantity } = req.body;
        const updatedBook = await Book.findOneAndUpdate({ isbn: req.params.isbn }, { title, author, price, quantity }, { new: true });
        if (!updatedBook) {
            return next(errorHandler(404, "Invalid ISBN||Book not Found"));
        } else {
            res.status(201).json({ message: "Book Updated successfully", updatedBook });
        }
    } catch (err) {
        next(err);
    }
};

exports.deleteBook = async (req, res, next) => {
    const { isbn } = req.body;
    try {
        const deletedBook = await Book.findOneAndDelete({ isbn });
        if (!deletedBook) {
            return next(errorHandler(404, "Invalid ISBN||Book not Found"));
        } else {
            res.status(201).json({ message: "Book Deleted successfully", deletedBook });
        }
    } catch (err) {
        next(err);
    }
};
