import { createContext, useEffect, useState } from "react";
import { type User, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import { getUserProfile } from "../../users/services/userService";

interface AuthUser extends User {
  role?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Mantém as rotas protegidas em espera até o perfil (e a role) carregar,
        // evitando redirecionar o usuário recém-logado para /login ou /home.
        setLoading(true);
        try {
          const userProfile = await getUserProfile(firebaseUser.uid);
          const authUser = {
            ...firebaseUser,
            role: userProfile?.role || "torcedor",
          };
          setUser(authUser);
        } catch (error) {
          console.error("Erro ao buscar perfil do usuário:", error);
          setUser(firebaseUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };