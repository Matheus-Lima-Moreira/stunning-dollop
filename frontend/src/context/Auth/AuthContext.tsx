import { createContext } from "react";
import useAuth from "../../hooks/useAuth";

interface LoginData {
  email: string;
  password: string;
}

const AuthContext = createContext({
	isAuth: false,
	user: {},
	loading: true,
	handleLogin: (loginData: LoginData) => { },
	handleLogout: () => { }
});

const AuthProvider = ({ children }: any) => {
	const {
		isAuth,
		user,
		loading,
		handleLogin,
		handleLogout
	} = useAuth();
	
	return (
		<AuthContext.Provider value={{
			isAuth,
			user,
			loading,
			handleLogin,
			handleLogout
		}}>
			{children}
		</AuthContext.Provider>
	);
};

export { AuthContext, AuthProvider };