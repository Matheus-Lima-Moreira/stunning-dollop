import { BrowserRouter, Route, Routes as RoutesReact } from "react-router-dom";
import Login from "../pages/login";
import Users from "../pages/users";
import { AuthProvider } from "../context/Auth/AuthContext";
import { ToastContainer } from "react-toastify";
import Layout from "@/pages/layout";
import Home from "@/pages/home";
import { ThemeProvider } from "@/context/Theme/ThemeContext";

const Routes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <RoutesReact>
            <Route path="*" Component={Login} />

            <Route
              path="/"
              element={
                <Layout>
                  <Home />
                </Layout>
              }
            />

            <Route
              path="/users"
              element={
                <Layout>
                  <Users />
                </Layout>
              }
            />
          </RoutesReact>

          <ToastContainer autoClose={3000} closeOnClick={true} position="bottom-right" hideProgressBar={true} closeButton={false} />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Routes;
