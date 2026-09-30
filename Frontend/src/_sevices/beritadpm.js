import API from "../_api"

export const getBeritaDpm = async() =>{
  const {data} = await API.get("/beritadpms")
  return data.data
}

export const createBeritaDpm = async (data) => {
  try {
    const response = await API.post("/beritadpms",data)
    return response.data
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const showBeritaDpm = async (id) => {
  try {
    const response = await API.get(`/beritadpms/${id}`)
    return response.data 
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const updateBeritaDpm = async (id, data) => {
  try {
    const response = await API.post(`/beritadpms/${id}`, data)
    return response.data
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const deleteBeritaDpm = async (id)=>{
  try {
    await API.delete(`/beritadpms/${id}`)
  } catch (error) {
    console.log(error);
    throw error
  }
}
