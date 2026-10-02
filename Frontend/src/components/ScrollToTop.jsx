import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Memaksa layar kembali ke titik 0,0 (paling atas) setiap kali URL berubah
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // Komponen ini tidak menampilkan visual apa-apa, hanya bekerja di balik layar
}