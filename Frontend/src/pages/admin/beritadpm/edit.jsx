import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showBeritaDpm, updateBeritaDpm } from "../../../_sevices/beritadpm";
import { beritaImageStorage } from "../../../_api";

export default function BeritaDpmEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormdata] = useState({
    judul: "",
    isi_berita: "",
    foto_berita: null,
    deskripsi_foto: "",
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const editorRef = useRef(null);
  const [isEditorReady, setIsEditorReady] = useState(false);

  // ── History ref ──────────────────────────────────────────────────────────
  const historyRef = useRef({ stack: [], index: -1, isApplying: false });
  const HISTORY_LIMIT = 200;

  useEffect(() => {
    const fetchData = async () => {
      const [beritaDpmData] = await Promise.all([showBeritaDpm(id)]);
      setFormdata({
        judul: beritaDpmData.data.judul,
        isi_berita: beritaDpmData.data.isi_berita,
        foto_berita: null,
        deskripsi_foto: beritaDpmData.data.deskripsi_foto,
        _method: "PUT",
      });
      if (beritaDpmData.data.foto_berita) {
        setExistingImage(`${beritaImageStorage}/${beritaDpmData.data.foto_berita}`);
      }
    };
    fetchData();
  }, [id]);

  // ── Inisialisasi editor saat data dimuat ─────────────────────────────────
  useEffect(() => {
    if (!editorRef.current) return;
    if (!isEditorReady && formData.isi_berita) {
      editorRef.current.innerHTML = formData.isi_berita;
      setIsEditorReady(true);
    }
  }, [formData.isi_berita, isEditorReady]);

  // ── Push snapshot awal setelah editor siap ───────────────────────────────
  useEffect(() => {
    if (isEditorReady && editorRef.current) {
      pushHistory();
    }
  }, [isEditorReady]);

  // ── Serialisasi & restore selection ─────────────────────────────────────
  const serializeSelection = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !editorRef.current) return null;
    const range = sel.getRangeAt(0);
    const pathFor = (node) => {
      const path = [];
      let cur = node;
      while (cur && cur !== editorRef.current) {
        const parent = cur.parentNode;
        if (!parent) break;
        path.unshift(Array.prototype.indexOf.call(parent.childNodes, cur));
        cur = parent;
      }
      return path;
    };
    return {
      startPath: pathFor(range.startContainer),
      startOffset: range.startOffset,
      endPath: pathFor(range.endContainer),
      endOffset: range.endOffset,
    };
  };

  const saveSelection = () => {
    const sel = window.getSelection();
    return sel && sel.rangeCount > 0 ? sel.getRangeAt(0) : null;
  };

  const restoreSelection = (arg) => {
    if (!arg) return;
    // Serialized path-based
    if (arg.startPath && editorRef.current) {
      try {
        const nodeFromPath = (path) => {
          let node = editorRef.current;
          for (const idx of path) {
            if (!node.childNodes[idx]) return null;
            node = node.childNodes[idx];
          }
          return node;
        };
        const range = document.createRange();
        const startNode = nodeFromPath(arg.startPath) || editorRef.current;
        const endNode = nodeFromPath(arg.endPath) || editorRef.current;
        range.setStart(startNode, Math.min(arg.startOffset, startNode.length || 0));
        range.setEnd(endNode, Math.min(arg.endOffset, endNode.length || 0));
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        return;
      } catch (_) {}
    }
    // Range-based fallback
    if (arg.cloneRange) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(arg);
    }
  };

  // ── History helpers ───────────────────────────────────────────────────────
  const pushHistory = () => {
    if (!editorRef.current || historyRef.current.isApplying) return;
    const html = editorRef.current.innerHTML;
    const last = historyRef.current.stack[historyRef.current.index];
    if (last && last.html === html) return; // hindari duplikat
    // Truncate redo entries
    historyRef.current.stack = historyRef.current.stack.slice(0, historyRef.current.index + 1);
    historyRef.current.stack.push({ html, selSnapshot: serializeSelection() });
    if (historyRef.current.stack.length > HISTORY_LIMIT) historyRef.current.stack.shift();
    historyRef.current.index = historyRef.current.stack.length - 1;
  };

  const applySnapshot = (snap) => {
    if (!snap || !editorRef.current) return;
    historyRef.current.isApplying = true;
    editorRef.current.innerHTML = snap.html;
    setTimeout(() => {
      restoreSelection(snap.selSnapshot);
      setFormdata((prev) => ({ ...prev, isi_berita: editorRef.current.innerHTML }));
      historyRef.current.isApplying = false;
    }, 0);
  };

  const performUndo = () => {
    if (historyRef.current.index <= 0) return;
    historyRef.current.index--;
    applySnapshot(historyRef.current.stack[historyRef.current.index]);
  };

  const performRedo = () => {
    if (historyRef.current.index >= historyRef.current.stack.length - 1) return;
    historyRef.current.index++;
    applySnapshot(historyRef.current.stack[historyRef.current.index]);
  };

  // ── Normalisasi konten ───────────────────────────────────────────────────
  const ensureNonEmptyCells = () => {
    if (!editorRef.current) return;
    editorRef.current.querySelectorAll("td,th").forEach((cell) => {
      const text = cell.innerHTML.replace(/\u00A0/g, "").replace(/<br\s*\/?>/gi, "").trim();
      if (text === "") cell.innerHTML = "<br>";
    });
  };

  const normalizeContent = () => {
    if (!editorRef.current) return null;
    const savedRange = saveSelection();
    Array.from(editorRef.current.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "DIV") {
        const p = document.createElement("p");
        while (node.firstChild) p.appendChild(node.firstChild);
        node.parentNode.replaceChild(p, node);
      }
    });
    editorRef.current.querySelectorAll("p").forEach((p) => {
      if (p.innerHTML.replace(/\u00A0/g, "").trim() === "") p.innerHTML = "<br>";
    });
    ensureNonEmptyCells();
    if (savedRange) restoreSelection(savedRange);
    return editorRef.current.innerHTML;
  };

  // ── Handler editor ───────────────────────────────────────────────────────
  const handleEditorChange = () => {
    if (!editorRef.current || historyRef.current.isApplying) return;
    const normalized = normalizeContent() || editorRef.current.innerHTML;
    setFormdata((prev) => ({ ...prev, isi_berita: normalized }));
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !e.shiftKey) {
      e.preventDefault();
      performUndo();
      return;
    }
    if (
      (e.ctrlKey || e.metaKey) &&
      (e.key.toLowerCase() === "y" || (e.shiftKey && e.key.toLowerCase() === "z"))
    ) {
      e.preventDefault();
      performRedo();
      return;
    }

    const anchor = window.getSelection()?.anchorNode;
    const inTable = anchor
      ? anchor.nodeType === 3
        ? anchor.parentElement?.closest("td,th")
        : anchor.closest?.("td,th")
      : null;

    if (e.key === "Enter") {
      e.preventDefault();
      if (inTable) {
        document.execCommand("insertHTML", false, "<br>");
      } else {
        document.execCommand("insertHTML", false, "<p><br></p>");
      }
      setTimeout(() => {
        handleEditorChange();
        pushHistory();
      }, 0);
    } else if (e.key === "Backspace") {
      setTimeout(() => {
        handleEditorChange();
        ensureNonEmptyCells();
        pushHistory();
      }, 0);
    } else {
      setTimeout(() => pushHistory(), 500);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
    setTimeout(() => handleEditorChange(), 0);
  };

  // ── Eksekusi format ───────────────────────────────────────────────────────
  const execFormatting = (command, value = null) => {
    const savedRange = saveSelection();
    editorRef.current.focus();
    document.execCommand(command, false, value ?? undefined);
    if (savedRange) restoreSelection(savedRange);
    setTimeout(() => {
      normalizeContent();
      handleEditorChange();
      pushHistory();
    }, 0);
  };

  const formatText = (format) => {
    switch (format) {
      case "bold":           return execFormatting("bold");
      case "italic":         return execFormatting("italic");
      case "underline":      return execFormatting("underline");
      case "strikethrough":  return execFormatting("strikeThrough");
      case "justifyLeft":    return execFormatting("justifyLeft");
      case "justifyCenter":  return execFormatting("justifyCenter");
      case "justifyRight":   return execFormatting("justifyRight");
      case "justifyFull":    return execFormatting("justifyFull");
      case "insertBulletList":   return execFormatting("insertUnorderedList");
      case "insertNumberedList": return execFormatting("insertOrderedList");
      case "insertHorizontalRule": return execFormatting("insertHorizontalRule");
      case "removeFormat":   return execFormatting("removeFormat");
      case "superscript":    return execFormatting("superscript");
      case "subscript":      return execFormatting("subscript");
      case "undo":           return performUndo();
      case "redo":           return performRedo();
      case "insertLink": {
        const url = prompt("Masukkan URL:", "https://");
        if (url) execFormatting("createLink", url);
        break;
      }
      case "formatBlock": {
        const heading = prompt("Masukkan level heading (1-6):", "1");
        if (heading && +heading >= 1 && +heading <= 6)
          execFormatting("formatBlock", `<h${heading}>`);
        break;
      }
      case "fontSize": {
        const size = prompt("Masukkan ukuran font (1-7):", "3");
        if (size && +size >= 1 && +size <= 7) execFormatting("fontSize", size);
        break;
      }
      case "fontName": {
        const font = prompt("Masukkan nama font:", "Arial");
        if (font) execFormatting("fontName", font);
        break;
      }
      case "foreColor": {
        const color = prompt("Masukkan warna teks (hex):", "#000000");
        if (color) execFormatting("foreColor", color);
        break;
      }
      default:
        console.log("Format tidak dikenali:", format);
    }
  };

  // ── Form handlers ─────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "foto_berita") {
      const file = files[0];
      if (file) {
        setFormdata((prev) => ({ ...prev, foto_berita: file }));
        const reader = new FileReader();
        reader.onloadend = () => setPreviewImage(reader.result);
        reader.readAsDataURL(file);
      }
    } else {
      setFormdata((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      for (const key in formData) {
        if (key === "foto_berita") {
          if (formData.foto_berita instanceof File) payload.append("foto_berita", formData.foto_berita);
        } else {
          payload.append(key, formData[key]);
        }
      }
      await updateBeritaDpm(id, payload);
      navigate("/admin/beritadpm");
    } catch (error) {
      console.log(error);
      alert("edit berita error");
    }
  };

  // FIX: reset juga existingImage dan isEditorReady
  const handleReset = () => {
    setFormdata({ judul: "", isi_berita: "", foto_berita: null, deskripsi_foto: "" });
    setPreviewImage(null);
    setExistingImage(null);        // ← fix: hapus juga gambar lama
    setIsEditorReady(false);       // ← fix: izinkan reinisialisasi editor
    historyRef.current = { stack: [], index: -1, isApplying: false }; // ← fix: reset history
    if (editorRef.current) editorRef.current.innerHTML = "";
  };

  // FIX: hapus preview DAN existing image sekaligus
  const handleRemoveImage = () => {
    setFormdata((prev) => ({ ...prev, foto_berita: null }));
    setPreviewImage(null);
    setExistingImage(null);  // ← fix: gambar lama ikut hilang dari tampilan
  };

  // ── JSX — tidak ada perubahan tampilan ───────────────────────────────────
  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-5xl px-4 py-6 mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Edit Berita</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Perbarui informasi berita DPM</p>
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
              <div className="p-6 space-y-6">
                {/* Judul */}
                <div>
                  <label htmlFor="judul" className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                    Title
                  </label>
                  <input
                    type="text" name="judul" value={formData.judul} onChange={handleChange} id="judul"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white transition-all duration-200"
                    placeholder="Masukkan judul berita..." required
                  />
                </div>

                {/* Isi Berita */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">Isi Berita</label>
                  <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-t-lg">
                    {/* Undo/Redo */}
                    <div className="flex items-center gap-1 pr-2 border-r border-gray-300 dark:border-gray-600">
                      <button type="button" onClick={() => formatText("undo")} className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors duration-150" title="Undo (Ctrl+Z)">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" /></svg>
                      </button>
                      <button type="button" onClick={() => formatText("redo")} className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors duration-150" title="Redo (Ctrl+Y)">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" transform="rotate(180 10 10)" /></svg>
                      </button>
                    </div>
                    {/* Text Formatting */}
                    <div className="flex items-center gap-1 pr-2 border-r border-gray-300 dark:border-gray-600">
                      <button type="button" onClick={() => formatText("bold")} className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors duration-150" title="Bold (Ctrl+B)">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a1 1 0 000 2h1v10a1 1 0 001 1h4a4 4 0 001.914-7.516A3.5 3.5 0 0010 3H4zm6 9H7V5h3a2 2 0 110 4h-1v3h1a3 3 0 110 6H7v-6h3z" /></svg>
                      </button>
                      <button type="button" onClick={() => formatText("italic")} className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors duration-150" title="Italic (Ctrl+I)">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L11 6.414V16a1 1 0 11-2 0V6.414L7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3z" transform="rotate(15 10 10)" /></svg>
                      </button>
                      <button type="button" onClick={() => formatText("underline")} className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors duration-150" title="Underline (Ctrl+U)">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4 17h12v1H4v-1zm6-14a5 5 0 015 5v5a5 5 0 01-10 0V8a5 5 0 015-5z" /></svg>
                      </button>
                      <button type="button" onClick={() => formatText("strikethrough")} className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors duration-150" title="Strikethrough">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm2-5a2 2 0 012-2h6a2 2 0 110 4H7a2 2 0 01-2-2zm0 10a2 2 0 012-2h6a2 2 0 110 4H7a2 2 0 01-2-2z" clipRule="evenodd" /></svg>
                      </button>
                      <button type="button" onClick={() => formatText("removeFormat")} className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors duration-150" title="Remove Formatting">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                      </button>
                    </div>
                    {/* Alignment */}
                    <div className="flex items-center gap-1 pr-2 border-r border-gray-300 dark:border-gray-600">
                      <button type="button" onClick={() => formatText("justifyLeft")} className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors duration-150" title="Align Left">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h8a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h8a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                      </button>
                      <button type="button" onClick={() => formatText("justifyCenter")} className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors duration-150" title="Align Center">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zm0 4a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zm1 3a1 1 0 100 2h10a1 1 0 100-2H5zm-1 5a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                      </button>
                      <button type="button" onClick={() => formatText("justifyRight")} className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors duration-150" title="Align Right">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm4 4a1 1 0 011-1h8a1 1 0 110 2H8a1 1 0 01-1-1zm4 4a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1zm4 4a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1z" clipRule="evenodd" transform="rotate(180 10 10)" /></svg>
                      </button>
                    </div>
                    {/* Lists */}
                    <div className="flex items-center gap-1 pr-2 border-r border-gray-300 dark:border-gray-600">
                      <button type="button" onClick={() => formatText("insertBulletList")} className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors duration-150" title="Bullet List">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 100 4 2 2 0 000-4zm4 1h8a1 1 0 110 2H8a1 1 0 010-2zm0 5h8a1 1 0 110 2H8a1 1 0 110-2zm0 5h8a1 1 0 110 2H8a1 1 0 110-2zM4 9a2 2 0 100 4 2 2 0 000-4zm0 5a2 2 0 100 4 2 2 0 000-4z" /></svg>
                      </button>
                      <button type="button" onClick={() => formatText("insertNumberedList")} className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors duration-150" title="Numbered List">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h1a1 1 0 010 2H4a1 1 0 01-1-1zm3 1h9a1 1 0 110 2H6a1 1 0 010-2zm0 5h9a1 1 0 110 2H6a1 1 0 110-2zm0 5h9a1 1 0 110 2H6a1 1 0 110-2zM2 9a1 1 0 011-1h2a1 1 0 110 2H3a1 1 0 01-1-1zm0 5a1 1 0 011-1h2a1 1 0 110 2H3a1 1 0 01-1-1z" /></svg>
                      </button>
                    </div>
                    {/* Insert */}
                    <div className="flex items-center gap-1 pr-2 border-r border-gray-300 dark:border-gray-600">
                      <button type="button" onClick={() => formatText("insertLink")} className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors duration-150" title="Insert Link">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" /></svg>
                      </button>
                      <button type="button" onClick={() => formatText("insertHorizontalRule")} className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors duration-150" title="Horizontal Line">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1z" /></svg>
                      </button>
                    </div>
                    {/* Superscript/Subscript */}
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => formatText("superscript")} className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors duration-150" title="Superscript">X²</button>
                      <button type="button" onClick={() => formatText("subscript")} className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors duration-150" title="Subscript">X₂</button>
                    </div>
                  </div>

                  <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={handleEditorChange}
                    onPaste={handlePaste}
                    onKeyDown={handleKeyDown}
                    onBlur={() => { handleEditorChange(); pushHistory(); }}
                    className="bg-white border-x border-b border-gray-300 dark:border-gray-600 text-gray-900 text-sm rounded-b-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full min-h-[200px] p-4 dark:bg-gray-700 dark:text-white resize-none transition-all duration-200 overflow-y-auto"
                    style={{ minHeight: "200px", maxHeight: "400px" }}
                  />
                </div>

                {/* Foto Berita */}
                <div>
                  <label className="block mb-4 text-sm font-semibold text-gray-900 dark:text-white">Foto Berita</label>
                  <div className="space-y-4">
                    {(previewImage || existingImage) && (
                      <div className="relative">
                        <img
                          src={previewImage || existingImage} alt="Preview"
                          className="w-full h-64 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600"
                        />
                        <button
                          type="button" onClick={handleRemoveImage}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-lg"
                          title="Remove Image"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        </button>
                      </div>
                    )}
                    <div className="flex items-center justify-center w-full">
                      <label htmlFor="foto_berita" className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 transition-all duration-200">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or GIF (MAX. 800x400px)</p>
                        </div>
                        <input id="foto_berita" type="file" name="foto_berita" accept="image/*" onChange={handleChange} className="hidden" />
                      </label>
                    </div>
                    <div>
                      <label htmlFor="deskripsi_foto" className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">Deskripsi Foto</label>
                      <input
                        type="text" id="deskripsi_foto" name="deskripsi_foto"
                        value={formData.deskripsi_foto} onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white transition-all duration-200"
                        placeholder="Masukkan subtitle atau deskripsi singkat..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-between gap-4 px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                <button type="reset" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700 transition-all duration-200">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" /></svg>
                  Reset
                </button>
                <button type="submit" className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-900 rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-900 dark:hover:bg-blue-800 dark:focus:ring-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  Update Berita
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}