import API from "../_api"

export const getKritikDpm = async() =>{
  const {data} = await API.get("/kritikdpms")
  return data.data
}

export const kritikDpmCreate = async (data) => {
  try {
    const response = await API.post("/kritikdpms",data)
    return response.data
  } catch (error) {
    console.log(error);
    throw error
  }
}
export const showKritikDpm = async (id) => {
  try {
    const data = await API.get(`/kritikdpms/${id}`)
    return data.data 
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const updateKritikDpm = async (id, data) => {
  try {
    const response = await API.post(`/kritikdpms/${id}`, data)
    return response.data
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const deleteKritikDpm = async (id)=>{
  try {
    await API.delete(`/kritikdpms/${id}`)
  } catch (error) {
    console.log(error);
    throw error
  }
}
