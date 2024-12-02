<template>
  <BaseView
    ref="roleView"
    menuName="system.role"
    :columns="columns"
    :refreshDictionaryAfterSubmit="true"
    tableType="tree"
    :showPage="false"
  />
  <el-dialog
    v-model="dialogCreateVisible"
    title="权限管理"
    width="1000"
    destroy-on-close
  >
    <RoleAuth
      :role="role"
      :authList="authList"
      :requestPath="requestPath"
      @close="dialogCreateVisible = false"
    />
  </el-dialog>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import BaseView from "~/components/widget/BaseView.vue";
import { BaseColumn } from "~/models/models";
import { SUPER_ADMIN_ROLE_NAME } from "~/utils/constant";

const columns: BaseColumn[] = [
  {
    index: "roleName",
    title: { i18n: "roleName", text: "角色名称" },
    filterable: true,
    editable: true,
    align: "left",
    formRule: [{ required: true }],
  },
  {
    index: "parentId",
    title: { i18n: "highLevelRole", text: "上级角色" },
    type: "enum",
    bind: "role_list",
    filterable: true,
    editable: true,
    fType: "tree-select",
    formRule: [{ required: true }],
  },
  {
    index: "orderNo",
    title: { i18n: "order", text: "顺序" },
    editable: true,
    fType: "number",
  },
  {
    index: "enable",
    title: { i18n: "isEnable", text: "是否可用" },
    type: "enum",
    bind: { key: "yes_no_tag", i18n: true },
    filterable: true,
    editable: true,
    fType: "radio",
  },
  {
    index: "updateName",
    title: { i18n: "modifier", text: "修改人" },
    importable: false,
    width: 120,
  },
  {
    index: "updateTime",
    title: { i18n: "modifyTime", text: "修改时间" },
    type: "date",
    importable: false,
    width: 160,
  },
  {
    index: "auth",
    bind: "menu_auth",
    iif: () => false,
  },
  {
    title: { i18n: "operate", text: "操作" },
    buttons: [
      {
        icon: "key",
        acl: "security-module.role.update",
        disabled: (row: any) => row.roleName == SUPER_ADMIN_ROLE_NAME,
        click: (row: any) => {
          role = row;
          const column = columns.find((c) => c.index == "auth");
          authList = column?.enums!;
          dialogCreateVisible.value = true;
        },
      },
    ],
    fixed: "right",
  },
];
let role: any = {};
let authList: any[] = [];
const dialogCreateVisible = ref(false);
let requestPath: string = "";
const roleView = ref<InstanceType<typeof BaseView>>();
onMounted(() => {
  requestPath = roleView.value!.requestPath;
});
</script>
