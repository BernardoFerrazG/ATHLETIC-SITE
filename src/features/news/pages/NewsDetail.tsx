import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Timestamp } from "firebase/firestore";

import Sidebar from "../../../components/Sidebar";
import { getNewsById } from "../services/newsService";

import "../styles/NewsDetail.css";

interface News {
  id: string;
  title: string;
  content: string;
  image: string;
  authorId: string;
  publishedAt: Timestamp;
}

export default function NewsDetail() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [news, setNews] = useState<News | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function loadNews() {
      try {
        const data = await getNewsById(id!);

        if (!data) {
          navigate("/noticias");
          return;
        }

        setNews(data as News);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadNews();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="news-detail-layout">
        <Sidebar />

        <div className="news-detail-content">
          <p>Carregando notícia...</p>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="news-detail-layout">
        <Sidebar />

        <div className="news-detail-content">
          <h2>Notícia não encontrada.</h2>
        </div>
      </div>
    );
  }

  const formattedDate = news.publishedAt
    ?.toDate()
    .toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="news-detail-layout">
      <Sidebar />

      <div className="news-detail-content">
        <button
          className="back-button"
          onClick={() => navigate(-1)}
        >
          ← Voltar
        </button>

        <div className="news-detail-card">
          <img
            src={news.image}
            alt={news.title}
            className="news-image"
          />

          <h1>{news.title}</h1>

          <span className="news-date">
            Publicado em {formattedDate}
          </span>

          <div className="news-text">
            {news.content
              .split("\n")
              .filter((line) => line.trim() !== "")
              .map((line, index) => {
                if (line.startsWith("## ")) {
                  return (
                    <h2
                      key={index}
                      className="news-subtitle"
                    >
                      {line.replace("## ", "")}
                    </h2>
                  );
                }

                return (
                  <p key={index}>
                    {line}
                  </p>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}