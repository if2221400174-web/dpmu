import API from "../_api"

export const getProdukHukum = async() =>{
  const { data } = await API.get("/produkhukums")
  return data?.data ?? data
}

export const createProdukHukum = async (data) => {
  try {
    const response = await API.post("/produkhukums",data)
    return response.data
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const showProdukHukum = async (id) => {
  try {
    const response = await API.get(`/produkhukums/${id}`)
    return response.data?.data ?? response.data
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const updateProdukHukum = async (id, data) => {
  try {
    const response = await API.post(`/produkhukums/${id}`, data)
    return response.data
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const deleteProdukHukum = async (id)=>{
  try {
    await API.delete(`/produkhukums/${id}`)
  } catch (error) {
    console.log(error);
    throw error
  }
}