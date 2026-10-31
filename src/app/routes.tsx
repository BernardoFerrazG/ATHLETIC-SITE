import { Suspense, lazy, type ComponentType, type ReactNode } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import PrivateRoute from "../features/auth/components/PrivateRoute";
import AdminRoute from "../features/auth/components/AdminRoute";

// Cada página vira um chunk separado, carregado só quando a rota é acessada.
// `named` adapta módulos que usam export nomeado ao formato exigido por React.lazy.
function named<T extends Record<string, unknown>>(
  loader: () => Promise<T>,
  name: keyof T
) {
  return lazy(() =>
    loader().then((module) => ({ default: module[name] as ComponentType }))
  );
}

const Landing = lazy(() => import("../pages/Landing"));
const Signup = lazy(() => import("../features/auth/pages/Signup"));
const Signin = lazy(() => import("../features/auth/pages/Signin"));

const Home = lazy(() => import("../features/home/pages/Home"));
const Games = lazy(() => import("../features/games/pages/Games"));
const GameDetails = lazy(() => import("../features/games/pages/GameDetails"));
const News = lazy(() => import("../features/news/pages/News"));
const NewsDetail = lazy(() => import("../features/news/pages/NewsDetail"));
const Loja = lazy(() => import("../features/loja/pages/Loja"));
const ProdutoDetalhe = lazy(() => import("../features/loja/pages/ProdutoDetalhe"));
const Carrinho = lazy(() => import("../features/loja/pages/Carrinho"));
const Ingressos = lazy(() => import("../features/ingressos/pages/Ingressos"));
const IngressosDetalhe = lazy(() => import("../features/ingressos/pages/IngressosDetalhe"));
const Profile = lazy(() => import("../features/users/pages/Profile"));
const OrderSummary = lazy(() => import("../features/orders/pages/OrderSummary"));
const Payment = lazy(() => import("../features/orders/pages/Payment"));
const PaymentIngresso = lazy(() => import("../features/orders/pages/PaymentIngresso"));
const HistoricoCompras = named(() => import("../features/loja/pages/HistoricoCompras"), "HistoricoCompras");
const DetalheIngresso = named(() => import("../features/loja/pages/DetalheIngresso"), "DetalheIngresso");
const AcompanharPedidos = named(() => import("../features/loja/pages/AcompanharPedidos"), "AcompanharPedidos");

const AdminHome = named(() => import("../features/home/pages/AdminHome"), "AdminHome");
const CreateGame = named(() => import("../features/games/pages/CreateGame"), "CreateGame");
const ManageGames = named(() => import("../features/games/components/ManageGames"), "ManageGames");
const CreateNews = named(() => import("../features/news/pages/CreateNews"), "CreateNews");
const AdminProducts = named(() => import("../features/loja/pages/admin/AdminProducts"), "AdminProducts");
const CreateProduct = named(() => import("../features/loja/pages/admin/CreateProduct"), "CreateProduct");
const EditProduct = named(() => import("../features/loja/pages/admin/EditProduct"), "EditProduct");
const AdminOrders = named(() => import("../features/orders/pages/admin/AdminOrders"), "AdminOrders");
const OrderDetail = named(() => import("../features/orders/pages/admin/OrderDetail"), "OrderDetail");

const privateRoutes: [string, ComponentType][] = [
  ["/home", Home],
  ["/jogos", Games],
  ["/jogos/:id", GameDetails],
  ["/noticias", News],
  ["/noticias/:id", NewsDetail],
  ["/ingressos", Ingressos],
  ["/ingressos/:id", IngressosDetalhe],
  ["/loja", Loja],
  ["/produto/:id", ProdutoDetalhe],
  ["/carrinho", Carrinho],
  ["/perfil", Profile],
  ["/resumo-pedido", OrderSummary],
  ["/pagamento", Payment],
  ["/pagamento-ingresso", PaymentIngresso],
  ["/meus-pedidos", AcompanharPedidos],
  ["/historico-compras", HistoricoCompras],
  ["/detalhe-ingresso/:id", DetalheIngresso],
];

const adminRoutes: [string, ComponentType][] = [
  ["/admin", AdminHome],
  ["/admin/cadastrar-jogo", CreateGame],
  ["/admin/gerenciar-jogos", ManageGames],
  ["/admin/cadastrar-noticias", CreateNews],
  ["/admin/produtos", AdminProducts],
  ["/admin/produtos/criar", CreateProduct],
  ["/admin/produtos/:id/editar", EditProduct],
  ["/admin/pedidos", AdminOrders],
  ["/admin/pedidos/:id", OrderDetail],
];

function withGuard(Guard: ComponentType<{ children: ReactNode }>, Page: ComponentType) {
  return (
    <Guard>
      <Page />
    </Guard>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/cadastro" element={<Signup />} />
        <Route path="/login" element={<Signin />} />

        {privateRoutes.map(([path, Page]) => (
          <Route key={path} path={path} element={withGuard(PrivateRoute, Page)} />
        ))}

        {adminRoutes.map(([path, Page]) => (
          <Route key={path} path={path} element={withGuard(AdminRoute, Page)} />
        ))}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
