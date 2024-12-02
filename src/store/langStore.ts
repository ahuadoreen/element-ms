import { defineStore } from "pinia";

const useLangStore = defineStore("lang", {
  state: () => ({
    lang: "zh-cn",
    missingKeys: [] as string[],
  }),
  actions: {
    setLang(data: any) {
      this.lang = data;
    },
    addMissingKey(missingKey: string) {
      this.missingKeys.push(missingKey);
    },
    clearMissingKeys() {
      this.missingKeys = [];
    },
  },
  getters: {},
  persist: {
    key: "lang", //存储名称
    storage: localStorage, // 存储方式
    paths: ["lang"], //指定 state 中哪些数据需要被持久化。[] 表示不持久化任何状态，undefined 或 null 表示持久化整个 state
  },
});

export default useLangStore;
