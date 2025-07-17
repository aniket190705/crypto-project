import News from "./Components/News";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Portfolio from "./Components/Portfolio";
import Leaderboard from "./Components/Leaderboard"; // ✅ correct path

const socket = io("http://localhost:5000"); // replace with your backend URL

export default function App() {
  const [coins, setCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState("bitcoin");
  const [prices, setPrices] = useState([]);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [activePage, setActivePage] = useState("dashboard");
  const inputRef = useRef(null);
  const [leaderboard, setLeaderboard] = useState([]);

  // Fetch coins on first load
  useEffect(() => {
    fetchCoins();
  }, []);

  // Join room and fetch price when selectedCoin changes
  useEffect(() => {
    setChat([]); // Clear previous chat
    fetchPriceHistory(selectedCoin);
    socket.emit("joinRoom", selectedCoin);
  }, [selectedCoin]);

  // Set up socket listener ONCE
  useEffect(() => {
    const handleMessage = (msg) => {
      setChat((prev) => [...prev, msg]);
    };

    socket.on("receiveMessage", handleMessage);

    return () => {
      socket.off("receiveMessage", handleMessage);
    };
  }, []);
useEffect(() => {
  const fetchLeaderboard = async () => {
    const { data } = await axios.get("http://localhost:5000/api/leaderboard");
    setLeaderboard(data);
  };
  fetchLeaderboard();
}, []);
  const dummyLeaderboard = [
    { username: "Alice", profitPercentage: 120 },
    { username: "Bob", profitPercentage: 110 },
    { username: "Charlie", profitPercentage: 95 },
  ];
const fetchCoins = async () => {
  const { data } = await axios.get("http://localhost:5000/api/market/coins");
  setCoins(data.slice(0, 50));
};

const fetchPriceHistory = async (coin) => {
  try {
    const { data } = await axios.get(
      `http://localhost:5000/api/market/price-history/${coin}`
    );

    // `data` is an array, not an object with `.prices`
    if (!Array.isArray(data)) {
      console.error("Unexpected data format:", data);
      return;
    }

    const formatted = data.map((item) => ({
      time: new Date(item.timestamp).toLocaleDateString(), // or item.time
      price: item.price,
    }));

    setPrices(formatted);
  } catch (error) {
    console.error("Error fetching price history:", error);
  }
};
  const handleSendMessage = () => {
    if (!message.trim()) return;
    socket.emit("sendMessage", { room: selectedCoin, message });
    setChat((prev) => [...prev, message]); // Optional local push
    setMessage("");
    inputRef.current?.focus(); // retain focus
  };

  const DashboardPage = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block font-semibold mb-2">Select Coin</label>
        <select
          value={selectedCoin}
          onChange={(e) => setSelectedCoin(e.target.value)}
          className="w-full p-2 border rounded"
        >
          {coins.map((coin) => (
            <option key={coin.id} value={coin.id}>
              {coin.name}
            </option>
          ))}
        </select>

        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Price History (7 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={prices}>
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#3b82f6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">
          Live Chat - #{selectedCoin}
        </h2>
        <div className="border h-64 overflow-y-auto p-2 rounded bg-gray-100 mb-2">
          {chat.map((msg, i) => (
            <div key={i} className="mb-1">
              • {msg}
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            ref={inputRef}
            type="text"
            className="flex-1 p-2 border rounded-l outline-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
            autoFocus
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 text-white px-4 rounded-r"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );

  const PortfolioPage = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Portfolio</h2>
      <Portfolio />
    </div>
  );

  const LeaderboardPage = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
      <p className="text-gray-600">
        List of top traders by ROI or total profit.
      </p>
    </div>
  );

  const NewsPage = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4">Crypto News</h2>
    <News />
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">CryptoStack</h1>
        <nav className="space-x-4">
          <button
            onClick={() => setActivePage("dashboard")}
            className="font-medium hover:underline"
          >
              Dashboard
            </button>
          <button
            onClick={() => setActivePage("portfolio")}
            className="font-medium hover:underline"
          >
            Portfolio
          </button>
          <button
            onClick={() => setActivePage("leaderboard")}
            className="font-medium hover:underline"
          >
            Leaderboard
          </button>
          <button
            onClick={() => setActivePage("news")}
            className="font-medium hover:underline"
          >
            News
          </button>
        </nav>
      </header>

      {activePage === "dashboard" && <DashboardPage />}
      {activePage === "portfolio" && <PortfolioPage />}
      {activePage === "leaderboard" && <LeaderboardPage />}
      {activePage === "news" && <NewsPage />}
      {activePage === "leaderboard" && <Leaderboard data={dummyLeaderboard} />}

    </div>
  );
}