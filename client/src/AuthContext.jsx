import jwt_decode from "jwt-decode";
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext({
  user: null,
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwt_decode(token);
      setUser(decoded);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token"); // Remove the token from localStorage
    setUser(null); // Clear the user state
    window.location.href = "/login"; // Redirect to login page
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
