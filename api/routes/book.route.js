import express from "express"
import { verifyToken } from "../utils/verifyUser.js";
import { all, createbook, one } from "../controllers/book.controller.js";

const router= express.Router();

router.post("/createBook",verifyToken,createbook);

router.get("/all",verifyToken,all);

router.get("/one",verifyToken,one);

export default router