import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../contexts/useCart"; 
import { 
  FaHome, 
  FaNewspaper, 
  FaFutbol, 
  FaShoppingCart, 
  FaShoppingBag, 
  FaTicketAlt, 
  FaUser,
  FaHistory,
  FaBoxOpen
} from "react-icons/fa";

export default function Sidebar() {
  
  const { cart } = useCart();
  const totalItens = cart.reduce((total, item) => total + item.quantity, 0);

  const location = useLocation();
  const currentPath = location.pathname;

  const [open, setOpen] = useState(false);

  return (
    <>
      <style>
        {`
          .sidebar {
            width: 240px;
            background: #0a0a0a;
            height: 100vh;
            padding: 20px 16px;
            position: fixed;
            top: 0;
            left: 0;
            display: flex;
            flex-direction: column;
            z-index: 100;
            transition: 0.3s;
          }

          .sidebar h2 {
            color: #ffffff;
            margin-bottom: 40px;
            margin-top: 0;
            font-size: 20px;
            text-align: center;
            padding-bottom: 16px;
            border-bottom: 1px solid #333;
          }

          .menu-item {
            padding: 12px 16px;
            margin-bottom: 8px;
            border-radius: 12px;
            cursor: pointer;
            color: #e0e0e0;
            display: flex;
            align-items: center;
            gap: 14px;
            font-size: 15px;
            transition: all 0.2s ease;
          }

          .menu-item:hover {
            background: #1a1a1a;
            color: white;
          }

          .menu-item.active {
            background: #1F6E3C;
            color: white;
            font-weight: 500;
          }

          /* BOTÃO HAMBURGUER */
          .menu-button {
            display: none;
          }

          /* FUNDO ESCURO */
          .overlay {
            display: none;
          }

          /* MOBILE */
          @media (max-width: 768px) {

            .menu-button {
              display: flex;

              position: fixed;
              top: 16px;
              right: 16px;

              width: 42px;
              height: 42px;

              background: #111;
              color: white;

              border-radius: 10px;

              align-items: center;
              justify-content: center;

              font-size: 22px;

              z-index: 300;

              cursor: pointer;
            }

            .overlay {
              display: block;

              position: fixed;
              inset: 0;

              background: rgba(0,0,0,0.4);

              opacity: ${open ? 1 : 0};
              pointer-events: ${open ? "all" : "none"};

              transition: 0.3s;

              z-index: 150;
            }

            .sidebar {
              transform: ${
                open
                  ? "translateX(0)"
                  : "translateX(-100%)"
              };

              width: 220px;

              z-index: 200;
            }

            .sidebar h2 {
              margin-top: 20px;
            }
          }
        `}
      </style>

      {/* BOTÃO */}
      <div
        className="menu-button"
        onClick={() => setOpen(true)}
      >
        ☰
      </div>

      {/* OVERLAY */}
      <div
        className="overlay"
        onClick={() => setOpen(false)}
      />

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>Athletic Clube</h2>

        <a href="/home" style={{ textDecoration: "none" }}>
          <div
            className={`menu-item ${
              currentPath === "/home"
                ? "active"
                : ""
            }`}
          >
          </div>
        </a>

        <a href="/home" style={{ textDecoration: "none" }}>
          <div className={`menu-item ${currentPath === "/home" ? "active" : ""}`}>
            <FaHome size={20} />
            <span>Home</span>
          </div>
        </a>

        <a href="/noticias" style={{ textDecoration: "none" }}>
          <div className={`menu-item ${currentPath === "/noticias" ? "active" : ""}`}>
            <FaNewspaper size={20} />
            <span>Notícias</span>
          </div>
        </a>

        <a href="/jogos" style={{ textDecoration: "none" }}>
          <div className={`menu-item ${currentPath === "/jogos" ? "active" : ""}`}>
            <FaFutbol size={20} />
            <span>Jogos</span>
          </div>
        </a>

        <a href="/loja" style={{ textDecoration: "none" }}>
          <div className={`menu-item ${currentPath === "/loja" ? "active" : ""}`}>
            <FaShoppingCart size={20} />
            <span>Loja</span>
          </div>
        </a>

        <a href="/carrinho" style={{ textDecoration: "none" }}>
          <div className={`menu-item ${currentPath === "/carrinho" ? "active" : ""}`}>
            <FaShoppingBag size={20} />
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              Carrinho
              {totalItens > 0 && (
                <span style={{
                  background: '#ff4d4d',
                  color: 'white',
                  borderRadius: '50%',
                  padding: '2px 8px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  {totalItens}
                </span>
              )}
            </span>
          </div>
        </a>

        <a href="/meus-pedidos" style={{ textDecoration: "none" }}>
          <div className={`menu-item ${currentPath === "/meus-pedidos" ? "active" : ""}`}>
            <FaBoxOpen size={20} />
            <span>Meus Pedidos</span>
          </div>
        </a>


        <a href="/historico-compras" style={{ textDecoration: "none" }}>
          <div className={`menu-item ${currentPath === "/historico-compras" ? "active" : ""}`}>
            <FaHistory size={20} />
            <span>Histórico de Compras</span>
          </div>
        </a>

        <a href="/ingressos" style={{ textDecoration: "none" }}>
          <div className={`menu-item ${currentPath === "/ingressos" ? "active" : ""}`}>
            <FaTicketAlt size={20} />
            <span>Ingressos</span>
          </div>
        </a>

        <a href="/perfil" style={{ textDecoration: "none" }}>
          <div className={`menu-item ${currentPath === "/perfil" ? "active" : ""}`}>
            <FaUser size={20} />
            <span>Perfil</span>
          </div>
        </a>
      </div>
    </>
  );
}