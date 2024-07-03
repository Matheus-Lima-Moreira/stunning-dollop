import { useEffect, useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface LoginData {
  email: string;
  password: string;
}

const useAuth = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

      if (
        error?.response?.status === 403 &&
        !originalRequest._retry
      ) {
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
        api.defaults.headers.Authorization = '';
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
          toast.error(
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message
          );
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
      setUser(data.user);
      setIsAuth(true);
      toast.success("Login efetuado com sucesso!");

      navigate('/');

      setLoading(false);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message
      );
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);

    try {
      await api.delete("/logout");

      localStorage.removeItem("token");
      api.defaults.headers.Authorization = '';

      navigate('/login');

      setLoading(false);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message
      );
      setLoading(false);
    }
  };

  return {
    isAuth,
    user,
    loading,
    handleLogin,
    handleLogout
  };
};

export default useAuth;