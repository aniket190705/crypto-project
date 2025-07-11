import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();

router.get("/me", verifyToken, (req, res) => {
  res.json({
    msg: "Welcome to your profile!",
    user: req.user
  });
});

export default router;
