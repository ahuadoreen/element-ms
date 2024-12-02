import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import "~/styles/index.scss";
import "uno.css";
// If you want to use ElMessage, import it.
import "element-plus/theme-chalk/src/index.scss";
// import * as ELEMENT_PLUS_ICONS from "@element-plus/icons-vue"; // 全部导入
import { ELEMENT_PLUS_ICONS } from "./icons"; //按需导入
import directives from "./directives";
import i18n from "./i18n";

const app = createApp(App); // main.js or main.ts
for (const [key, component] of Object.entries(ELEMENT_PLUS_ICONS)) {
  app.component(key, component);
}
app.use(store).use(router).use(directives).use(i18n).mount("#app");
