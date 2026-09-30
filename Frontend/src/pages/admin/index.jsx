import { useEffect, useState } from "react";
import { getProdukHukum } from "../../_sevices/produkhukum";
import { getTentangDpm } from "../../_sevices/tentangdpm";
import { getUser } from "../../_sevices/auth";
import { getPengaduan } from "../../_sevices/pengaduans";
import { getKritikDpm } from "../../_sevices/kritikdpms";
import { getStrukturDpm } from "../../_sevices/strukturdpms";
import { getBeritaDpm } from "../../_sevices/beritadpm";
import { getKeputusan } from "../../_sevices/keputusan";

export default function Dashboard() {
  // State untuk menyimpan data statistik dari setiap modul
  const [stats, setStats] = useState({
    berita: 0,
    kritik: 0,
    pengaduan: 0,
    struktur: 0,
    produkHukum: 0,
    keputusan: 0,
    users: 0,
    tentangDpm: 0,
  });

  // State untuk loading
  const [isLoading, setIsLoading] = useState(true);

  // Simpan daftar pengaduan mentah untuk perhitungan chart
  const [pengaduanList, setPengaduanList] = useState([]);

  // Berapa bulan terakhir yang ditampilkan (3, 6, 9, 12)
  const [selectedMonths, setSelectedMonths] = useState(12);

  // State untuk data chart (dinamis, didapat dari pengaduanList)
  const [chartData, setChartData] = useState(() => {
    const monthNames = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
    const now = new Date();
    return Array.from({ length: 12 }).map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
      return { month: monthNames[d.getMonth()], value: 0 };
    });
  });

  // Fetch semua data saat component mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Ambil data dari semua service secara paralel
        const [
          beritaData,
          kritikData,
          pengaduanData,
          strukturData,
          produkHukumData,
          keputusanData,
          usersData,
          tentangDpmData,
        ] = await Promise.all([
          getBeritaDpm(),
          getKritikDpm(),
          getPengaduan(),
          getStrukturDpm(),
          getProdukHukum(),
          getKeputusan(),
          getUser(),
          getTentangDpm(),
        ]);

        // Simpan daftar pengaduan untuk perhitungan chart
        setPengaduanList(pengaduanData);

        // Set stats dengan jumlah data dari masing-masing modul
        setStats({
          berita: beritaData?.length || 0,
          kritik: kritikData?.length || 0,
          pengaduan: pengaduanData?.length || 0,
          struktur: strukturData?.length || 0,
          produkHukum: produkHukumData?.length || 0,
          keputusan: keputusanData?.length || 0,
          users: usersData?.length || 0,
          tentangDpm: tentangDpmData?.length || 0,
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Bangun data chart berdasarkan daftar pengaduan & pilihan jumlah bulan
  useEffect(() => {
    const computeChart = (data) => {
      const monthNames = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
      const now = new Date();

      // Reference untuk 12 bulan terakhir (urut dari lama ke baru)
      const reference = Array.from({ length: 12 }).map((_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        return { key, label: monthNames[d.getMonth()], value: 0 };
      });

      const map = Object.fromEntries(reference.map((r) => [r.key, r]));

      (data || []).forEach((item) => {
        const date = new Date(item.created_at || item.tanggal);
        if (isNaN(date)) return;
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        if (map[key]) map[key].value++;
      });

      const full = Object.values(map);
      const monthsToShow = selectedMonths;
      const slice = full.slice(12 - monthsToShow);
      const result = slice.map((r) => ({ month: r.label, value: r.value }));
      setChartData(result);
    };

    if (pengaduanList.length) {
      computeChart(pengaduanList);
    } else {
      const monthNames = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
      const now = new Date();
      const arr = Array.from({ length: selectedMonths }).map((_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (selectedMonths - 1 - i), 1);
        return { month: monthNames[d.getMonth()], value: 0 };
      });
      setChartData(arr);
    }
  }, [pengaduanList, selectedMonths]);

  // Hitung total semua data - FIX: Pastikan tidak ada NaN
  const totalData = 
    (stats.berita || 0) +
    (stats.kritik || 0) +
    (stats.pengaduan || 0) +
    (stats.struktur || 0) +
    (stats.produkHukum || 0) +
    (stats.keputusan || 0) +
    (stats.users || 0);

  // Hitung persentase growth (contoh: dibandingkan bulan lalu)
  const growthPercentage = 15.3;

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-100 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-900 dark:border-gray-700 dark:border-t-blue-500"></div>
          <p className="mt-6 text-lg font-bold text-gray-900 dark:text-white">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Dashboard */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-2">
            Dashboard DPM U
          </h1>
          <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
            Ringkasan Sistem Management • Update Real-time
          </p>
        </div>

        {/* Grid Layout - Stats Cards + Main Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* Left Column - 4 Stat Cards */}
          <div className="lg:col-span-1 space-y-4">
            {/* Card 1: Total Data - FIX: Kontras maksimal + No NaN */}
            <div className=" bg-white dark:bg-gray-800 rounded-xl p-6 text-black shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-blue-600 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                    <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                    <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
                  </svg>
                </div>
                <span className="px-4 py-2 bg-blue-600 text-white text-xs font-black rounded-xl shadow-lg">
                  +{growthPercentage}%
                </span>
              </div>
              <div>
                <p className="text-gray-900 dark:text-white text-sm font-bold mb-2 uppercase tracking-wide">Total Data Sistem</p>
                <h2 className="text-5xl font-black text-gray-900 dark:text-white mb-2">{totalData.toLocaleString()}</h2>
                <p className="text-gray-700 dark:text-gray-300 text-sm font-semibold">Seluruh data terintegrasi</p>
              </div>
            </div>

            {/* Card 2: Pengaduan - FIX: Kontras text sangat jelas */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-red-300 dark:border-red-700 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-red-500 rounded-xl shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="px-4 py-2 bg-red-500 text-white text-xs font-black rounded-xl shadow-md uppercase">Urgent</span>
              </div>
              <div>
                <p className="text-gray-900 dark:text-white text-sm font-bold mb-2 uppercase tracking-wide">Pengaduan Masuk</p>
                <h3 className="text-5xl font-black text-gray-900 dark:text-white mb-2">{(stats.pengaduan || 0).toLocaleString()}</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm font-semibold">Total laporan urgent</p>
              </div>
            </div>

            {/* Card 3: Berita Published - FIX: Kontras text sangat jelas */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-green-300 dark:border-green-700 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-500 rounded-xl shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
                    <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
                  </svg>
                </div>
                <span className="px-4 py-2 bg-green-500 text-white text-xs font-black rounded-xl shadow-md uppercase">Active</span>
              </div>
              <div>
                <p className="text-gray-900 dark:text-white text-sm font-bold mb-2 uppercase tracking-wide">Berita DPM</p>
                <h3 className="text-5xl font-black text-gray-900 dark:text-white mb-2">{(stats.berita || 0).toLocaleString()}</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm font-semibold">Artikel terpublikasi</p>
              </div>
            </div>

            {/* Card 4: Users - FIX: Kontras text sangat jelas */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-purple-300 dark:border-purple-700 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-500 rounded-xl shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
                <span className="px-4 py-2 bg-purple-500 text-white text-xs font-black rounded-xl shadow-md">{stats.users || 0}</span>
              </div>
              <div>
                <p className="text-gray-900 dark:text-white text-sm font-bold mb-2 uppercase tracking-wide">Total Users</p>
                <h3 className="text-5xl font-black text-gray-900 dark:text-white mb-2">{(stats.users || 0).toLocaleString()}</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm font-semibold">Pengguna terdaftar</p>
              </div>
            </div>
          </div>

          {/* Right Column - Main Chart - FIX: Nama bulan SELALU tampil */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl border-2 border-gray-300 dark:border-gray-700 h-full">
              {/* Chart Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-300 dark:border-gray-600">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-1">Statistik Pengaduan</h3>
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Grafik laporan {selectedMonths} bulan terakhir</p>
                </div>
                <select
                  value={selectedMonths}
                  onChange={(e) => setSelectedMonths(Number(e.target.value))}
                  className="px-5 py-3 bg-blue-700 text-white rounded-xl text-sm font-black transition-all"
                >
                  <option value={3}>3 Bulan</option>
                  <option value={6}>6 Bulan</option>
                  <option value={9}>9 Bulan</option>
                  <option value={12}>12 Bulan</option>
                </select>
              </div>

              {/* Bar Chart Container - FIX: Scrollable horizontal dengan spacing yang cukup */}
              <div className="relative h-96 overflow-x-auto overflow-y-hidden pb-8">
                {/* Wrapper dengan min-width dinamis berdasarkan jumlah bulan */}
                <div className="w-full h-full" style={{ minWidth: `${chartData.length * 80}px` }}>
                  <div className="relative h-full pb-12">
                    {/* Bar Container */}
                    <div className="absolute inset-0 flex items-end justify-around px-1">
                      {chartData.map((item, index) => {
                        const maxValue = Math.max(...chartData.map((d) => d.value), 1);
                        const heightPercentage = maxValue === 0 ? 0 : (item.value / maxValue) * 100;

                        return (
                          <div key={index} className="flex flex-col items-center" style={{ minWidth: '60px', width: '60px' }}>
                            {/* Bar dengan label value */}
                            <div className="w-full flex flex-col items-center group mb-2">
                              {/* Value di atas bar - selalu tampil */}
                              <div className="mb-2 transition-all duration-200">
                                <span className="text-blue-700 dark:text-blue-300 text-sm font-black whitespace-nowrap">
                                  {item.value}
                                </span>
                              </div>

                              {/* Bar Chart */}
                              <div
                                className="w-full bg-blue-700 dark:bg-blue-600 rounded-t-2xl transition-all duration-300 hover:bg-blue-800 dark:hover:bg-blue-500 cursor-pointer relative overflow-hidden border-2 border-blue-700 dark:border-blue-500 shadow-xl hover:shadow-2xl"
                                style={{ 
                                  height: `${heightPercentage}%`, 
                                  minHeight: heightPercentage > 0 ? '40px' : '0px',
                                  maxHeight: 'calc(100% - 60px)'
                                }}
                              >
                                {/* Shine effect on hover */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                              </div>
                            </div>

                            {/* Month Label - Fixed position di bawah bar, SELALU TAMPIL */}
                            <div className="mt-2 w-full flex justify-center">
                              <p className="text-sm font-black text-gray-900 dark:text-white uppercase whitespace-nowrap">
                                {item.month}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Y-axis Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none px-4 pb-12">
                      {[...Array(6)].map((_, i) => (
                        <div 
                          key={i} 
                          className="border-t-2 border-gray-300 dark:border-gray-600" 
                          style={{ opacity: i === 0 || i === 5 ? 0 : 0.3 }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Scroll Indicator - muncul jika konten lebih lebar dari 8 bulan */}
                {chartData.length > 8 && (
                  <div className="absolute bottom-0 right-4 text-xs text-gray-500 dark:text-gray-400 font-semibold flex items-center gap-1">
                  </div>
                )}
              </div>

              {/* Legend - Dihapus sesuai request */}
              <div className="flex items-center justify-center mt-6 pt-6 border-t-2 border-gray-300 dark:border-gray-600">
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - 5 Module Cards - FIX: Grid balanced untuk mobile (2-2-1) */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
          {/* Kritik & Saran */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg border-2 border-amber-300 dark:border-amber-700 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-amber-300  rounded-xl shadow-lg mb-3">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wide mb-2">Kritik & Saran</p>
              <p className="text-4xl font-black text-gray-900 dark:text-white">{stats.kritik || 0}</p>
            </div>
          </div>

          {/* Struktur DPM */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg border-2 border-blue-300 dark:border-blue-700 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-blue-300 rounded-xl shadow-lg mb-3">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wide mb-2">Struktur DPM</p>
              <p className="text-4xl font-black text-gray-900 dark:text-white">{stats.struktur || 0}</p>
            </div>
          </div>

          {/* Produk Hukum */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg border-2 border-indigo-300 dark:border-indigo-700 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-indigo-300 rounded-xl shadow-lg mb-3">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wide mb-2">Produk Hukum</p>
              <p className="text-4xl font-black text-gray-900 dark:text-white">{stats.produkHukum || 0}</p>
            </div>
          </div>

          {/* Keputusan DPM */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg border-2 border-rose-300 dark:border-rose-700 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-rose-300 rounded-xl shadow-lg mb-3">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wide mb-2">Keputusan</p>
              <p className="text-4xl font-black text-gray-900 dark:text-white">{stats.keputusan || 0}</p>
            </div>
          </div>

          {/* Tentang DPM - Full width on mobile for balance */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg border-2 border-teal-300 dark:border-teal-700 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 col-span-2 lg:col-span-1">
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-teal-300 rounded-xl shadow-lg mb-3">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wide mb-2">Tentang DPM</p>
              <p className="text-4xl font-black text-gray-900 dark:text-white">{stats.tentangDpm || 0}</p>
            </div>
          </div>
        </div>

        {/* Quote Section */}
        <div className="bg-white rounded-xl p-8 text-center shadow-2xl border-2 border-blue-600">
          <div className="flex items-center justify-center mb-4">
          </div>
          <h2 className="text-3xl font-black text-blue-600 mb-3">Jadilah Admin yang Bijaksana dalam Pengelolaan</h2>
          <p className="text-blue-600 text-lg font-semibold max-w-2xl mx-auto">Kelola sistem dengan penuh tanggung jawab dan transparansi.</p>
        </div>
      </div>
    </div>
  );
}
