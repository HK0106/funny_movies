import axios from 'axios';
import { TIME_OUT } from './constant';
import ENVIRONMENT_CONFIG from '../configs/env';

export const http = axios.create({
  baseURL: ENVIRONMENT_CONFIG.host,
  timeout: TIME_OUT,
});
