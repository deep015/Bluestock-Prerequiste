import {  Routes, Route } from "react-router-dom";
import AuthLayout from "./layout/AuthLayout";
import HomePage from "./pages/HomePage";
import LoginForm from "./pages/LoginForm";
import RegisterForm from "./pages/RegisterForm";

function App() {
  return (
    
      <Routes>
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginForm />} />
          <Route path="register" element={<RegisterForm />} />
        </Route>
      </Routes>
    
  );
}

export default App;
