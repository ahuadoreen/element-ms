<template>
  <BaseForm
    ref="editForm"
    :columns="editColumns"
    :form="form"
    :inline="inline"
    :labelWidth="labelWidth"
  />
  <el-button type="primary" :loading="loading" @click="onSubmit()">{{
    $t("submit")
  }}</el-button>
  <el-button @click="cancel">{{ $t("cancel") }}</el-button>
  <el-button
    :loading="loading"
    v-if="!props.form.id"
    type="primary"
    @click="onSubmitContinue"
    >{{ $t("submitContinue") }}</el-button
  >
</template>
<script lang="ts" setup>
import { ElMessage } from "element-plus";
import { onBeforeMount, PropType, ref } from "vue";
import { loading, post } from "~/api/http";
import { BaseColumn } from "~/models/models";
import BaseForm from "./BaseForm.vue";
import { t } from "~/i18n";
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
  formatBeforeSubmit: Function,
});
const editColumns: BaseColumn[] = [];
onBeforeMount(() => {
  let enableProp = false;
  props.columns.forEach((c) => {
    if (!c.editable) return;
    if (c.index == "enable") enableProp = true;
    let newColumn = { ...c };
    newColumn.fType = c.fType
      ? c.fType
      : c.type == "enum" || c.type == "tag"
      ? "select"
      : undefined;
    newColumn.formStyle =
      newColumn.formStyle ??
      ((newColumn.fType == undefined ||
        newColumn.fType == "select" ||
        newColumn.fType == "tree-select") &&
      props.inline
        ? { width: "280px" }
        : {});
    editColumns.push(newColumn);
    if (newColumn.formRule) {
      let ruleItems = newColumn.formRule;
      ruleItems.forEach((rule) => {
        rule.trigger = rule.trigger ?? "blur";
        if (rule.required && !rule.message) {
          rule.message = t("formItemRequired", [
            typeof newColumn.title == "string"
              ? newColumn.title
              : newColumn.title?.i18n
              ? t(newColumn.title?.i18n)
              : newColumn.title?.text,
          ]);
        }
      });
    }
  });
  if (enableProp && props.form["enable"] == undefined) {
    props.form["enable"] = true;
  }
});
const emit = defineEmits(["submitted", "cancel"]);
const editForm = ref<InstanceType<typeof BaseForm>>();
const onSubmit = () => {
  if (!editForm.value || !editForm.value.eForm) return;
  const formValue = { ...editForm.value!.formData };
  if (props.formatBeforeSubmit) {
    props.formatBeforeSubmit(formValue);
  }
  editForm.value?.eForm!.validate((valid) => {
    if (!valid) {
      return;
    }
    let url = props.requestPath + (props.form.id ? "/update" : "/add");
    post(url, formValue).then((response) => {
      ElMessage({
        message: t("success"),
        type: "success",
      });
      editForm.value!.reset();
      emit("submitted", true);
    });
  });
};
const onSubmitContinue = () => {
  const formValue = { ...editForm.value!.formData };
  if (props.formatBeforeSubmit) {
    props.formatBeforeSubmit(formValue);
  }
  editForm.value?.eForm!.validate((valid) => {
    if (!valid) {
      return;
    }
    let url = props.requestPath + "/add";
    post(url, formValue).then((response) => {
      ElMessage({
        message: t("success"),
        type: "success",
      });
      emit("submitted", false);
    });
  });
};
const cancel = () => emit("cancel");
const reset = () => {
  editForm.value!.reset();
};
defineExpose({ reset });
</script>
