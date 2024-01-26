const User = require("../models/user.model.js");
const bcryptjs = require("bcryptjs");
const { errorHandler } = require("../utils/error.js");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashpassword = bcryptjs.hashSync(password, 12);
    const newUser = new User({ username, email, password: hashpassword });
    try {
        await newUser.save();
        console.log("user created successfully");
        res.status(201).json("user created successfully");
    } catch (err) {
        next(err);
    }
};

exports.signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(404, "Invalid Credentials!"));
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(401, "Invalid Credentials!"));
        }
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = validUser._doc;
        // ,expires:new Date(Date.now()+24*60*60)
        return res
            .cookie("access_Token", token, { httpOnly: true })
            .status(200)
            .json({ message: "SignIn succesfully",rest});
    } catch (error) {
        next(error);
    }
};

exports.signout = (req, res, next) => {
    try {
        res.clearCookie('access_Token');
        res.status(200).json("User has been Logged Out!!!");
    } catch (err) {
        next(err);
    }
};
