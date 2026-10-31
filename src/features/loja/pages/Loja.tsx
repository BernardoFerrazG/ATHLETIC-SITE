import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import { useCart } from "../../../contexts/useCart";
import { getProducts } from "../services/products";
import type { Product } from "../types/products";
import "../styles/Loja.css";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default function Loja() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const { cart, removeFromCart, clearCart } = useCart();

  useEffect(() => {
    async function loadProducts() {
      const data = await getProducts();
      setProducts(data as Product[]);
    }

    void loadProducts();
  }, []);

  const visibleProducts = products.filter((product) => {
    const matchesName = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return product.available && matchesName;
  });

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="layout">
      <Sidebar />

      <div className="loja-wrapper">
        <div className="content">
          <input
            className="search"
            placeholder="Buscar produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="section-title">
            <h3>Produtos</h3>
          </div>

          <div className="news-grid">
            {visibleProducts.map((product) => (
              <div className="card" key={product.id}>
                <img src={product.image} alt={product.name} />

                <div className="card-content">
                  <p>{product.name}</p>
                  <p>{currencyFormatter.format(product.price)}</p>

                  <button
                    className="btn-produto"
                    onClick={() => navigate(`/produto/${product.id}`)}
                  >
                    Ver produto
                  </button>
                </div>
              </div>
            ))}
          </div>

          {visibleProducts.length === 0 && (
            <p style={{ marginTop: "24px" }}>
              Nenhum produto disponível no momento.
            </p>
          )}
        </div>

        <aside className="cart-sidebar">
          <h2>🛒 Carrinho</h2>

          {cart.length === 0 ? (
            <p>Seu carrinho está vazio.</p>
          ) : (
            <>
              <div className="cart-items">
                {cart.map((item) => (
                  <div className="cart-item" key={item.id}>
                    <img
                      src={item.image}
                      alt={item.name}
                    />

                    <div className="cart-info">
                      <h4>{item.name}</h4>

                      <p>
                        {item.quantity} ×{" "}
                        {currencyFormatter.format(item.price)}
                      </p>

                      <strong>
                        {currencyFormatter.format(
                          item.price * item.quantity
                        )}
                      </strong>

                      <button
                        className="remove-btn"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <hr />

              <div className="cart-total">
                <h3>Total</h3>
                <h2>{currencyFormatter.format(total)}</h2>
              </div>

              <button
                className="comprar-btn"
                onClick={() => navigate("/carrinho")}
              >
                Ver carrinho
              </button>

              <button
                className="clear-cart-btn"
                onClick={clearCart}
              >
                Limpar Carrinho
              </button>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}