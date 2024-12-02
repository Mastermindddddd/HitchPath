import { Routes, Route } from "react-router-dom";
import ButtonGradient from "./assets/svg/ButtonGradient";
import Benefits from "./components/Benefits";
import { AuthProvider } from "./AuthContext";
import RegisterPage from "./components/register"; // Import the RegisterPage
import Login from "./components/login";
import Layout from "./layout";

const App = () => {
  return (
    <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<Login />} />
          </Route>
        </Routes>
      <ButtonGradient />
    </AuthProvider>
  );
};

export default App;
