import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Api = axios.create({
  baseURL: 'http://localhost:1337/api',
});

Api.interceptors.request.use(
  async config => {
    const userInfoRaw = await AsyncStorage.getItem('userInfo');
    const userInfo = userInfoRaw ? JSON.parse(userInfoRaw) : '';

    if (userInfo && config && config.headers) {
      config.headers.Authorization = userInfo.jwt;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export interface LoginRequest {
  identifier: string;
  password: string;
}

export const login = async (loginParams: LoginRequest) => {
  const response = await Api.post('auth/local', loginParams);
  return response.data;
};
