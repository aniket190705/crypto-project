// routes/portfolio.js
import express from "express";
import axios from "axios";
import Portfolio from "../models/Portfolio.js";

const router = express.Router();
const DUMMY_USER_ID = "user123"; // Replace with JWT user ID in future

// POST /api/portfolio
router.post("/", async (req, res) => {
    try {
        const { symbol, quantity, buyPrice } = req.body;

        const item = new Portfolio({
            userId: DUMMY_USER_ID,
            symbol,
            quantity,
            buyPrice,
        });
        await item.save();

        res.json({ message: "Portfolio item saved", item });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// GET /api/portfolio
router.get("/", async (req, res) => {
    try {
        const items = await Portfolio.find({ userId: DUMMY_USER_ID });

        const symbols = items.map((item) => item.symbol.toLowerCase()).join(",");
        const pricesRes = await axios.get(
            `https://api.coingecko.com/api/v3/simple/price`,
            {
                params: {
                    ids: symbols,
                    vs_currencies: "usd",
                },
            }
        );

        const result = items.map((item) => {
            const currentPrice =
                pricesRes.data[item.symbol.toLowerCase()]?.usd || 0;
            const currentValue = item.quantity * currentPrice;
            const buyValue = item.quantity * item.buyPrice;
            const profitLoss = currentValue - buyValue;

            return {
                _id: item._id,
                symbol: item.symbol,
                quantity: item.quantity,
                buyPrice: item.buyPrice,
                currentPrice,
                profitLoss,
            };
        });

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

export default router;
