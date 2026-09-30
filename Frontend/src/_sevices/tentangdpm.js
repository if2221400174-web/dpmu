import API from "../_api"

export const getTentangDpm = async() =>{
  const {data} = await API.get("/tentangdpms")
  return data.data
}

export const tentangDpmCreate = async (data) => {
  try {
    const response = await API.post("/tentangdpms",data)
    return response.data
  } catch (error) {
    console.log(error);
    throw error
  }
}
export const showTentangDpm = async (id) => {
  try {
    const data = await API.get(`/tentangdpms/${id}`)
    return data.data 
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const updateTentangDpm = async (id, data) => {
  try {
    const response = await API.post(`/tentangdpms/${id}`, data)
    return response.data
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const deleteTentangDpm = async (id)=>{
  try {
    await API.delete(`/tentangdpms/${id}`)
  } catch (error) {
    console.log(error);
    throw error
  }
}
