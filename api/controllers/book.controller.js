import Book from "../models/book.model.js";
import { errorHandler } from "../utils/error.js";
// import {errorHandler} from "../utils/error.js";

export const createbook = async(req,res,next)=>{
    const {isbn,title,author,price,quantity}=req.body;
    const newBook = new Book({isbn,title,author,price,quantity});
    try{
        await newBook.save();
        console.log("book created succesfully");
        res.status(201).json("Book created succesfully");
    }
    catch(err){
        next(err);
    }
}

export const all = async(req,res,next)=>{
    const books=await Book.find();
    if (!books){
        return next(errorHandler(404,"No books found!!"));
    }
    res.json(books);

}


export const one = async(req,res,next)=>{
    const {isbn}=req.body;
    try{
        const validBook = await Book.findOne({isbn});
        if (!validBook){
            return next(errorHandler(404,"invalid ISBN||Book not Found"));
        }else{
            res.json(validBook);
        }
    }
    catch(err){
        next(err)
    }
}

