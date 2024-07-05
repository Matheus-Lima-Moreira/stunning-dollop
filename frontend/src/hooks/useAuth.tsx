import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const useAuth = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers["Authorization"] = `Bearer ${JSON.parse(token)}`;
        setIsAuth(true);
      }

      return config;
    },

    (error) => {
      Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      return response;
    },

    async (error) => {
      const originalRequest = error.config;

      if (error?.response?.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;

        const { data } = await api.post(`/auth/refresh_token`);

        if (data) {
          localStorage.setItem("token", JSON.stringify(data.token));
          api.defaults.headers.Authorization = `Bearer ${data.token}`;
        }

        return api(originalRequest);
      }

      if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        api.defaults.headers.Authorization = "";
        setIsAuth(false);
      }

      return Promise.reject(error);
    }
  );

  useEffect(() => {
    const token = localStorage.getItem("token");

    (async () => {
      if (token) {
        try {
          const { data } = await api.post(`/refresh_token`);
          api.defaults.headers.Authorization = `Bearer ${data.token}`;
          setIsAuth(true);
          setUser(data.user);
        } catch (error: any) {
          toast({ title: error?.response?.data?.message || error?.response?.data?.error || error?.message });
        }
      }
      setLoading(false);
    })();
  }, []);

  const handleLogin = async (loginData: LoginData) => {
    setLoading(true);

    try {
      const { data } = await api.post(`/login`, loginData);

      localStorage.setItem("token", JSON.stringify(data.token));
      api.defaults.headers.Authorization = `Bearer ${data.token}`;
      console.log("data.user", data.user);

      setUser(data.user);
      setIsAuth(true);
      toast({
        title: "Login efetuado com sucesso!",
      });

      navigate("/");

      setLoading(false);
    } catch (error: any) {
      toast({ title: error?.response?.data?.message || error?.response?.data?.error || error?.message });
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);

    try {
      await api.delete("/logout");

      localStorage.removeItem("token");
      api.defaults.headers.Authorization = "";

      navigate("/login");

      setLoading(false);
    } catch (error: any) {
      toast({ title: error?.response?.data?.message || error?.response?.data?.error || error?.message });
      setLoading(false);
    }
  };

  return {
    isAuth,
    user,
    loading,
    handleLogin,
    handleLogout,
    setUser
  };
};

export default useAuth;
