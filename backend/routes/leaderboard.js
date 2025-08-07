// backend/routes/leaderboard.js
import { Router } from 'express';

const router = Router();

const dummyLeaderboard = [
  { username: 'Alice', profitPercentage: 32.5 },
  { username: 'Bob', profitPercentage: 27.1 },
  { username: 'Charlie', profitPercentage: 15.6 }
];

router.get('/', (req, res) => {
  res.json(dummyLeaderboard);
});

export default router; // ✅ This is the key line!
