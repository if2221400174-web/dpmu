import API from "../_api"

export const getKeputusan = async() =>{
  const {data} = await API.get("/keputusans")
  return data.data
}

export const createKeputusan = async (data) => {
  try {
    const response = await API.post("/keputusans",data)
    return response.data
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const showKeputusan = async (id) => {
  try {
    const response = await API.get(`/keputusans/${id}`)
    return response.data 
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const updateKeputusan = async (id, data) => {
  try {
    const response = await API.post(`/keputusans/${id}`, data)
    return response.data
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const deleteKeputusan = async (id)=>{
  try {
    await API.delete(`/keputusans/${id}`)
  } catch (error) {
    console.log(error);
    throw error
  }
}
