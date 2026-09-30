import API from "../_api"

export const getStrukturDpm = async() =>{
  const {data} = await API.get("/strukturdpms")
  return data.data
}

export const createStrukturDpm = async (data) => {
  try {
    const response = await API.post("/strukturdpms",data)
    return response.data
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const showStrukturDpm = async (id) => {
  try {
    const response = await API.get(`/strukturdpms/${id}`)
    return response.data 
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const updateStrukturDpm = async (id, data) => {
  try {
    const response = await API.post(`/strukturdpms/${id}`, data)
    return response.data
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const deleteStrukturDpm = async (id)=>{
  try {
    await API.delete(`/strukturdpms/${id}`)
  } catch (error) {
    console.log(error);
    throw error
  }
} 
