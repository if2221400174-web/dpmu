import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBeritaDpm } from "../../../_sevices/beritadpm";

export default function BeritaDpmCreate() {
  const [formData, setFormdata] = useState({
    judul: "",
    isi_berita: "",
    foto_berita: null,
    deskripsi_foto: "",
  });
  const [previewImage, setPreviewImage] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
  const { name, value, files } = e.target;

  if (name === "foto_berita") {
    const file = files[0];
    if (file) {
      setFormdata({
        ...formData,
        foto_berita: file,
      });

      // preview image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  } else {
    setFormdata({
      ...formData,
      [name]: value,
    });
  }
};

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = new FormData();
      for (const key in formData) {
        payload.append(key, formData[key]);
      }
      await createBeritaDpm(payload);
      navigate("/admin/beritadpm");
    } catch (error) {
      if (error.response && error.response.data) {
        console.error("Validation errors:", error.response.data);
        alert(JSON.stringify(error.response.data.message));
      } else {
        console.error(error);
        alert("Unexpected error occurred");
      }
    }
  };

  console.log(formData);

  const handleReset = () => {
    setFormdata({
      judul: "",
      isi_berita: "",
      foto_berita: null,
      deskripsi_foto: "",
    });
    setPreviewImage(null);
  };

  const handleRemoveImage = () => {
    setFormdata({
      ...formData,
      foto_berita: null,
    });
    setPreviewImage(null);
  };

  // Text formatting helpers
  const formatText = (format) => {
    const textarea = document.getElementById("isi_berita");
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    let formattedText = "";

    switch (format) {
      case "bold":
        execFormatting("bold");
        break;
      case "italic":
        execFormatting("italic");
        break;
      case "underline":
        execFormatting("underline");
        break;
      case "strikethrough":
        execFormatting("strikeThrough");
        break;
      case "justifyLeft":
        execFormatting("justifyLeft");
        break;
      case "justifyCenter":
        execFormatting("justifyCenter");
        break;
      case "justifyRight":
        execFormatting("justifyRight");
        break;
      case "justifyFull":
        execFormatting("justifyFull");
        break;
      case "insertBulletList":
        execFormatting("insertUnorderedList");
        break;
      case "insertNumberedList":
        execFormatting("insertOrderedList");
        break;
      case "insertHorizontalRule":
        execFormatting("insertHorizontalRule");
        break;
      case "removeFormat":
        execFormatting("removeFormat");
        break;
      case "undo":
        performUndo();
        break;
      case "redo":
        performRedo();
        break;
      case "insertLink":
        const url = prompt("Masukkan URL:", "https://");
        if (url) {
          execFormatting("createLink", url);
        }
        break;
      case "formatBlock":
        const heading = prompt("Masukkan level heading (1-6):", "1");
        if (heading && parseInt(heading) >= 1 && parseInt(heading) <= 6) {
          execFormatting("formatBlock", `<h${heading}>`);
        }
        break;
      case "fontSize":
        const size = prompt("Masukkan ukuran font (1-7):", "3");
        if (size && parseInt(size) >= 1 && parseInt(size) <= 7) {
          execFormatting("fontSize", size);
        }
        break;
      case "fontName":
        const font = prompt("Masukkan nama font:", "Arial");
        if (font) {
          execFormatting("fontName", font);
        }
        break;
      case "foreColor":
        const color = prompt("Masukkan warna teks (hex atau nama):", "#000000");
        if (color) {
          execFormatting("foreColor", color);
        }
        break;
      case "superscript":
        execFormatting("superscript");
        break;
      case "subscript":
        execFormatting("subscript");
        break;
      default:
        console.log("Format tidak dikenali:", format);
    }

    const newText =
      formData.isi_berita.substring(0, start) +
      formattedText +
      formData.isi_berita.substring(end);

    setFormdata({
      ...formData,
      isi_berita: newText,
    });
  };
  // Fungsi untuk mendapatkan state formatting saat ini
  const execFormatting = (command, value = null) => {
    document.execCommand(command, false, value);
  };
  const performUndo = () => {
    document.execCommand("undo", false, null);
  };
  const performRedo = () => {
    document.execCommand("redo", false, null);
  };
 

  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-5xl px-4 py-6 mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                Tambah Berita
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Buat dan publikasikan berita DPM
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/beritadpm")}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kembali
            </button>
          </div>

          <form onSubmit={handleSubmit} onReset={handleReset}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Form Content */}
              <div className="p-6 space-y-6">
                {/* Title */}
                <div>
                  <label
                    htmlFor="judul"
                    className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white"
                  >
                    Judul
                  </label>
                  <input
                    type="text"
                    name="judul"
                    value={formData.judul}
                    onChange={handleChange}
                    id="judul"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white transition-all duration-200"
                    placeholder="Masukkan judul berita..."
                    required
                  />
                </div>

                

                {/* Description Label */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                    Isi Berita
                  </label>

                  {/* Toolbar */}
                  <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-t-lg">
                    {/* Undo/Redo */}
                    <div className="flex items-center gap-1 pr-2 border-r border-gray-300 dark:border-gray-600">
                      <button
                        type="button"
                        onClick={() => formatText("undo")}
                        className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors duration-150"
                        title="Undo (Ctrl+Z)"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => formatText("redo")}
                        className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors duration-150"
                        title="Redo (Ctrl+Y)"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" transform="rotate(180 10 10)" />
                        </svg>
                      </button>
                    </div>

                    {/* Text Formatting */}
                    <div className="flex items-center gap-1 pr-2 border-r border-gray-300 dark:border-gray-600">
                      <button
                        type="button"
                        onClick={() => formatText("bold")}
                        className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors duration-150"
                        title="Bold (Ctrl+B)"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 3a1 1 0 000 2h1v10a1 1 0 001 1h4a4 4 0 001.914-7.516A3.5 3.5 0 0010 3H4zm6 9H7V5h3a2 2 0 110 4h-1v3h1a3 3 0 110 6H7v-6h3z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => formatText("italic")}
                        className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors duration-150"
                        title="Italic (Ctrl+I)"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L11 6.414V16a1 1 0 11-2 0V6.414L7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3z" transform="rotate(15 10 10)" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => formatText("underline")}
                        className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors duration-150"
                        title="Underline (Ctrl+U)"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 17h12v1H4v-1zm6-14a5 5 0 015 5v5a5 5 0 01-10 0V8a5 5 0 015-5z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => formatText("strikethrough")}
                        className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors duration-150"
                        title="Strikethrough"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm2-5a2 2 0 012-2h6a2 2 0 110 4H7a2 2 0 01-2-2zm0 10a2 2 0 012-2h6a2 2 0 110 4H7a2 2 0 01-2-2z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => formatText("removeFormat")}
                        className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors duration-150"
                        title="Remove Formatting"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>

                    {/* Headers & Alignment */}
                    <div className="flex items-center gap-1 pr-2 border-r border-gray-300 dark:border-gray-600">
                      <button
                        type="button"
                        onClick={() => formatText("justifyLeft")}
                        className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors duration-150"
                        title="Align Left"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h8a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h8a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => formatText("justifyCenter")}
                        className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors duration-150"
                        title="Align Center"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zm0 4a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zm1 3a1 1 0 100 2h10a1 1 0 100-2H5zm-1 5a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => formatText("justifyRight")}
                        className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors duration-150"
                        title="Align Right"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm4 4a1 1 0 011-1h8a1 1 0 110 2H8a1 1 0 01-1-1zm4 4a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1zm4 4a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1z" clipRule="evenodd" transform="rotate(180 10 10)" />
                        </svg>
                      </button>
                    </div>

                    {/* Lists */}
                    <div className="flex items-center gap-1 pr-2 border-r border-gray-300 dark:border-gray-600">
                      <button
                        type="button"
                        onClick={() => formatText("insertBulletList")}
                        className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors duration-150"
                        title="Bullet List"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 4a2 2 0 100 4 2 2 0 000-4zm4 1h8a1 1 0 110 2H8a1 1 0 010-2zm0 5h8a1 1 0 110 2H8a1 1 0 110-2zm0 5h8a1 1 0 110 2H8a1 1 0 110-2zM4 9a2 2 0 100 4 2 2 0 000-4zm0 5a2 2 0 100 4 2 2 0 000-4z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => formatText("insertNumberedList")}
                        className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors duration-150"
                        title="Numbered List"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3 4a1 1 0 011-1h1a1 1 0 010 2H4a1 1 0 01-1-1zm3 1h9a1 1 0 110 2H6a1 1 0 010-2zm0 5h9a1 1 0 110 2H6a1 1 0 110-2zm0 5h9a1 1 0 110 2H6a1 1 0 110-2zM2 9a1 1 0 011-1h2a1 1 0 110 2H3a1 1 0 01-1-1zm0 5a1 1 0 011-1h2a1 1 0 110 2H3a1 1 0 01-1-1z" />
                        </svg>
                      </button>
                    </div>

                    {/* Insert */}
                    <div className="flex items-center gap-1 pr-2 border-r border-gray-300 dark:border-gray-600">
                      <button
                        type="button"
                        onClick={() => formatText("insertLink")}
                        className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors duration-150"
                        title="Insert Link"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => formatText("insertHorizontalRule")}
                        className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors duration-150"
                        title="Horizontal Line"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 10a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1z" />
                        </svg>
                      </button>
                    </div>

                    {/* Superscript/Subscript */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => formatText("superscript")}
                        className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors duration-150"
                        title="Superscript"
                      >
                        X²
                      </button>
                      <button
                        type="button"
                        onClick={() => formatText("subscript")}
                        className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors duration-150"
                        title="Subscript"
                      >
                        X₂
                      </button>
                    </div>
                  </div>

                  {/* Text Area */}
                  <textarea
                    id="isi_berita"
                    name="isi_berita"
                    value={formData.isi_berita}
                    onChange={handleChange}
                    rows="12"
                    className="bg-white border-x border-b border-gray-300 dark:border-gray-600 text-gray-900 text-sm rounded-b-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-4 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white resize-none transition-all duration-200"
                    placeholder="Tulis isi berita di sini..."
                    required
                  />
                </div>

                {/* Content Label */}
                <div>
                  <label className="block mb-4 text-sm font-semibold text-gray-900 dark:text-white">
                    Foto Berita
                  </label>

                  {/* Image Upload Section */}
                  <div className="space-y-4">
                    {/* Preview Image */}
                    {previewImage && (
                      <div className="relative">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="w-full h-64 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-lg"
                          title="Remove Image"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    )}

                    {/* Upload Button */}
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="foto_berita"
                        className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 transition-all duration-200"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-10 h-10 mb-3 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            PNG, JPG or GIF (MAX. 800x400px)
                          </p>
                        </div>
                        <input
                          id="foto_berita"
                          type="file"
                          name="foto_berita"
                          accept="image/*"
                          onChange={handleChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    {/* Deskripsi foto */}
                    <div>
                      <label
                        htmlFor="deskripsi_foto"
                        className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white"
                      >
                        Deskripsi Foto
                      </label>
                      <input
                        type="text"
                        id="deskripsi_foto"
                        name="deskripsi_foto"
                        value={formData.deskripsi_foto}
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white transition-all duration-200"
                        placeholder="Masukkan subtitle atau deskripsi singkat..."
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-between gap-4 px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                <button
                  type="reset"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  Reset
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-900 rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-900 dark:hover:bg-blue-800 dark:focus:ring-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  Publikasikan Berita
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
