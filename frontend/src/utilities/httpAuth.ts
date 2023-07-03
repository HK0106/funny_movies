import axios from 'axios';
import { BearerToken } from '../configs/api';
import { API_STATUS_TEXT, TIME_OUT } from './constant';
import ENVIRONMENT_CONFIG from '../configs/env';
import { HTTP_STATUS_CODE } from '../ts/enums';
import {notification} from 'antd';

export const httpAuth = axios.create({
  baseURL: ENVIRONMENT_CONFIG.host,
  timeout: TIME_OUT,
  headers: {
    "Content-Type": "application/json",
  },
});

httpAuth.interceptors.request.use(
  async (config: any) => {
    config.headers.Authorization = BearerToken();
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  },
);

httpAuth.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    const { config, response } = error;
    if (
      config &&
      response &&
      response.status === HTTP_STATUS_CODE.UNAUTHORIZED &&
      response.statusText === API_STATUS_TEXT.unauthorized
    ) {
      localStorage.removeItem("token");
      window.location.href = "/";
      return Promise.reject(error);
    }
    notification["error"]({
      message: error.response?.data?.message || "Something wrong please try again later!"
    });
    return Promise.reject(error);
  },
);
