import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Sidebar from "../../../components/Sidebar";
import { useCart } from "../../../contexts/useCart";
import { auth } from "../../../lib/firebase";

import { createOrder } from "../services/orderService";
import { decreaseProductStock } from "../../loja/services/products";

import "../styles/Payment.css";

export default function Payment() {
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const location = useLocation();

  const items = location.state?.items || [];
  const total = location.state?.total || 0;

  const [selectedMethod, setSelectedMethod] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!selectedMethod) {
      alert("Selecione uma forma de pagamento.");
      return;
    }

    try {
      setLoading(true);

      const user = auth.currentUser;

      if (!user) {
        alert("Usuário não autenticado.");
        return;
      }

      await createOrder({
        userId: user.uid,
        items,
        total,
        paymentMethod: selectedMethod,
        status: "pendente",
      });

      for (const item of items) {
        await decreaseProductStock(item.id, item.quantity);
      }

      clearCart();

      alert("Compra realizada com sucesso!");

      navigate("/home");
    } catch (error) {
      console.error(error);
      alert("Erro ao finalizar compra.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-layout">
      <Sidebar />

      <div className="payment-content">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Voltar
        </button>

        <h1>Forma de Pagamento</h1>

        <div className="payment-card">
          <label className="payment-option">
            <input
              type="radio"
              name="payment"
              value="PIX"
              checked={selectedMethod === "PIX"}
              onChange={(e) => setSelectedMethod(e.target.value)}
            />
            <span>PIX</span>
          </label>

          <label className="payment-option">
            <input
              type="radio"
              name="payment"
              value="Cartão de Crédito"
              checked={selectedMethod === "Cartão de Crédito"}
              onChange={(e) => setSelectedMethod(e.target.value)}
            />
            <span>Cartão de Crédito</span>
          </label>

          <label className="payment-option">
            <input
              type="radio"
              name="payment"
              value="Cartão de Débito"
              checked={selectedMethod === "Cartão de Débito"}
              onChange={(e) => setSelectedMethod(e.target.value)}
            />
            <span>Cartão de Débito</span>
          </label>

          <label className="payment-option">
            <input
              type="radio"
              name="payment"
              value="Boleto"
              checked={selectedMethod === "Boleto"}
              onChange={(e) => setSelectedMethod(e.target.value)}
            />
            <span>Boleto Bancário</span>
          </label>

          <div className="payment-total">
            <span>Total:</span>
            <strong>R$ {total.toFixed(2)}</strong>
          </div>

          <button className="confirm-payment" onClick={handleConfirm} disabled={loading}>
            {loading ? "Processando..." : "Confirmar Pagamento"}
          </button>
        </div>
      </div>
    </div>
  );
}