import { createContext, ReactNode, useContext } from "react";
import useAuth from "../../hooks/useAuth";

interface AuthContextType {
  isAuth: boolean;
  user: LoggedInUser | null;
  loading: boolean;
  handleLogin: (loginData: LoginData) => void;
  handleLogout: () => void;
  setUser: (user: LoggedInUser) => void;
}

const defaultAuthContext: AuthContextType = {
  isAuth: false,
  user: null,
  loading: true,
  handleLogin: (_loginData: LoginData) => {},
  handleLogout: () => {},
  setUser: (_user: LoggedInUser) => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const authHook = useAuth();

  return <AuthContext.Provider value={authHook}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);