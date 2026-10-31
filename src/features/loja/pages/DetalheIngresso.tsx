import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase"; 
import { QRCodeSVG } from "qrcode.react";
import Sidebar from "../../../components/Sidebar";
import type { IngressoCompra } from "../../ingressos/types/ingressos";
import "../styles/DetalheIngresso.css";

export function DetalheIngresso() {
  const { id } = useParams();
  const [ingresso, setIngresso] = useState<IngressoCompra | null>(null);

  useEffect(() => {
    async function carregar() {
      if (id) {
        const docRef = doc(db, "ingressos_comprados", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setIngresso({ ...docSnap.data(), id: docSnap.id } as IngressoCompra);
        }
      }
    }
    carregar();
  }, [id]);

  if (!ingresso) return <div>Carregando...</div>;

  return (
    <div className="layout">
      <Sidebar />
      
      <div className="ingresso-page-full">
        <div className="ingresso-card-digital">
          <div className="ingresso-header">
            {/* Título do Jogo */}
            <h2>{ingresso.title || "Ingresso Athletic"}</h2>
            <p>Pedido: #{ingresso.id.slice(0, 8).toUpperCase()}</p>
          </div>
          
          <div className="qr-section">
            {/* Gerando um QR Code para cada unidade comprada */}
            {Array.from({ length: ingresso.quantidade || 1 }).map((_, index) => (
              <div key={index} style={{ marginBottom: "30px" }}>
                <QRCodeSVG value={`${ingresso.id}_${index}`} size={180} />
                <p>Ingresso {index + 1}</p>
              </div>
            ))}
          </div>

          <div className="ingresso-info-grid">
            <div>
              <label>Data do Jogo:</label> 
              <span>
                {/* Exibindo a data do jogo (dateTime) */}
                {ingresso.dateTime 
                  ? new Date(ingresso.dateTime).toLocaleDateString("pt-BR") 
                  : "Data não definida"}
              </span>
            </div>
            <div>
              <label>Total Pago:</label> 
              <span>R$ {ingresso.total ? ingresso.total.toFixed(2) : "0.00"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}