<template>
  <el-tree-v2 :data="dataSource" :expand-on-click-node="false">
    <template #default="{ node, data }">
      <span mr-4>{{ $t(node.label) }}</span>
      <el-checkbox-group
        v-model="data.checked"
        @change="authChange(data, node)"
      >
        <el-checkbox
          v-for="(item, index) in data.enums"
          :key="index"
          :label="$t(item.label)"
          :value="item.value"
        />
      </el-checkbox-group>
    </template>
  </el-tree-v2>
  <el-button type="primary" @click="onSubmit">{{ $t("submit") }}</el-button>
  <el-button @click="cancel">{{ $t("cancel") }}</el-button>
</template>

<script lang="ts" setup>
import { ElMessage } from "element-plus";
import { TreeNodeData } from "element-plus/es/components/tree/src/tree.type";
import { onMounted, Ref, ref } from "vue";
import { post } from "~/api/http";
import { t } from "~/i18n";
import { TreeNode } from "~/models/models";
import common from "~/utils/common";

const props = defineProps({
  role: {
    type: Object,
  },
  authList: {
    type: Array,
    default: [],
  },
  requestPath: {
    type: String,
    default: "",
  },
});

const dataSource: Ref<any[]> = ref([]);
const dataList: any[] = [];
const emit = defineEmits(["close"]);

onMounted(() => {
  post(`${props.requestPath}/getRoleAuth`, props.role).then((response) => {
    const roleAuthList = response.data as any[];
    roleAuthList.forEach((r) => {
      const currentRole = props.role as any;
      if (r.roleId == currentRole.parentId) {
        const authArray = (r.auth as string).split(",");
        const enums: any[] = [];
        (props.authList as any[]).forEach((a) => {
          if (authArray.includes(a.value)) {
            enums.push({ ...a });
          }
        });
        const data = {
          id: r.menuId,
          label: r.label,
          parentId: r.parentId,
          enums,
          checked: [],
        };
        dataList.push(data);
      } else {
        const existData = dataList.find((d) => d.id == r.menuId);
        const checked: string[] = [];
        (existData.enums as any[]).forEach((d) => {
          if (r.auth.includes(d.value)) {
            checked.push(d.value);
          }
        });
        existData.checked = checked;
      }
    });
    const tree: any[] = [];
    common.formatArrayToTree(dataList, tree);
    dataSource.value = tree;
  });
});
const authChange = (data: TreeNodeData, node: TreeNode) => {
  let checked = data.checked as string[];
  if (checked.length > 0) {
    // 设置子页面权限前必须确保对父级模块有查询权限，所以这里做一个联动勾选
    common.findTreeParent(node, (p) => {
      let pChecked = p.data.checked as string[];
      if (!pChecked.includes("search")) {
        p.data.checked = ["search", ...pChecked];
      }
    });
  }
};
const onSubmit = () => {
  const roleAuthList: any[] = [];
  common.traverseTree(dataSource.value, (d) => {
    const checked = d.checked as string[];
    if (checked.length == 0) return;
    roleAuthList.push({
      roleId: props.role!.id,
      menuId: d.id,
      auth: checked.join(","),
    });
  });
  console.log(roleAuthList);
  let url = props.requestPath + "/saveRoleAuth";
  post(url, roleAuthList).then((response) => {
    ElMessage({
      message: t("success"),
      type: "success",
    });
    emit("close", true);
  });
};
const cancel = () => emit("close");
</script>
