import API from "../_api"

export const getPengaduan = async() =>{
  const {data} = await API.get("/pengaduans")
  return data.data
}

export const createPengaduan = async (data) => {
  try {
    const response = await API.post("/pengaduans",data)
    return response.data
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const showPengaduan = async (id) => {
  try {
    const response = await API.get(`/pengaduans/${id}`)
    return response.data 
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const updatePengaduan = async (id, data) => {
  try {
    const response = await API.post(`/pengaduans/${id}`, data)
    return response.data
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const deletePengaduan = async (id)=>{
  try {
    await API.delete(`/pengaduans/${id}`)
  } catch (error) {
    console.log(error);
    throw error
  }
}