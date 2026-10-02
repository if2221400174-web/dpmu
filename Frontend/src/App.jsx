import { useEffect } from "react"
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom"

import Login from "./pages/auth/login"


import AdminLayout from "./layouts/admin"
import Dashboard from "./pages/admin"
import Home from "./pages/public"
import AdminUser from "./pages/admin/users"
import EditUser from "./pages/admin/users/edit"
import AdminBeritaDpm from "./pages/admin/beritadpm"
import BeritaDpmCreate from "./pages/admin/beritadpm/create"
import BeritaDpmEdit from "./pages/admin/beritadpm/edit"
import AdminKritikDpm from "./pages/admin/kritik_dpm"
import CreateKritikDpm from "./pages/admin/kritik_dpm/create"
import EditKritikDpm from "./pages/admin/kritik_dpm/edit"
import AdminPengaduan from "./pages/admin/pengaduan"
import PengaduanCreate from "./pages/admin/pengaduan/create"
import PengaduanEdit from "./pages/admin/pengaduan/edit"
import AdminProdukHukum from "./pages/admin/produkHukum"
import ProdukHukumCreate from "./pages/admin/produkHukum/create"
import AdminStrukturDpm from "./pages/admin/strukturdpm"
import StrukturCreate from "./pages/admin/strukturdpm/create"
import StrukturEdit from "./pages/admin/strukturdpm/edit"
import AdminTentangDpm from "./pages/admin/tentangdpm"
import EditTentangDpm from "./pages/admin/tentangdpm/edit"
import CreateTentangDpm from "./pages/admin/tentangdpm/create"
import CreateUser from "./pages/admin/users/create"
import ProdukHukumEdit from "./pages/admin/produkHukum/edit"
import AdminKeputusan from "./pages/admin/keputusan"
import KeputusanCreate from "./pages/admin/keputusan/create"
import KeputusanEdit from "./pages/admin/keputusan/edit"
import PublicLayout from "./layouts/public"
import PublikProdukHukum from "./pages/public/produkhukum"
import ShowProdukHukum from "./pages/public/produkhukum/show"
import PublikKeputusan from "./pages/public/keputusan"
import ShowKeputusan from "./pages/public/keputusan/show"
import PublikPengaduan from "./pages/public/pengaduan"
import PublikKritikSaran from "./pages/public/pengaduan/formkritik"
import PublikAspirasi from "./pages/public/pengaduan/formaspirasi"
import PublikBeritaDpm from "./pages/public/beritadpm"
import ShowBeritaDpm from "./pages/public/beritadpm/show"
import PublikProfil from "./pages/public/profil"
import ForgotPassword from "./pages/auth/ForgotPassword"
import ResetPassword from "./pages/auth/ResetPassword"

// ==========================================
// 1. KOMPONEN SCROLL TO TOP DITAMBAHKAN DI SINI
// ==========================================
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
// ==========================================

function App() {

  return (
    <>
      <BrowserRouter>
      
      {/* 2. PANGGIL KOMPONENNYA DI SINI */}
      <ScrollToTop />

      <Routes>
        {/* Public */}
        <Route element={<PublicLayout/>}>
          <Route path="/" element={<Home/>}/>
          <Route path="produkhukum" element={<PublikProdukHukum />} />
          <Route path="produkhukum/:id" element={<ShowProdukHukum />} />
          <Route path="keputusan" element={<PublikKeputusan />} />
          <Route path="keputusan/:id" element={<ShowKeputusan />} />
          <Route path="pengaduan" element={<PublikPengaduan/>} />
          <Route path="kritik-saran" element={<PublikKritikSaran/>} />
          <Route path="aspirasi" element={<PublikAspirasi/>} />
          <Route path="informasi" element={<PublikBeritaDpm/>} />
          <Route path="informasi/:id" element={<ShowBeritaDpm/>} />
          <Route path="/profil" element={<PublikProfil />} />
        </Route>

        {/* Auth */}
        <Route path="/login" element={<Login/>}/>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />  

        {/* admin */}
        <Route path="admin" element={<AdminLayout/>}>
          <Route index element={<Dashboard/>}/>
          <Route path="users">
            <Route index element={<AdminUser/>}/>
            <Route path="create" element={<CreateUser/>}/>
            <Route path="edit/:id" element={<EditUser/>}/>
          </Route>
          <Route path="beritadpm">
            <Route index element={<AdminBeritaDpm/>}/>
            <Route path="create" element={<BeritaDpmCreate/>}/>
            <Route path="edit/:id" element={<BeritaDpmEdit/>}/>
          </Route>
          <Route path="kritik_dpm">
            <Route index element={<AdminKritikDpm/>}/>
            <Route path="create" element={<CreateKritikDpm/>}/>
            <Route path="edit/:id" element={<EditKritikDpm/>}/>
          </Route>
          <Route path="pengaduan">
            <Route index element={<AdminPengaduan/>}/>
            <Route path="create" element={<PengaduanCreate/>}/>
            <Route path="edit/:id" element={<PengaduanEdit/>}/>
          </Route>
          <Route path="produkHukum">
            <Route index element={<AdminProdukHukum/>}/>
            <Route path="create" element={<ProdukHukumCreate/>}/>
            <Route path="edit/:id" element={<ProdukHukumEdit/>}/>
          </Route>
          <Route path="keputusan">
            <Route index element={<AdminKeputusan/>}/>
            <Route path="create" element={<KeputusanCreate/>}/>
            <Route path="edit/:id" element={<KeputusanEdit/>}/>
          </Route>
          <Route path="strukturdpm">
            <Route index element={<AdminStrukturDpm/>}/>
            <Route path="create" element={<StrukturCreate/>}/>
            <Route path="edit/:id" element={<StrukturEdit/>}/>
          </Route>
          <Route path="tentangdpm">
            <Route index element={<AdminTentangDpm/>}/>
            <Route path="create" element={<CreateTentangDpm/>}/>
            <Route path="edit/:id" element={<EditTentangDpm/>}/>
          </Route>
        </Route>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App