<template>
  <BaseView
    ref="langView"
    menuName="system.language"
    :columns="columns"
    :importExistUpdate="true"
  >
    <template #customBar>
      <el-button @click="autoCreate" type="primary">自动新增</el-button>
    </template>
  </BaseView>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { BaseColumn } from "~/models/models";
import useLangStore from "~/store/langStore";
import BaseView from "~/components/widget/BaseView.vue";
import { post } from "~/api/http";
import { ElMessage } from "element-plus";
import { t } from "~/i18n";

const columns: BaseColumn[] = [
  {
    index: "keyName",
    title: { i18n: "i18nKey", text: "国际化关键字" },
    filterable: true,
    editable: true,
    importable: true,
    formRule: [{ required: true }],
  },
  {
    index: "enText",
    title: { i18n: "englishText", text: "英语文本" },
    filterable: true,
    editable: true,
    importable: true,
    formRule: [{ required: true }],
  },
  {
    index: "cnText",
    title: { i18n: "chineseText", text: "中文文本" },
    filterable: true,
    editable: true,
    importable: true,
    formRule: [{ required: true }],
  },
  {
    index: "createTime",
    title: { i18n: "createTime", text: "创建时间" },
    type: "date",
    filterable: true,
    sType: "date-picker",
    sAttribute: { type: "daterange" },
    importable: false,
    width: 160,
    exportable: false,
  },
  {
    index: "updateName",
    title: { i18n: "modifier", text: "修改人" },
    importable: false,
    width: 120,
    exportable: false,
  },
  {
    index: "updateTime",
    title: { i18n: "modifyTime", text: "修改时间" },
    type: "date",
    importable: false,
    width: 160,
    exportable: false,
  },
];
let requestPath: string = "";
const langView = ref<InstanceType<typeof BaseView>>();
onMounted(() => {
  requestPath = langView.value!.requestPath;
});
const autoCreate = () => {
  const missingKeys = useLangStore().missingKeys;
  console.log(missingKeys);
  if (missingKeys.length == 0) {
    return;
  }
  post(`${requestPath}/autoAddMultipleByKeys`, missingKeys).then((response) => {
    useLangStore().missingKeys = [];
    langView.value!.tableWigdet!.search([]);
    ElMessage({
      message: t("success"),
      type: "success",
    });
  });
};
</script>
