import express from "express"
import { verifyAdmin, verifyToken } from "../utils/verifyUser.js";
import { all, createbook, deleteBook, one, updateBook } from "../controllers/book.controller.js";

const router= express.Router();

router.post("/createBook",verifyAdmin,createbook);

router.get("/all",verifyToken,all);

router.get("/one",verifyToken,one);

router.put("/updateBook/:isbn",verifyAdmin,updateBook);

router.delete("/deleteBook",verifyAdmin,deleteBook);

export default router