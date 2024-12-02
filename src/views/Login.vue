<template>
  <div class="login-container">
    <el-card class="login-form">
      <template #header>{{ $t("login") }}</template>
      <BaseForm ref="loginForm" :columns="columns" :inline="false"
    /></el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { post } from "~/api/http";
import useUserStore from "~/store/userStore";
import router from "~/router";
import { getInitInfo } from "~/init";
import { MD5 } from "crypto-js";
import { useRoute } from "vue-router";
import { BaseColumn } from "~/models/models";
import BaseForm from "~/components/widget/BaseForm.vue";
const route = useRoute();
const loginForm = ref<InstanceType<typeof BaseForm>>();

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      const formData = { ...loginForm.value?.formData };
      const md5Password = MD5(formData.password).toString();
      formData.password = md5Password;
      post<any>("security-module/user/login", formData).then((res) => {
        const expired = +new Date() + 1000 * 60 * 120;
        useUserStore().setToken({ token: res.data!.token, expire: expired });
        useUserStore().setUser({ username: res.data!.username });
        getInitInfo(() =>
          router.push(
            route.query && route.query["redirect"]
              ? (route.query["redirect"] as string)
              : "/"
          )
        );
      });
    } else {
      console.log("error submit!");
    }
  });
};
const columns: BaseColumn[] = [
  {
    title: { i18n: "username", text: "用户名" },
    index: "username",
    formRule: [{ required: true }],
  },
  {
    title: { i18n: "password", text: "密码" },
    index: "password",
    fAttribute: { type: "password" },
    formRule: [{ required: true }],
  },
  {
    fType: "button",
    buttons: [
      {
        title: { i18n: "submit", text: "提交" },
        type: "primary",
        style: { width: "100%" },
        click: () => submitForm(loginForm.value?.eForm),
      },
    ],
  },
];
</script>
<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 100vh;
}

.login-form {
  width: 320px;
  margin: 0 auto;
}
</style>
