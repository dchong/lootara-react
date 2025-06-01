// src/App.tsx
import Header from "./components/Header";
import Footer from "./components/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Admin from "./pages/Admin"; // once you scaffold it
import Pokemon from "./pages/Pokemon";
import Bearbricks from "./pages/Bearbricks";
import ContactPage from "./pages/Contact";

function App() {
  return (
    <>
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/pokemon" element={<Pokemon />} />
          <Route path="/bearbricks" element={<Bearbricks />} />
          <Route path="/contacts" element={<ContactPage />} />
          <Route path="*" element={<Pokemon />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </>
  );
}

export default App;
