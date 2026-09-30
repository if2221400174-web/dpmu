import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showTentangDpm, updateTentangDpm } from "../../../_sevices/tentangdpm";

// Komponen SmartField — sama persis dengan di CreateTentangDpm
function SmartField({ label, name, sublabel, icon, iconBg, iconColor, value, onChange }) {
  const [useList, setUseList] = useState(false);
  const [items, setItems] = useState([""]);

  // Inisialisasi items dari value yang sudah ada (dari database)
  useEffect(() => {
    if (value && useList) {
      const lines = value
        .split("\n")
        .map((l) => l.replace(/^\d+\.\s*/, "").trim())
        .filter(Boolean);
      setItems(lines.length > 0 ? lines : [""]);
    }
  }, [value, useList]);

  const handleToggle = () => {
    if (!useList) {
      // textarea → list: parse nilai yang sudah ada
      const lines = value
        .split("\n")
        .map((l) => l.replace(/^\d+\.\s*/, "").trim())
        .filter(Boolean);
      setItems(lines.length > 0 ? lines : [""]);
    } else {
      // list → textarea: gabung jadi teks bernomor
      const text = items
        .filter((i) => i.trim())
        .map((i, idx) => `${idx + 1}. ${i}`)
        .join("\n");
      onChange({ target: { name, value: text } });
    }
    setUseList(!useList);
  };

  const handleItemChange = (idx, val) => {
    const next = [...items];
    next[idx] = val;
    setItems(next);
    const text = next
      .filter((i) => i.trim())
      .map((i, i2) => `${i2 + 1}. ${i}`)
      .join("\n");
    onChange({ target: { name, value: text } });
  };

  const addItem = () => setItems([...items, ""]);

  const removeItem = (idx) => {
    if (items.length === 1) return;
    const next = items.filter((_, i) => i !== idx);
    setItems(next);
    const text = next
      .filter((i) => i.trim())
      .map((i, i2) => `${i2 + 1}. ${i}`)
      .join("\n");
    onChange({ target: { name, value: text } });
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
      setTimeout(() => {
        const inputs = document.querySelectorAll(`[data-field="${name}"]`);
        if (inputs[idx + 1]) inputs[idx + 1].focus();
      }, 50);
    }
    if (e.key === "Backspace" && items[idx] === "" && items.length > 1) {
      e.preventDefault();
      removeItem(idx);
      setTimeout(() => {
        const inputs = document.querySelectorAll(`[data-field="${name}"]`);
        if (inputs[idx - 1]) inputs[idx - 1].focus();
      }, 50);
    }
  };

  return (
    <div>
      {/* Label row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 ${iconBg} rounded-lg`}>
            <div className={`w-5 h-5 ${iconColor}`}>{icon}</div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white">
              {label} <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400">{sublabel}</p>
          </div>
        </div>

        {/* Toggle button */}
        <button
          type="button"
          onClick={handleToggle}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200 ${
            useList
              ? "bg-blue-900 text-white border-blue-900"
              : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
          }`}
        >
          {useList ? (
            <>
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
              </svg>
              Mode List
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
              </svg>
              Mode Teks
            </>
          )}
        </button>
      </div>

      {/* Input */}
      {!useList ? (
        <>
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            rows="4"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-200 resize-none"
            placeholder={`Tulis ${label.toLowerCase()} di sini...`}
            required
          />
          <p className="mt-1.5 text-xs text-gray-400">{value.length} karakter · Aktifkan Mode List untuk poin bernomor</p>
        </>
      ) : (
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-900 text-white text-xs font-bold flex items-center justify-center">
                {idx + 1}
              </span>
              <input
                type="text"
                data-field={name}
                value={item}
                onChange={(e) => handleItemChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-200"
                placeholder={`Poin ${idx + 1}...`}
              />
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="flex-shrink-0 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="mt-2 inline-flex items-center gap-1.5 text-sm text-blue-900 hover:text-blue-700 font-medium transition-colors duration-150"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
            </svg>
            Tambah Poin
          </button>
          <p className="mt-1 text-xs text-gray-400">Enter untuk poin baru · Backspace pada poin kosong untuk hapus</p>
        </div>
      )}
    </div>
  );
}

export default function EditTentangDpm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormdata] = useState({ tujuan: "", fungsi: "", visi: "", misi: "" });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const raw = await showTentangDpm(id);
        const data = raw?.data ?? raw;
        setFormdata({
          tujuan: data.tujuan ?? "",
          fungsi: data.fungsi ?? "",
          visi: data.visi ?? "",
          misi: data.misi ?? "",
          _method: "PUT",
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Gagal memuat data");
        navigate("/admin/tentangdpm");
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      for (const key in formData) payload.append(key, formData[key]);
      await updateTentangDpm(id, payload);
      navigate("/admin/tentangdpm");
    } catch (error) {
      console.log(error);
      alert("Gagal menyimpan perubahan");
    }
  };

  const handleReset = () => setFormdata({ tujuan: "", fungsi: "", visi: "", misi: "" });

  const fields = [
    {
      name: "tujuan", label: "Tujuan", sublabel: "Tujuan utama pembentukan DPM",
      iconBg: "bg-purple-100 dark:bg-purple-900/30", iconColor: "text-purple-600 dark:text-purple-400",
      icon: <svg fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/></svg>,
    },
    {
      name: "fungsi", label: "Fungsi", sublabel: "Fungsi dan peran DPM",
      iconBg: "bg-blue-100 dark:bg-blue-900/30", iconColor: "text-blue-600 dark:text-blue-400",
      icon: <svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/></svg>,
    },
    {
      name: "visi", label: "Visi", sublabel: "Visi organisasi DPM",
      iconBg: "bg-green-100 dark:bg-green-900/30", iconColor: "text-green-600 dark:text-green-400",
      icon: <svg fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/></svg>,
    },
    {
      name: "misi", label: "Misi", sublabel: "Misi dan langkah strategis DPM",
      iconBg: "bg-amber-100 dark:bg-amber-900/30", iconColor: "text-amber-600 dark:text-amber-400",
      icon: <svg fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/></svg>,
    },
  ];

  if (isLoading) {
    return (
      <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"/>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Memuat data...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl px-4 py-6 mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Edit Informasi DPM</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Perbarui profil organisasi DPM</p>
          </div>
          <button
            onClick={() => navigate("/admin/tentangdpm")}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Kembali
          </button>
        </div>

        <form onSubmit={handleSubmit} onReset={handleReset}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 space-y-6">

              {/* Info Box */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex gap-3">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                </svg>
                <div>
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">Mode Edit</p>
                  <p className="text-sm text-blue-800 dark:text-blue-400">
                    Data lama sudah terisi otomatis. Klik <strong>Mode List</strong> di kanan label untuk beralih ke input poin bernomor.
                  </p>
                </div>
              </div>

              {/* Fields */}
              {fields.map((f, i) => (
                <div key={f.name}>
                  <SmartField
                    {...f}
                    value={formData[f.name]}
                    onChange={handleChange}
                  />
                  {i < fields.length - 1 && (
                    <div className="mt-5 border-t border-gray-100 dark:border-gray-700"/>
                  )}
                </div>
              ))}

              {/* Warning */}
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex gap-3">
                <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                <div>
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-300 mb-1">Perhatian</p>
                  <p className="text-sm text-amber-800 dark:text-amber-400">
                    Perubahan yang disimpan akan menggantikan data sebelumnya. Pastikan data sudah benar.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-4 px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
              <button type="reset"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
                </svg>
                Reset
              </button>
              <button type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-900 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 transition-all duration-200 shadow-md"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                Simpan Perubahan
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
