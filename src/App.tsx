import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Cases from "./pages/Cases";
import Lawyer from "./pages/Lawyer";
import Process from "./pages/Process";
import Contact from "./pages/Contact";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCases from "./pages/admin/AdminCases";
import AdminLawyers from "./pages/admin/AdminLawyers";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminPopups from "./pages/admin/AdminPopups";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="cases" element={<Cases />} />
          <Route path="lawyer" element={<Lawyer />} />
          <Route path="process" element={<Process />} />
          <Route path="contact" element={<Contact />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="cases" element={<AdminCases />} />
          <Route path="lawyer" element={<AdminLawyers />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="popups" element={<AdminPopups />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
