import { defineStore } from "pinia";

const useUserStore = defineStore("user", {
  state: () => ({
    // 用户信息
    user: null as User | null,
    token: null as { token: string; expire: number } | null,
  }),
  actions: {
    // 修改用户详情
    setUser(data: any) {
      this.user = data;
    },
    setToken(data: any) {
      this.token = data;
    },
  },
  getters: {
    isTokenExpired() {
      if (this.token && this.token.token && this.token.expire) {
        if (this.token.expire > new Date().getTime()) {
          return false;
        }
      }
      return true;
    },
  },
  // persist: true, 默认将整个UserInfo持久化存储
  persist: {
    key: "user", //存储名称
    storage: localStorage, // 存储方式
    paths: ["user", "token"], //指定 state 中哪些数据需要被持久化。[] 表示不持久化任何状态，undefined 或 null 表示持久化整个 state
  },
});

export default useUserStore;

export interface User {
  username: string;
  displayName: string;
  roles: { roleName: string }[];
  authList: string[];
}
