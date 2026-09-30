import axios from "axios";
const url = "http://127.0.0.1:8000"



const API = axios.create({
  baseURL: `${url}/api`
})

API.interceptors.request.use(config => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization; // pastikan tidak kirim Bearer null
  }
  return config;
});


export const beritaImageStorage = `${url}/storage/fotoBerita`;
export const pengaduanImageStorage = `${url}/storage/buktiPengaduan`;
export const hukumfiletorage = `${url}/storage/fileHukum`;
export const keputusanfiletorage = `${url}/storage/fileKeputusan`;
export const strukturImageStorage = `${url}/storage/fotoStruktur`;



export default API;
