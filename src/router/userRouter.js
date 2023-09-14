import express from "express";
import { verifyToken } from "../utilis/verifyToken.js";
const router = express.Router();

router.put("/:id", verifyTokenAndAdmin, (req, res) => {});
export default router;
