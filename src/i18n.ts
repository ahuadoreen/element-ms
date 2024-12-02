import { Locale, Path, createI18n } from "vue-i18n";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import en from "element-plus/es/locale/lang/en";
import { ComponentInternalInstance } from "vue";
import useLangStore from "./store/langStore";

const messages = { en: en, zh: zhCn };

let i18n = createI18n({
  // 使用 composition API
  legacy: false,
  // 全局使用 t 函数
  globalInjection: true,
  locale: "zh",
  messages,
});

export const setLocaleMessage = (lang: any) => {
  i18n.global.setLocaleMessage("en", { ...en, ...lang.en });
  i18n.global.setLocaleMessage("zh", { ...zhCn, ...lang["zh-cn"] });
  i18n.global.setMissingHandler(
    (
      locale: Locale,
      key: Path,
      instance?: ComponentInternalInstance,
      type?: string
    ) => {
      console.log(key);
      const langStore = useLangStore();
      if (langStore.missingKeys.includes(key)) {
        return;
      }
      langStore.addMissingKey(key);
    }
  );
};
export const t = i18n.global.t;
export default i18n;
