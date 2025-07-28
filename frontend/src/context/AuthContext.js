import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { message } from 'antd';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // 检查token是否过期
        if (decoded.exp * 1000 > Date.now()) {
          setUser({ id: decoded.id, role: decoded.role });
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = (token) => {
    const decoded = jwtDecode(token);
    setUser({ id: decoded.id, role: decoded.role });
    localStorage.setItem('token', token);
    message.success('登录成功');
    window.location.href = '/';
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    message.success('已退出登录');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
}; 