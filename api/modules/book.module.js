import mongoose from "mongoose";

const bookSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    isbn:{
        type:String,
        required:true,
        unique:true
    },
    price:{
        type:Number,
        required:true
    },
    quantity:{
        type:Number,
        default:0
    }
})

const Book=mongoose.model('Book',bookSchema);

export default Book;