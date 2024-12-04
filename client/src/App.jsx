import { Routes, Route } from "react-router-dom";
import ButtonGradient from "./assets/svg/ButtonGradient";
import Benefits from "./components/Benefits";
import { AuthProvider } from "./AuthContext";
import RegisterPage from "./pages/register";
import Login from "./pages/login";
import Layout from "./layout";
import DashboardPage from "./pages/dashboard";

const App = () => {
  return (
    <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>
        </Routes>
      <ButtonGradient />
    </AuthProvider>
  );
};

export default App;
