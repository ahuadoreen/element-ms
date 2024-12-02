import { defineStore } from "pinia";
import { Tree } from "~/models/models";
import common from "~/utils/common";

const useMenuStore = defineStore("menu", {
  state: () => ({
    menu: [] as Menu[], // 树形菜单
    flatMenu: [] as Menu[], // 列表菜单
  }),
  actions: {
    setMenu(data: any) {
      this.flatMenu = data;
      this.menu = [];
      common.formatArrayToTree(data, this.menu, (m) => (m.isShow ? m : null));
    },
  },
  getters: {},
  persist: {
    key: "menu", //存储名称
    storage: localStorage, // 存储方式
    paths: ["menu", "flatMenu"], //指定 state 中哪些数据需要被持久化。[] 表示不持久化任何状态，undefined 或 null 表示持久化整个 state
  },
});

export default useMenuStore;

export interface Menu extends Tree {
  menuName: string;
  label: string;
  url: string;
  requestPath: string;
  auth: string;
  isShow: boolean;
  children?: Menu[];
  hideInBreadcrumb?: boolean;
}
