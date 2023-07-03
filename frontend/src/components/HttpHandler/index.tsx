import {notification} from 'antd';
import {http} from '../../utilities/http';
import STORAGES_CONFIG from '../../configs/storage';
import {HTTP_STATUS_CODE} from '../../ts/enums';

const HttpHandler = () => {
  http.interceptors.response.use(
    (res: any) => {
      return res;
    },
    (error: any) => {
      if (error && error.config && error.response) {
        if (error.response.status === HTTP_STATUS_CODE.UNAUTHORIZED) {
          localStorage.removeItem(STORAGES_CONFIG.token);
          notification["error"]({
            message:
              error.response?.data?.message ||
              error.response?.data?.error?.message ||
              "",
          });
        } else {
          if (!error.response.isNotificationShown) {
            error.response.isNotificationShown = true;
            notification['error']({
              message:
                error.response?.data?.message ||
                error.response?.data?.error?.message ||
                '',
            });
          }
        }
      } else {
        notification["error"]({
          message:
            "Something is temporarily wrong with your network connection. Please make sure you are connected to the internet and then reload your browser",
        });
      }
      return Promise.reject(error);
    },
  );

  return <></>;
};

export default HttpHandler;
