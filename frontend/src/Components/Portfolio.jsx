// src/components/Portfolio.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState([]);
  const [form, setForm] = useState({
    symbol: "",
    quantity: "",
    buyPrice: "",
  });

  const fetchPortfolio = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/portfolio");
      setPortfolio(res.data);
    } catch (err) {
      console.error("Error fetching portfolio:", err);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/portfolio", {
        symbol: form.symbol.toLowerCase(),
        quantity: parseFloat(form.quantity),
        buyPrice: parseFloat(form.buyPrice),
      });
      setForm({ symbol: "", quantity: "", buyPrice: "" });
      fetchPortfolio();
    } catch (err) {
      console.error("Error adding coin:", err);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">📊 My Portfolio</h2>

      <form
        onSubmit={handleSubmit}
        className="mb-6 p-4 border rounded bg-gray-50 space-y-2"
      >
        <input
          type="text"
          name="symbol"
          value={form.symbol}
          onChange={handleChange}
          placeholder="Symbol (e.g. bitcoin)"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          placeholder="Quantity"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="buyPrice"
          value={form.buyPrice}
          onChange={handleChange}
          placeholder="Buy Price"
          required
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          ➕ Add
        </button>
      </form>

      {portfolio.length === 0 ? (
        <p>No entries yet.</p>
      ) : (
        <table className="w-full text-left border-t border-gray-300">
          <thead>
            <tr>
              <th>Coin</th>
              <th>Qty</th>
              <th>Buy</th>
              <th>Current</th>
              <th>P/L</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.map((coin) => (
              <tr key={coin._id}>
                <td>{coin.symbol}</td>
                <td>{coin.quantity}</td>
                <td>${coin.buyPrice}</td>
                <td>${coin.currentPrice}</td>
                <td
                  style={{
                    color: coin.profitLoss >= 0 ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  ${coin.profitLoss.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
