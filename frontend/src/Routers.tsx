import { Navigate, Route, Routes } from "react-router-dom";
import { AuthCallbackPage } from "./pages/AuthCallbackPage";
import { LoginPage } from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ContactAdministrator from "./pages/ContactAdministrator";
import SelectLocationPage from "./pages/SelectLocationPage";
import NotFound from "./pages/NotFound";
import { useSelector } from "react-redux";
import Location from "./components/dashboard/Location";
import Plant from "./components/dashboard/Plant";
import Admin from "./pages/Admin";
import User from "./components/admin/User";
import AdminLocation from "./components/admin/AdminLocation";
import Area from "./components/admin/Area";
function Routers() {
  const token = useSelector(
    (state: any) => state.auth.accessToken
  );
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/select-location" />} />
      <Route
        path="/dashboard"
        element={token ? <Dashboard /> : <Navigate to="/login" />}
      >
        <Route index element={<Navigate to="location" />} />
        <Route path="location" element={<Location />} />
        <Route path="plant" element={<Plant />} />
      </Route>
      <Route path="/login" element={token ? <Navigate to="/" /> : <LoginPage />} />
      <Route path="/auth/entra/callback" element={<AuthCallbackPage />} />
      <Route path="/contact-administrator" element={<ContactAdministrator />} />
      <Route path="/select-location" element={token ? <SelectLocationPage /> : <Navigate to="/login" />} />
      <Route path="/admin" element={token ? <Admin /> : <Navigate to="/login" />}>
        <Route index element={<Navigate to="user" />} />
        <Route path="user" element={<User />} />
        <Route path="location" element={<AdminLocation />} />
        <Route path="area" element={<Area />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default Routers;