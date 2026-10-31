import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/context/useAuth";
import "./Landing.css";

const features = [
  {
    title: "Jogos e notícias",
    description: "Calendário de partidas, resultados e as últimas notícias do clube em um só lugar.",
  },
  {
    title: "Ingressos com QR Code",
    description: "Compre ingressos online e apresente o QR Code gerado na entrada do estádio.",
  },
  {
    title: "Loja oficial",
    description: "Camisas e produtos do clube com carrinho, pagamento e acompanhamento do pedido.",
  },
];

export default function Landing() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user) {
    return <Navigate to={user.role === "administrador" ? "/admin" : "/home"} replace />;
  }

  return (
    <main className="landing">
      <header className="landing-nav">
        <div className="landing-brand">
          <img src="/logo_athletic.png" alt="" width={36} height={36} />
          <span>Athletic Club</span>
        </div>
        <Link to="/login" className="landing-link">
          Entrar
        </Link>
      </header>

      <section className="landing-hero">
        <div className="landing-hero-text">
          <h1>Tudo do Athletic, do apito inicial à arquibancada.</h1>
          <p>
            Acompanhe os jogos, garanta seu ingresso e vista a camisa do clube — em uma única
            plataforma para torcedores e administração.
          </p>
          <div className="landing-actions">
            <Link to="/cadastro" className="landing-btn landing-btn-primary">
              Criar conta
            </Link>
            <Link to="/login" className="landing-btn landing-btn-secondary">
              Já tenho conta
            </Link>
          </div>
        </div>
        <img className="landing-hero-image" src="/time.jpg" alt="Elenco do Athletic Club" />
      </section>

      <section className="landing-features">
        {features.map((feature) => (
          <article key={feature.title} className="landing-feature">
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
