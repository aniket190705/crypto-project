// src/Components/Leaderboard.jsx
import React from "react";

const Leaderboard = ({ data }) => {
  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Rank</th>
            <th className="border p-2">Username</th>
            <th className="border p-2">Profit %</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((user, index) => (
              <tr key={index} className="text-center">
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{user.username}</td>
                <td className="border p-2">{user.profitPercentage}%</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="border p-2" colSpan="3">
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
