import axios from "axios";
import { get } from "./api/http";
import useMenuStore from "./store/menuStore";
import useUserStore from "./store/userStore";
import i18n, { setLocaleMessage } from "./i18n";
import useLangStore from "./store/langStore";

export const getInitInfo = (callback?: () => void) => {
  const lang = useLangStore().lang;
  i18n.global.locale.value = lang ? (lang as "en" | "zh") : "zh";
  let request = [getLang()];
  const userStore = useUserStore();
  if (!userStore.isTokenExpired && userStore.user) {
    request = [...request, getUser(), getMenu()];
  }
  axios.all(request).then(
    axios.spread((lang, userRes, menuRes) => {
      if (lang) {
        setLocaleMessage(lang.data);
      }
      if (userRes) {
        useUserStore().setUser(userRes.data);
      }
      if (menuRes) {
        useMenuStore().setMenu(menuRes.data);
      }
      if (callback) callback();
    })
  );
};
const getUser = () => {
  return get("security-module/user/getCurrentUserInfo");
};
const getMenu = () => {
  return get("security-module/menu/getCurrentUserMenus");
};
const getLang = () => {
  return get("basic-module/language/getLangList");
};
