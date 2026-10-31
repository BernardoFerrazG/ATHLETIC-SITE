import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { FaBoxOpen } from 'react-icons/fa'; 
import { db, auth } from '../../../lib/firebase'; 
import Sidebar from '../../../components/Sidebar';
import '../styles/AcompanharPedidos.css'; 

export interface ItemPedido {
  id?: string;
  productId?: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Pedido {
  id: string;
  userId: string;
  createdAt: Date;
  status: string;
  total: number;
  items: ItemPedido[];
  paymentMethod: string;
}

export const AcompanharPedidos: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string>('');

  useEffect(() => {
    const buscarPedidos = async (userId: string) => {
      try {
        const pedidosRef = collection(db, 'orders');
        const q = query(
          pedidosRef, 
          where('userId', '==', userId),
          orderBy('createdAt', 'desc') 
        );

        const querySnapshot = await getDocs(q);
        const listaPedidos: Pedido[] = [];

        querySnapshot.forEach((doc) => {
          const dados = doc.data();
          listaPedidos.push({
            id: doc.id,
            userId: dados.userId,
            createdAt: dados.createdAt.toDate(), 
            status: dados.status,
            total: dados.total,
            items: dados.items,
            paymentMethod: dados.paymentMethod
          });
        });

        setPedidos(listaPedidos);
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        setErro('Não foi possível carregar os pedidos no momento.');
      } finally {
        setCarregando(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        buscarPedidos(user.uid);
      } else {
        setErro('Você precisa estar logado para ver seus pedidos.');
        setCarregando(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const classeDoStatus = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'status-entregue';
      case 'SHIPPED': return 'status-enviado';
      case 'PENDING': return 'status-pendente';
      case 'CANCELED': return 'status-cancelado';
      default: return 'status-default';
    }
  };

  if (carregando) return (
    <div className="pedidos-page">
      <Sidebar />
      <div className="pedidos-container"><p>Carregando seus pedidos...</p></div>
    </div>
  );
  
  if (erro) return (
    <div className="pedidos-page">
      <Sidebar />
      <div className="pedidos-container"><p>{erro}</p></div>
    </div>
  );

  return (
    <div className="pedidos-page">
      {/* Sidebar adicionado de volta aqui */}
      <Sidebar /> 
      
      <div className="pedidos-container">
        <h2 className="pedidos-title">Meus Pedidos</h2>
        
        {pedidos.length === 0 ? (
          <div className="pedidos-vazio">
            <FaBoxOpen size={64} color="#333" />
            <h3 style={{ color: "#000" }}>Nenhum pedido encontrado</h3>
            <p style={{ color: "#333" }}>Você ainda não realizou nenhuma compra no Athletic Clube.</p>
            <Link to="/loja" className="btn-loja" style={{ background: "#1F6E3C", color: "white", padding: "10px 20px", textDecoration: "none", borderRadius: "8px" }}>Ir para a Loja</Link>
          </div>
        ) : (
          <div className="pedidos-list">
            {pedidos.map((pedido) => (
              <div key={pedido.id} className="pedido-card">
                
                <div className="pedido-header">
                  <span className="pedido-id">#{pedido.id.slice(0, 8).toUpperCase()}</span>
                  <span className={`pedido-status ${classeDoStatus(pedido.status)}`}>
                    {pedido.status === 'PENDING' ? 'Pendente' : pedido.status}
                  </span>
                </div>

                <div className="pedido-info">
                  <span><strong>Data:</strong> {pedido.createdAt.toLocaleDateString('pt-BR')} às {pedido.createdAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                  <span><strong>Pagamento:</strong> {pedido.paymentMethod}</span>
                </div>
                
                <div className="pedido-itens">
                  <strong>Itens do Pedido:</strong>
                  <ul>
                    {pedido.items.map((item, index) => (
                      <li key={index}>
                        <span>{item.quantity}x {item.name}</span>
                        <span>R$ {item.price.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pedido-footer">
                  <strong className="pedido-total">Total: R$ {pedido.total.toFixed(2)}</strong>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};