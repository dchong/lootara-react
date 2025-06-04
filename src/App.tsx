// src/App.tsx
import Header from "./components/Header";
import Footer from "./components/Footer";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Admin from "./pages/Admin"; // once you scaffold it
import Pokemon from "./pages/Pokemon";
import Bearbricks from "./pages/Bearbricks";
import ContactPage from "./pages/Contact";
import TermsAndConditions from "./pages/TermsAndCondition";
import ShippingReturns from "./pages/ShippingReturns";
//import Faqs from "./pages/Faqs";
import AboutUs from "./pages/AboutUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ComingSoon from "./pages/ComingSoon";

function App() {
  const location = useLocation();
  const hideLayout =
    location.pathname === "/" || location.pathname === "/coming-soon";

  return (
    <>
      {!hideLayout && <Header />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/pokemon" element={<Pokemon />} />
        <Route path="/bearbricks" element={<Bearbricks />} />
        <Route path="/contacts" element={<ContactPage />} />
        <Route path="/terms-and-condition" element={<TermsAndConditions />} />
        <Route path="/shipping-returns" element={<ShippingReturns />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        {/* <Route path="/faq" element={<Faqs />} />*/}
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="*" element={<ComingSoon />} />
      </Routes>
      {!hideLayout && <Footer />}
    </>
  );
}

export default App;
