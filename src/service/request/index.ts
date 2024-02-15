import { BACKEND_ERROR_CODE, createFlatRequest, createRequest } from '@sa/axios';
import { localStg } from '@/utils/storage';
import { createProxyPattern, createServiceConfig } from '~/env.config';

const {baseURL, otherBaseURL} = createServiceConfig(import.meta.env);

const isHttpProxy = import.meta.env.VITE_HTTP_PROXY === 'Y';

export const request = createFlatRequest<App.Service.Response>(
  {
    baseURL: isHttpProxy ? createProxyPattern() : baseURL,
    headers: {
      apifoxToken: 'XL299LiMEDZ0H5h3A29PxwQXdMJqWyY2'
    }
  },
  {
    async onRequest(config) {
      // const {headers} = config;

      // set token
      // const token = localStg.get('token');
      // const Authorization = token ? `Bearer ${token}` : null;
      // Object.assign(headers, {Authorization});

      return config;
    },
    isBackendSuccess(response) {
      // when the backend response code is "0000", it means the request is success
      // you can change this logic by yourself
      return response.status >= 200 && response.status <= 302
    },
    async onBackendFail(_response) {
      // when the backend response code is not "0000", it means the request is fail
      // for example: the token is expired, refetch token and retry request
    },
    transformBackendResponse(response) {
      return response.data;
    },
    onError: function (error) {
      // when the request is fail, you can show error message
      let message = error.response?.data?.error_msg
      window.$message?.error(message);
    }
  }
);

export const demoRequest = createRequest<App.Service.DemoResponse>(
  {
    baseURL: isHttpProxy ? createProxyPattern('demo') : otherBaseURL.demo
  },
  {
    async onRequest(config) {
      const {headers} = config;

      // set token
      const token = localStg.get('token');
      const Authorization = token ? `Bearer ${token}` : null;
      Object.assign(headers, {Authorization});

      return config;
    },
    isBackendSuccess(response) {
      // when the backend response code is "200", it means the request is success
      // you can change this logic by yourself
      return response.data.status === '200';
    },
    async onBackendFail(_response) {
      // when the backend response code is not "200", it means the request is fail
      // for example: the token is expired, refetch token and retry request
    },
    transformBackendResponse(response) {
      return response.data.result;
    },
    onError(error) {
      // when the request is fail, you can show error message

      let message = error.message;

      // show backend error message
      if (error.code === BACKEND_ERROR_CODE) {
        message = error.response?.data?.message || message;
      }

      window.$message?.error(message);
    }
  }
);
