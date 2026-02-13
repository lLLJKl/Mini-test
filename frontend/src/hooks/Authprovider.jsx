import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "@utils/network.js";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();
  
  // refreshAuth: 서버에 "현재 쿠키(user)가 유효한 로그인 상태인지" 확인해서 isLogin 값을 업데이트하는 함수
  // 서버(/auth/me)가 쿠키를 검증한 결과(status)를 받아서 프론트 상태로 반영
  // 기존 localstorage에 로그인 상태 정보를 보관하던 방식에서 별도의 로그인 상태 정보를 식별할 수 있는 엔드포인트 (backend1: auth.py - /me)를 생성하여
  // 로그인 시에 로그인 상태를 조회하여 갱신해줍니다
  const refreshAuth = async () => {
    try {
      const res = await api.get("/auth/me"); 
      setIsLogin(!!res.data?.status);
    } catch (e) {
      setIsLogin(false);
    } 
  };

  // 컴포넌트가 처음 마운트(앱 시작/새로고침)될 때 딱 1번 실행
  // -> 쿠키가 있으면 로그인 유지되는 핵심 로직
  useEffect(() => {
    refreshAuth();
  }, []);

  // setAuth: 로그인 성공 직후(예: /code 성공) 호출해서
  // 서버에 다시 /auth/me 확인을 하고, 홈으로 이동시키는 함수

  const setAuth = async () => {
    setLoading(true);
    await refreshAuth(); 
    navigate("/");
  };

// removeAuth: 서버에 로그아웃을 요청해 쿠키를 삭제하는 실제 로그아웃 처리이고, clearAuth는 프론트 상태와 UI만 로그아웃처럼 바꾸는 상태 정리 함수다.
// 서버 로그아웃 요청이 네트워크 오류나 서버 문제로 실패해도, clearAuth를 사용하면 UI를 즉시 로그아웃 상태로 바꿔 사용자 혼란을 막을 수 있다.
// 쿠키 만료나 세션 종료로 /auth/me가 false가 될 경우, 서버 로그아웃을 호출할 필요 없이 clearAuth로 프론트 상태만 정리하면 된다.
// 로그인 필요 페이지 접근이나 인증 오류 상황에서도 clearAuth를 사용해 자동으로 로그아웃 UI 처리와 페이지 이동을 할 수 있다.
// 즉, removeAuth는 서버 처리용, clearAuth는 프론트 상태/UX 처리용으로 역할이 달라 둘 다 필요하다.

  const clearAuth = () => {
    setIsLogin(false);
    navigate("/");
  };
  
  // removeAuth: 실제 서버 로그아웃 요청
  // - POST /logout으로 쿠키(user) 삭제 요청
  // - 성공하면 clearAuth로 프론트 상태도 초기화
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