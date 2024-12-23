import { Routes, Route } from "react-router-dom";
import ButtonGradient from "./assets/svg/ButtonGradient";
import Benefits from "./components/Benefits";
import { AuthProvider } from "./AuthContext";
import RegisterPage from "./pages/register";
import Login from "./pages/login";
import Layout from "./layout";
import DashboardPage from "./pages/dashboard";
import UserInfoForm from "./pages/UserInfoForm";
import LearningPathWithBackground from "./pages/LearningPathWithBackground";
import Chatbot from "./pages/Chatbot";
import SpecificTopicPath from "./pages/SpecificTopicPath";

const App = () => {
  return (
    <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/user-info" element={<UserInfoForm />} />
            <Route path="/learning-path" element={<LearningPathWithBackground />} />
            <Route path="/guidemate-AI" element={<Chatbot />} />
            <Route path="/generate-path" element={<SpecificTopicPath />} />
          </Route>
        </Routes>
      <ButtonGradient />
    </AuthProvider>
  );
};

export default App;
