import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../contexts/useCart";
import { FaTrash, FaShoppingBag } from "react-icons/fa";
import Sidebar from "../../../components/Sidebar";

import { getProductById } from "../services/products";

import "../styles/Carrinho.css";

export default function Carrinho() {
  const { cart, removeFromCart } = useCart();
  const navigate = useNavigate();

  const [processing, setProcessing] = useState(false);
  const [stockError, setStockError] = useState<string | null>(null);

  const valorTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleIrPagamento = async () => {
    if (cart.length === 0) return;

    setProcessing(true);
    setStockError(null);

    try {
      for (const item of cart) {
        const product = await getProductById(item.id);

        if (!product || product.stock < item.quantity) {
          setStockError(
            `Estoque insuficiente para "${item.name}". Disponível: ${
              product?.stock ?? 0
            }`
          );
          setProcessing(false);
          return;
        }
      }

      navigate("/pagamento", {
        state: {
          items: cart,
          total: valorTotal,
        },
      });
    } catch (error) {
      console.error(error);
      setStockError("Erro ao validar estoque.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="carrinho-page">
      <Sidebar />

      <div className="carrinho-container">
        <div className="carrinho-header">
          <FaShoppingBag size={24} />
          <h2>Meu Carrinho</h2>
        </div>

        {cart.length === 0 ? (
          <div className="carrinho-vazio">
            <p>Seu carrinho está vazio.</p>

            <button className="btn-voltar" onClick={() => navigate("/loja")}>
              Voltar para a Loja
            </button>
          </div>
        ) : (
          <>
            <div className="carrinho-lista">
              {cart.map((item) => (
                <div className="carrinho-item" key={item.id}>
                  <img src={item.image} alt={item.name} />

                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p className="item-categoria">{item.category}</p>
                    <p className="item-preco">
                      R$ {item.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="item-acoes">
                    <span>Qtd: {item.quantity}</span>

                    <button
                      className="btn-remover"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="carrinho-resumo">
              <div className="resumo-linha">
                <span>Total:</span>
                <strong>R$ {valorTotal.toFixed(2)}</strong>
              </div>

              {stockError && (
                <p className="carrinho-erro-estoque">{stockError}</p>
              )}

              <button
                className="btn-finalizar"
                onClick={handleIrPagamento}
                disabled={processing}
              >
                {processing ? "Validando..." : "Ir para Pagamento"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}