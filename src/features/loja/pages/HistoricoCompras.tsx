import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Link } from "react-router-dom";
import { FaTicketAlt, FaShoppingBag } from "react-icons/fa";
import { db, auth } from "../../../lib/firebase"; 
import Sidebar from "../../../components/Sidebar"; 
import type { OrderItem } from "../../orders/types/order";
import "../styles/HistoricoCompras.css";

export interface RegistroHistorico {
  id: string;
  createdAt: Date;
  status: string;
  total: number;
  paymentMethod: string;
  tipo: 'produto' | 'ingresso';
  
  // Campos de produto
  items?: OrderItem[];
  
  // Campos de ingresso
  ingressoTitle?: string;
  quantidadeIngresso?: number;
}

export function HistoricoCompras() {
  const [historico, setHistorico] = useState<RegistroHistorico[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarTodoOHistorico = async (userId: string) => {
      try {
        setLoading(true);
        const listaUnificada: RegistroHistorico[] = [];

        // 1. Busca Produtos
        const pedidosSnapshot = await getDocs(query(collection(db, "orders"), where("userId", "==", userId)));
        pedidosSnapshot.forEach((doc) => {
          const data = doc.data();
          listaUnificada.push({
            id: doc.id,
            createdAt: data.createdAt?.toDate() || new Date(),
            status: data.status,
            total: data.total,
            paymentMethod: data.paymentMethod,
            tipo: 'produto',
            items: data.items
          });
        });

        // 2. Busca Ingressos
        const ingressosSnapshot = await getDocs(query(collection(db, "ingressos_comprados"), where("userId", "==", userId)));
        ingressosSnapshot.forEach((doc) => {
          const data = doc.data();
          listaUnificada.push({
            id: doc.id,
            createdAt: data.createdAt?.toDate() || new Date(),
            status: data.status || "DELIVERED",
            total: data.total,
            paymentMethod: data.paymentMethod,
            tipo: 'ingresso',
            ingressoTitle: data.title,
            quantidadeIngresso: data.quantidade
          });
        });

        listaUnificada.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        setHistorico(listaUnificada);
      } catch (error) {
        console.error("Erro:", error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        carregarTodoOHistorico(user.uid);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="historico-page"><Sidebar /><div className="historico-container">Carregando...</div></div>;

  return (
    <div className="historico-page">
      <Sidebar />
      <div className="historico-container">
        <h2 className="historico-title">Histórico de Compras</h2>
        <div className="historico-lista">
          {historico.map((registro) => (
            <div key={registro.id} className={`historico-card card-${registro.tipo}`}>
              <div className="historico-header">
                <div>
                  {registro.tipo === 'ingresso' ? <FaTicketAlt color="#1F6E3C" /> : <FaShoppingBag />}
                  <strong> {registro.tipo === 'ingresso' ? 'Ingresso' : 'Pedido'} #{registro.id.slice(0, 8).toUpperCase()}</strong>
                </div>
              </div>

              <div className="historico-corpo">
                {registro.tipo === 'ingresso' ? (
                  <Link to={`/detalhe-ingresso/${registro.id}`} className="link-ingresso-card">
                    <p className="titulo-ingresso-comprado">{registro.ingressoTitle}</p>
                    <p>Quantidade: {registro.quantidadeIngresso} | Clique para ver o QR Code</p>
                  </Link>
                ) : (
                  <ul>{registro.items?.map((item, i) => <li key={i}>{item.name}</li>)}</ul>
                )}
                
                <p className="historico-total">Total: R$ {registro.total.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}