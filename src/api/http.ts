// 配置axios
import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import useUserStore from "~/store/userStore";
import { ElMessage } from "element-plus";
import router from "../router";
import { ref } from "vue";
import { ResponseData } from "~/models/response";
import { t } from "~/i18n";

// 创建axios实例
const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL, //设置API的基础URL
  timeout: 300000,
});

// 请求拦截器
instance.interceptors.request.use(
  (config: AxiosRequestConfig): any => {
    if (config.url?.includes("login")) return config;
    //  获取请求头
    const headers = config.headers || {};
    const userStore = useUserStore();
    // 向请求头添加token
    if (userStore.token && !userStore.isTokenExpired && userStore.user) {
      headers["token"] = userStore.token.token;
      headers["username"] = userStore.user.username;
      config.headers = headers;
      loading.value = true;
    } else {
      userStore.setToken(null);
      userStore.setUser(null);
      router.push({
        path: "/login",
        query: { redirect: router.currentRoute.value.path },
      });
    }
    return config;
  },
  (error: AxiosError) => {
    // 处理请求错误
    return Promise.reject(error);
  }
);
// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 对响应数据进行处理
    const res = response.data;
    if (response.config.responseType == "blob" && res.code != 100) {
      loading.value = false;
      return res;
    }
    const userStore = useUserStore();
    console.log("test: " + res.code);
    if (res.code == 100) {
      const expired = +new Date() + 1000 * 60 * 120;
      userStore.setToken({ token: res.data, expire: expired });
      response.config.baseURL = "/api";
      return instance(response.config);
    } else if (res.code != 200) {
      //-----------------------------------------异常情况
      ElMessage({
        message: res.message,
        type: "error",
        duration: 5 * 1000,
      });
      loading.value = false;
      return Promise.reject(response.data);
    }
    loading.value = false;
    return res;
  },
  (error: AxiosError) => {
    // 处理响应错误
    console.log(error); // for debug
    let message = t("serverException");
    if (error.response) {
      const res = error.response;
      if (res.status == 401) {
        const userStore = useUserStore();
        if (
          userStore.token &&
          userStore.token!["token"] != error.config?.headers.token
        ) {
          error.response.config.baseURL = "/api";
          return instance(error.response.config);
        } else {
          userStore.setToken(null);
          userStore.setUser(null);
          router.push({
            path: "/login",
            query: { redirect: router.currentRoute.value.path },
          });
          loading.value = false;
          return Promise.reject(error);
        }
      }
      message = (res.data as ResponseData<null>).message;
    }
    ElMessage({
      message: message,
      type: "error",
      duration: 5 * 1000,
    });
    loading.value = false;
    return Promise.reject(error);
  }
);

// 导出axios请求方法
// GET
export function get<T>(url: string, params?: any) {
  return instance.get<T, ResponseData<T>>(url, { params });
}
// POST
export function post<T>(url: string, data?: any) {
  return instance.post<T, ResponseData<T>>(url, data, {
    headers: { "Content-Type": "application/json" },
  });
}
// PUT
export function put<T>(url: string, data?: any) {
  return instance.put<T, ResponseData<T>>(url, data);
}
//Delete
export function del<T>(url: string) {
  return instance.delete<T, ResponseData<T>>(url);
}
export function download<T>(
  url: string,
  fileName: string,
  data?: any,
  callback?: () => void
) {
  return instance
    .post<T, ResponseData<T>>(url, data, { responseType: "blob" })
    .then((response: any) => {
      const blob = new Blob([response]);
      const now = new Date();
      const fileFullName = `${fileName}${now.getTime()}.xlsx`;
      if ("download" in document.createElement("a")) {
        // 非IE下载
        const elink = document.createElement("a");
        elink.download = fileFullName;
        elink.style.display = "none";
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
      }
      if (callback != null) {
        callback();
      }
    });
}

export function upload<T>(url: string, file: File, data?: any) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "tableInfo",
    new Blob([JSON.stringify(data)], { type: "application/json" })
  );
  return instance.post<T, ResponseData<T>>(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export let loading = ref(false);
