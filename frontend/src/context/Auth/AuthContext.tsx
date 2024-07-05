import { createContext } from "react";
import useAuth from "../../hooks/useAuth";

const AuthContext = createContext<{
  isAuth: boolean;
  user: LoggedInUser | null;
  loading: boolean;
  handleLogin: (loginData: LoginData) => void;
  handleLogout: () => void;
  setUser: (user: LoggedInUser) => void;
}>({
  isAuth: false,
  user: null,
  loading: true,
  handleLogin: (_loginData: LoginData) => {},
  handleLogout: () => {},
  setUser: (_user: LoggedInUser) => {},
});

const AuthProvider = ({ children }: any) => {
  const { isAuth, user, loading, handleLogin, handleLogout, setUser } = useAuth();

  return (
    <AuthContext.Provider
      value={{
        isAuth,
        user,
        loading,
        handleLogin,
        handleLogout,
        setUser
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
