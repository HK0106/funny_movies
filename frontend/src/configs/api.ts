import { http } from '../utilities/http';
import { httpAuth } from '../utilities/httpAuth';
import { ENDPOINT_API } from '../ts/enums';
import STORAGES_CONFIG from '../configs/storage';


export const BearerToken = () => {
  return `Bearer ${localStorage.getItem(STORAGES_CONFIG.token)}`;
};

const API = {
  login: (data: any) => http.post(ENDPOINT_API.login, data),

  register: (data: any) => http.post(ENDPOINT_API.createUser, data),
  shareVideo: (data: any) => httpAuth.post(ENDPOINT_API.shareVideo, data),
  getListVideo: (page: number, size: number) =>
    http.get(ENDPOINT_API.listVideo, {
      params: {
        page,
        size,
      },
    }),
};

export default API;
