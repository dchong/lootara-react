import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/App.tsx
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Routes, Route, useLocation } from "react-router-dom";
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
    const hideLayout = location.pathname === "/" || location.pathname === "/coming-soon";
    return (_jsxs(_Fragment, { children: [!hideLayout && _jsx(Header, {}), _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/admin", element: _jsx(Admin, {}) }), _jsx(Route, { path: "/pokemon", element: _jsx(Pokemon, {}) }), _jsx(Route, { path: "/bearbricks", element: _jsx(Bearbricks, {}) }), _jsx(Route, { path: "/contacts", element: _jsx(ContactPage, {}) }), _jsx(Route, { path: "/terms-and-condition", element: _jsx(TermsAndConditions, {}) }), _jsx(Route, { path: "/shipping-returns", element: _jsx(ShippingReturns, {}) }), _jsx(Route, { path: "/privacy", element: _jsx(PrivacyPolicy, {}) }), _jsx(Route, { path: "/about-us", element: _jsx(AboutUs, {}) }), _jsx(Route, { path: "*", element: _jsx(ComingSoon, {}) })] }), !hideLayout && _jsx(Footer, {})] }));
}
export default App;
