// src/App.tsx
import Header from "./components/Header";
import Footer from "./components/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Admin from "./pages/Admin"; // once you scaffold it
import Pokemon from "./pages/Pokemon";

function App() {
  return (
    <>
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/pokemon" element={<Pokemon />} />
          <Route path="*" element={<Pokemon />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </>
  );
}

export default App;
