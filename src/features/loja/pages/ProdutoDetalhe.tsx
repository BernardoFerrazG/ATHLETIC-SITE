import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../../../contexts/useCart";
import Sidebar from "../../../components/Sidebar";
import { getProductById } from "../services/products";
import type { Product } from "../types/products";
import "../styles/ProdutoDetalhe.css";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default function ProdutoDetalhe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [cep, setCep] = useState("");
  const [shipping, setShipping] = useState<number | null>(null);

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;

      const data = await getProductById(id);
      setProduct(data);
    }

    void loadProduct();
  }, [id]);

  function calculateShipping() {
    if (!cep.trim()) return;

    const fakeShipping = 25;
    setShipping(fakeShipping);
  }

  function handleQuantityChange(value: number) {
    if (!product) return;

    const clamped = Math.min(Math.max(value, 1), Math.max(product.stock, 1));
    setQuantity(clamped);
  }

  function handleComprar() {
    if (!product) return;

    if (product.stock <= 0) {
      alert("Produto sem estoque disponível no momento.");
      return;
    }

    if (quantity > product.stock) {
      alert(`Só temos ${product.stock} unidade(s) em estoque.`);
      return;
    }

    addToCart(product, quantity);
    alert(`${quantity}x ${product.name} adicionado ao carrinho!`);
  }

  if (!product) {
    return <h1>Carregando...</h1>;
  }

  const semEstoque = product.stock <= 0;

  return (
    <div className="layout">
      <Sidebar />

      <div className="produto-container">
        <div className="produto-content">

          <button
            className="back-button"
            onClick={() => navigate(-1)}
          >
            ← Voltar
          </button>

          <div className="produto-carousel">
            <img
              src={product.image}
              alt={product.name}
              className="produto-imagem"
            />
          </div>

          <div className="produto-info">
            <h1>{product.name}</h1>

            <h2 className="produto-preco">
              {currencyFormatter.format(product.price)}
            </h2>

            <p className="produto-estoque">
              {semEstoque
                ? "Produto esgotado"
                : `Em estoque: ${product.stock} unidade(s)`}
            </p>

            <div className="produto-descricao-card">
              <h3>Descrição do Produto</h3>
              <p>{product.description}</p>
            </div>

            <p className="produto-categoria">
              <strong>Categoria:</strong> {product.category}
            </p>

            <div className="campo">
              <label>Quantidade</label>

              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                disabled={semEstoque}
                onChange={(e) => handleQuantityChange(Number(e.target.value))}
              />
            </div>

            <div className="campo">
              <label>Consultar frete</label>

              <input
                type="text"
                placeholder="Digite seu CEP"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
              />

              <button
                className="frete-btn"
                onClick={calculateShipping}
              >
                Consultar
              </button>

              {shipping !== null && (
                <p className="produto-frete">
                  Frete: R$ {shipping}
                </p>
              )}
            </div>

            <button
              className="comprar-btn"
              onClick={handleComprar}
              disabled={semEstoque}
            >
              {semEstoque ? "Esgotado" : "Adicionar ao carrinho"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}