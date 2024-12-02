<template>
  <div :mb="showFilter ? 0 : 2">
    <slot name="customBar"></slot>
    <el-button
      v-if="acl.add"
      @click="openCreate"
      :loading="loading"
      type="primary"
      v-acl="acl.add"
      >{{ $t("add") }}</el-button
    >
    <el-button
      v-if="acl.delete"
      @click="remove"
      :loading="loading"
      type="danger"
      v-acl="acl.delete"
      >{{ $t("delete") }}</el-button
    >
    <el-button
      v-if="acl.export"
      @click="exportData"
      :loading="loading"
      type="info"
      v-acl="acl.export"
      >{{ $t("export") }}</el-button
    >
    <BaseUpload
      v-if="acl.import"
      :requestPath="requestPath"
      :columns="importColumns"
      :fileName="$t(fileName)"
      v-acl="acl.import"
      :existUpdate="importExistUpdate"
      @submitted="importSuccess"
    />
    <el-button @click="toggleShowFilter" type="primary" ml-3>{{
      $t("search")
    }}</el-button>
    <BaseFilter
      v-if="showFilter"
      ref="baseFilterForm"
      :columns="columns"
      @filterChanged="onFilterChanged"
    ></BaseFilter>
  </div>
  <BaseTable
    ref="tableWigdet"
    :requestPath="requestPath"
    :columns="columns"
    :filterConditions="filterConditions"
    :height="tableHeight"
    :showPage="showPage"
    :processData="processData"
    :type="tableType"
    :defaultSort="defaultSort"
    @selectionChanged="onSelectionChanged"
  />
  <el-dialog
    v-model="dialogCreateVisible"
    :title="dialogTitle"
    width="1000"
    destroy-on-close
    @closed="onClosed"
  >
    <BaseEdit
      v-if="isEdit"
      ref="baseEditForm"
      :form="form"
      :columns="columns"
      :requestPath="requestPath"
      :formatBeforeSubmit="formatBeforeSubmit"
      @submitted="submitted"
      @cancel="dialogCreateVisible = false"
    />
    <BaseDescription v-if="!isEdit" :form="form" :columns="columns" />
  </el-dialog>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox, Sort } from "element-plus";
import {
  nextTick,
  onBeforeMount,
  onMounted,
  PropType,
  reactive,
  Ref,
  ref,
  watch,
} from "vue";
import { loading, download, post } from "~/api/http";
import { BaseColumn } from "~/models/models";
import useMenuStore from "~/store/menuStore";
import BaseTable from "./BaseTable.vue";
import BaseEdit from "./BaseEdit.vue";
import BaseFilter from "./BaseFilter.vue";
import { t } from "~/i18n";
import { FilterCondition } from "~/models/request";
const props = defineProps({
  columns: {
    type: Array as PropType<BaseColumn[]>,
    default: [],
  },
  form: {
    type: Object,
    default: {},
  },
  inline: {
    type: Boolean,
    default: true,
  },
  labelWidth: {
    type: String,
    default: "",
  },
  requestPath: {
    type: String,
    default: "",
  },
  formatBeforeSubmit: {
    type: Function,
  },
  formatBeforeShow: {
    type: Function,
  },
  acl: {
    type: Object as PropType<any>,
    default: {},
  },
  fileName: {
    type: String,
    default: "",
  },
  height: String,
  isNoHeight: {
    type: Boolean,
    default: false,
  },
  showPage: {
    type: Boolean,
    default: true,
  },
  menuName: {
    type: String,
  },
  refreshDictionaryAfterSubmit: {
    type: Boolean,
    default: false,
  },
  processData: {
    type: Function,
  },
  tableType: {
    type: String as PropType<"normal" | "tree">,
    default: "normal",
  },
  showDetail: {
    type: Boolean,
    default: true,
  },
  defaultSort: Array as PropType<Sort[]>,
  importExistUpdate: {
    type: Boolean,
    default: false,
  },
});
const columns: BaseColumn[] = [...props.columns];
const exportColumns: BaseColumn[] = [];
const importColumns: BaseColumn[] = [];
let dialogTitle = ref(t("add"));
let form: any = {};
const tableWigdet = ref<InstanceType<typeof BaseTable>>();
const showFilter = ref(false);
const dialogCreateVisible = ref(false);
const baseEditForm = ref<InstanceType<typeof BaseEdit>>();
const baseFilterForm = ref<InstanceType<typeof BaseFilter>>();
let tableHeight: Ref<string | undefined> = ref(undefined);
let filterConditions: FilterCondition[] = [];
const requestPath = ref(props.requestPath);
const fileName = ref(props.fileName);
const acl = reactive({ ...props.acl });
let isSubmitted = false;
let isEdit = true;
onBeforeMount(() => {
  const menus = useMenuStore().flatMenu;
  if (props.menuName) {
    const menu = menus.find((m) => m.menuName == props.menuName);
    if (menu) {
      requestPath.value = requestPath.value || menu.requestPath;
      fileName.value = fileName.value || menu.label;
      const auth = menu.auth ?? "";
      ["add", "update", "delete", "import", "export"].forEach(
        (c) =>
          (acl[c] =
            props.acl[c] ?? auth.includes(c)
              ? `${
                  menu.requestPath ? menu.requestPath.replace("/", ".") : ""
                }.${c}`
              : undefined)
      );
    }
  }
  const buttonColumn = columns.find((c) => c.buttons);
  let buttons: any[] = [];
  if (acl.update) {
    buttons.push({
      icon: "edit",
      acl: acl.update,
      type: "primary",
      click: (row: any) => {
        isEdit = true;
        dialogTitle.value = t("edit");
        form = { ...row };
        if (props.formatBeforeShow) props.formatBeforeShow(form);
        dialogCreateVisible.value = true;
      },
    });
  } else {
    buttons.push({
      icon: "view",
      type: "primary",
      click: (row: any) => {
        isEdit = false;
        dialogTitle.value = t("view");
        form = { ...row };
        if (props.formatBeforeShow) props.formatBeforeShow(form);
        dialogCreateVisible.value = true;
      },
    });
  }
  if (acl.delete) {
    buttons.push({
      icon: "delete",
      acl: acl.delete,
      type: "danger",
      click: (row: any) => removeById(row.id),
    });
    columns.unshift({ type: "selection" });
  }
  if (buttonColumn) {
    buttonColumn.buttons = [...buttons, ...buttonColumn.buttons!];
  }
  if (buttons.length > 0 && !buttonColumn) {
    columns.push({
      title: { i18n: "operate", text: "操作" },
      buttons: buttons,
      fixed: "right",
      width: 56 + 26 * buttons.length,
    });
  }
  columns.forEach((c) => {
    if (
      (!c.iif || (typeof c.iif == "boolean" ? c.iif : c.iif(c))) &&
      c.index &&
      c.exportable == undefined
    ) {
      c.exportable = true;
    }
    if (c.exportable || c.importable) {
      let newColumn = { ...c };
      newColumn.title =
        typeof c.title == "string"
          ? c.title
          : c.title?.i18n
          ? t(c.title?.i18n)
          : c.title?.text;
      if (newColumn.exportable) {
        exportColumns.push(newColumn);
      }
      if (newColumn.importable) {
        importColumns.push(newColumn);
      }
    }
  });
});
onMounted(() => {
  nextTick(() => {
    getHeight();
  });
  window.onresize = () => {
    getHeight();
  };

  watch(
    () => baseFilterForm.value as any,
    (newFilterForm: Ref) => {
      getHeight();
    },
    { immediate: true }
  );
});
const onFilterChanged = (conditions: FilterCondition[]) => {
  filterConditions.splice(0);
  filterConditions.push(...conditions);
  tableWigdet.value!.search([]);
};
const remove = () => {
  ElMessageBox.confirm(t("confirmDeleteBatch")).then(() => {
    post(`${requestPath.value}/deleteBatch`, checkedIds).then((res) => {
      ElMessage({
        message: t("deleteSuccess"),
        type: "success",
      });
      tableWigdet.value!.search([]);
    });
  });
};
const removeById = (id: number) => {
  ElMessageBox.confirm(t("confirmDeleteSingle")).then(() => {
    post(`${requestPath.value}/delete`, id).then((res) => {
      ElMessage({
        message: t("deleteSuccess"),
        type: "success",
      });
      tableWigdet.value!.search([]);
    });
  });
};
let checkedIds: number[] = [];
const onSelectionChanged = (ids: number[]) => {
  checkedIds = ids;
};
const openCreate = () => {
  isEdit = true;
  dialogTitle.value = t("add");
  form = {};
  dialogCreateVisible.value = true;
};
const submitted = (isClose: boolean) => {
  if (isClose) {
    dialogCreateVisible.value = false;
  }
  isSubmitted = true;
};
const onClosed = () => {
  if (!isSubmitted) return;
  if (props.refreshDictionaryAfterSubmit) {
    tableWigdet.value!.getDictionaries();
  } else {
    tableWigdet.value!.search([]);
  }
  isSubmitted = false;
};
const exportData = () => {
  download(`${requestPath.value}/export`, t(fileName.value), {
    tableInfo: {
      tableColumns: exportColumns,
    },
    filterConditions: filterConditions,
  });
};

const getHeight = () => {
  if (!props.height && !props.isNoHeight) {
    let offset = 0;
    if (baseFilterForm.value) {
      offset += baseFilterForm.value.$el.clientHeight;
    }
    tableHeight.value = `${
      window.innerHeight - (168 + offset) + (props.showPage ? 0 : 32)
    }px`;
  } else {
    if (props.isNoHeight) {
      tableHeight.value = undefined;
    } else {
      tableHeight.value = props.height;
    }
  }
};
const toggleShowFilter = () => {
  showFilter.value = !showFilter.value;
};
const importSuccess = () => {
  isSubmitted = true;
  onClosed();
};
defineExpose({ requestPath, tableWigdet });
</script>
