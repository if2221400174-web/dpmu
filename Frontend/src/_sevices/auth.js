import { useJwt } from "react-jwt";
import API from "../_api"


export const login = async ({email, password}) => {
  try {
    const{data} = await API.post("/login", {email, password})
    return data
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const logout = async (token) => {
  try {
    const { data } = await API.post("/logout", {token}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    localStorage.removeItem("accessToken");
    localStorage.removeItem("userInfo");
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


// untuk mengecek token
export const useDecodeToken = (token) => {
  const { decodedToken, isExpired } = useJwt(token);

  try {
    if (isExpired) {
    return {
      success: false,
      message: "Token expired",
      data: null,
    };
  }

  return {
    success: true,
    message: "Token valid",
    data: decodedToken,
  };
  } catch (error) {
    return{
      success: false,
      message: error.message,
      data:null
    }
  }  
}

export const getUser = async() =>{
  const {data} = await API.get("/users")
  return data.data
}

export const userCreate = async (data) => {
  try {
    const response = await API.post("/users",data)
    return response.data
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const updateUser = async (id, data) => {
  try {
    const response = await API.post(`/users/${id}`, data) 
    return response.data
  } catch (error) {
    console.log(error);
    throw error
  }
}


export const deleteUsers = async (id)=>{
  try {
    await API.delete(`/users/${id}`)
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const showUser = async (id, data) => {
  try {
    const response = await API.get(`/users/${id}`, data)
    return response.data 
  } catch (error) {
    console.log(error);
    throw error
  }
}
