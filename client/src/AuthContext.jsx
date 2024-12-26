import jwt_decode from "jwt-decode";
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext({
  user: null,
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwt_decode(token);
      setUser({ name: decoded.name, email: decoded.email });
    }
    setIsLoading(false); // Loading complete
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading spinner
  }

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
