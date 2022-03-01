import axios from 'axios';

const api = axios.create({
    baseURL: "http://3.126.118.40:4000",
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

export const sendOtp = (data) => {
    return api.post('/api/send-otp', data);
}

export const verifyOtp = (data) => {
    return api.post('/api/verify-otp', data);
}

export const activateUser = (data) => {
    return api.post('/api/activate', data);
}

export const logout = () => {
    return api.post('/api/logout');
}

export const createRoomApi = (data) => {
    return api.post('/api/rooms', data);
}

export const getRoomsApi = () => {
    return api.get('/api/rooms');
}

export const getRoomApi = (id) => {
    return api.get(`/api/rooms/${id}`);
}


// interceptors
api.interceptors.response.use((config) => {
    return config;
}, async (error) => {
    const originalRequest = error.config;
    if (
        error.response.status === 401 &&
        originalRequest &&
        !originalRequest._isRetry
    ) {
        originalRequest.isRetry = true;
        try {
            await api.get(
                `${process.env.REACT_APP_API_URL}/api/refresh`,
                {
                    withCredentials: true,
                }
            );
            return api.request(originalRequest);
        } catch (err) {
            // logging
        }
    }
    throw error;
});


export default api;





