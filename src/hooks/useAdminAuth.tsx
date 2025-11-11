import { useState, useEffect } from "react";

interface AdminSession {
  sessionToken: string;
  expiresAt: string;
}

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const sessionData = sessionStorage.getItem('admin_session');
    if (sessionData) {
      try {
        const session: AdminSession = JSON.parse(sessionData);
        const expiresAt = new Date(session.expiresAt);
        
        if (expiresAt > new Date()) {
          setIsAuthenticated(true);
        } else {
          sessionStorage.removeItem('admin_session');
          setIsAuthenticated(false);
        }
      } catch {
        sessionStorage.removeItem('admin_session');
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
    setLoading(false);
  };

  const login = (sessionToken: string, expiresAt: string) => {
    const session: AdminSession = { sessionToken, expiresAt };
    sessionStorage.setItem('admin_session', JSON.stringify(session));
    setIsAuthenticated(true);
  };

  const logout = () => {
    sessionStorage.removeItem('admin_session');
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    loading,
    login,
    logout,
  };
};
