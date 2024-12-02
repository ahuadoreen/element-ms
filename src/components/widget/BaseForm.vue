<template>
  <el-form
    ref="eForm"
    :inline="inline"
    :label-position="labelPosition"
    :model="formData"
    :label-width="labelWidth"
  >
    <el-form-item
      v-for="(item, fIndex) in columns"
      :key="fIndex"
      :prop="item.fType == 'button' ? undefined : item.index"
      :label="
        item.fType == 'button'
          ? undefined
          : typeof item.title == 'string'
          ? item.title
          : item.title?.i18n
          ? $t(item.title?.i18n)
          : item.title?.text
      "
      :style="
        item.formStyle ??
        (item.fAttribute?.type == 'daterange' ? { width: '400px' } : {})
      "
      :rules="item.formRule"
    >
      <el-select
        v-if="item.fType == 'select'"
        v-model="formData[item.index ?? '']"
        :multiple="item.fAttribute ? item.fAttribute.multiple : false"
        :filterable="
          item.fAttribute && item.fAttribute.filterable != undefined
            ? item.fAttribute.filterable
            : true
        "
        :clearable="
          item.fAttribute && item.fAttribute.clearable != undefined
            ? item.fAttribute.clearable
            : true
        "
        @change="item.fAttribute ? item.fAttribute.OnChange : undefined"
      >
        <el-option
          v-for="op in item.enums"
          :key="op.value"
          :label="op.label"
          :value="op.value"
        >
        </el-option>
      </el-select>
      <el-date-picker
        v-if="item.fType == 'date-picker'"
        v-model="formData[item.index ?? '']"
        :type="
          item.fAttribute && item.fAttribute.type
            ? item.fAttribute.type
            : 'date'
        "
        :value-format="
          item.fAttribute?.valueFormat ??
          (USE_LOCAL_TIME ? DATETIME_FORMAT_STRING : undefined)
        "
      >
      </el-date-picker>
      <el-input-number
        v-if="item.fType == 'number'"
        v-model="formData[item.index ?? '']"
        :precision="item.fAttribute?.precision"
        :step="item.fAttribute?.step"
      />
      <el-radio-group
        v-if="item.fType == 'radio'"
        v-model="formData[item.index ?? '']"
      >
        <el-radio v-for="op in item.enums" :key="op.value" :value="op.value">
          {{ op.label }}
        </el-radio>
      </el-radio-group>
      <el-checkbox-group
        v-if="item.fType == 'checkbox'"
        v-model="formData[item.index ?? '']"
      >
        <el-checkbox
          v-for="op in item.enums"
          :key="op.value"
          :label="op.label"
          :value="op.value"
        ></el-checkbox>
      </el-checkbox-group>
      <el-tree-select
        v-if="item.fType == 'tree-select'"
        v-model="formData[item.index ?? '']"
        :data="item.fEnum"
        :multiple="item.fAttribute ? item.fAttribute.multiple : false"
        check-strictly
        :filterable="
          item.fAttribute && item.fAttribute.filterable != undefined
            ? item.fAttribute.filterable
            : true
        "
        :clearable="
          item.fAttribute && item.fAttribute.clearable != undefined
            ? item.fAttribute.clearable
            : true
        "
      />
      <template v-if="item.fType == 'button'">
        <el-button
          v-for="(button, bindex) in item.buttons || []"
          :key="'button' + bindex"
          :loading="loading"
          @click="button.click()"
          :type="button.type"
          :size="button.size ? button.size : 'default'"
          :icon="button.icon"
          :disabled="
            button.disabled
              ? typeof button.disabled == 'boolean'
                ? button.disabled
                : button.disabled()
              : false
          "
          :style="button.style"
          >{{
            typeof button.title == "string"
              ? button.title
              : button.title?.i18n
              ? $t(button.title?.i18n)
              : button.title?.text
          }}</el-button
        >
      </template>
      <el-input
        v-if="!item.fType"
        :type="item.fAttribute ? item.fAttribute.type : undefined"
        v-model="formData[item.index ?? '']"
        :clearable="
          item.fAttribute && item.fAttribute.clearable != undefined
            ? item.fAttribute.clearable
            : true
        "
        :rows="item.fAttribute?.rows"
      ></el-input>
    </el-form-item>
  </el-form>
</template>
<script lang="ts" setup>
import { ElForm } from "element-plus";
import { onBeforeMount, PropType, Ref, ref } from "vue";
import { BaseColumn } from "~/models/models";
import common from "~/utils/common";
import { loading } from "~/api/http";
import { USE_LOCAL_TIME, DATETIME_FORMAT_STRING } from "~/utils/constant";

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
  labelPosition: {
    type: String as PropType<"top" | "left" | "right">,
    default: "right",
  },
  labelWidth: {
    type: String,
    default: "auto",
  },
});
let formData: Ref<any> = ref({});
const eForm = ref<InstanceType<typeof ElForm>>();
onBeforeMount(() => {
  props.columns.forEach((c) => {
    if (c.fType?.includes("tree")) {
      c.fEnum = [];
      if (c.enums && c.enums.length > 0 && c.enums[0].children) {
        c.fEnum = c.enums;
      } else {
        common.formatArrayToTree(c.enums!, c.fEnum);
      }
    }
  });
  const keys = Object.keys(props.form);
  keys.forEach((k) => {
    if (
      props.form[k] === undefined ||
      props.form[k] === null ||
      props.form[k] === ""
    )
      return;
    formData.value[k] = props.form[k];
  });
});
const reset = () => {
  formData.value = props.form;
  eForm.value!.resetFields();
};
defineExpose({ reset, formData, eForm });
</script>
