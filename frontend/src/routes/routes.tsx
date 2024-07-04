import { BrowserRouter, Route, Routes as RoutesReact } from "react-router-dom";
import Login from "../pages/login";
import Users from "../pages/users";
import { AuthProvider } from "../context/Auth/AuthContext";
import Layout from "@/pages/layout";
import Home from "@/pages/home";
import { ThemeProvider } from "@/context/Theme/ThemeContext";
import { Toaster } from "@/components/ui/toaster";

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

          <Toaster />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Routes;
