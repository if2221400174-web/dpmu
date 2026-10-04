import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJwt } from 'react-jwt';

export default function useSessionManager() {
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');
  const { isExpired } = useJwt(token);

  // 1. LOGOUT OTOMATIS JIKA TOKEN BENAR-BENAR KADALUARSA (MENURUT WAKTU SERVER)
  useEffect(() => {
    if (token && isExpired) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userInfo');
      alert('Sesi Anda telah berakhir (Token Expired). Silakan login kembali.');
      navigate('/login');
    }
  }, [isExpired, token, navigate]);

  // 2. LOGOUT OTOMATIS JIKA TIDAK ADA AKTIVITAS SELAMA 1 JAM
  useEffect(() => {
    if (!token) return;

    let timeoutId;
    const ONE_HOUR = 3600000; // 1 jam dalam hitungan milidetik

    const logoutUser = () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userInfo');
      alert('Anda tidak melakukan aktivitas selama 1 jam. Sistem otomatis mengeluarkan Anda demi keamanan.');
      navigate('/login');
    };

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(logoutUser, ONE_HOUR);
    };

    // Pasang "Sensor" ke browser untuk mendeteksi pergerakan user
    window.addEventListener('mousemove', resetTimer); // Gerak mouse
    window.addEventListener('keydown', resetTimer);   // Ketik keyboard
    window.addEventListener('click', resetTimer);     // Klik
    window.addEventListener('scroll', resetTimer);    // Scroll layar

    // Mulai hitung mundur saat komponen pertama dimuat
    resetTimer();

    // Bersihkan sensor saat user keluar dari halaman
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('scroll', resetTimer);
    };
  }, [token, navigate]);
}