const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRouter = require("./routes/auth.route.js");
const bookRouter = require("./routes/book.route.js");
const cookieParser = require("cookie-parser");

dotenv.config();

mongoose.connect(process.env.MONGO).then(() => {
    console.log("database connected");
}).catch((err) => {
    console.log(err);
});

const app = express();
const server = app.listen(3000, () => {
    console.log("server running at 3000");
});

app.get('/', (req, res) => {
    res.json("Hello world");
});

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/book", bookRouter);

// middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "internal serve error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

module.exports = server;
