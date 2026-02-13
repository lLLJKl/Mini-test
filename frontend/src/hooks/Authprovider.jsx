import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "@utils/network.js";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  const refreshAuth = async () => {
    try {
      const res = await api.get("/auth/me"); 
      setIsLogin(!!res.data?.status);
    } catch (e) {
      setIsLogin(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAuth();
  }, []);


  const setAuth = () => {
    setIsLogin(true);
    navigate("/");
  };

  const clearAuth = () => {
    setIsLogin(false);
    navigate("/");
  };

  const removeAuth = () => {
    api.post("/logout")
      .then((res) => {
        if (res.data?.status) clearAuth();
      })
      .catch((err) => console.error(err));
  };

  const checkAuth = () => isLogin;

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ isLogin, setAuth, removeAuth, clearAuth, checkAuth, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;