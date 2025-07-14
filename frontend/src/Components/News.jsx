import { useEffect, useState } from "react";
import axios from "axios";

export default function News() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/news");
        setNews(data.data); // Note: Mediastack returns { data: [...] }
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="grid gap-4">
      {news.length === 0 ? (
        <p>Loading news...</p>
      ) : (
        news.map((article, index) => (
          <div key={index} className="p-4 border rounded bg-white shadow">
            <h2 className="text-lg font-semibold">{article.title}</h2>
            <p className="text-sm text-gray-600">{article.published_at}</p>
            <p className="mt-2">{article.description}</p>
            {article.url && (
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline mt-2 inline-block"
              >
                Read more
              </a>
            )}
          </div>
        ))
      )}
    </div>
  );
}
