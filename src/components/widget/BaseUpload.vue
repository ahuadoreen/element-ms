<template>
  <el-upload
    ref="uploadFile"
    :name="uploadName"
    :accept="accept"
    :show-file-list="false"
    :auto-upload="false"
    :limit="1"
    :on-change="onChange"
    w-a
    inline-flex
    ml-3
  >
    <template #trigger>
      <el-button type="primary" :loading="loading">{{
        $t("import")
      }}</el-button>
    </template>
    <el-button
      type="primary"
      :loading="loading"
      @click="exportTemplate"
      mr-3
      link
      >{{ $t("downloadTemplate") }}</el-button
    >
  </el-upload>
</template>
<script lang="ts" setup>
import { ElMessage, ElUpload, UploadFile } from "element-plus";
import { onBeforeMount, PropType, ref } from "vue";
import { loading, download, upload } from "~/api/http";
import { t } from "~/i18n";
import { BaseColumn } from "~/models/models";

const props = defineProps({
  columns: {
    type: Array as PropType<BaseColumn[]>,
    default: [],
  },
  uploadName: {
    type: String,
    default: "file",
  },
  accept: {
    type: String,
    default:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel",
  },
  fileName: {
    type: String,
    default: "",
  },
  requestPath: {
    type: String,
    default: "",
  },
  existUpdate: {
    type: Boolean,
    default: false,
  },
});
const uploadFile = ref<typeof ElUpload>();
const emit = defineEmits(["submitted"]);
onBeforeMount(() => {
  props.columns.forEach((c) => {
    if (c.index && c.importable == undefined) {
      c.importable = true;
    }
  });
});
const uploadUrl = props.requestPath + "/import";
const exportTemplate = () => {
  download(
    `${props.requestPath}/downloadTemplate`,
    `${props.fileName}${t("template")}`,
    {
      tableColumns: props.columns,
    }
  );
};
const onChange = (file: UploadFile) => {
  const isExcel = props.accept.includes(file.raw?.type!);
  const isLt1M = file.raw?.size! / 1024 / 1024 < 1;
  let fileType = "excel";
  if (props.accept.includes("csv")) {
    fileType = "csv";
  }
  if (!isExcel) {
    uploadFile.value!.clearFiles();
    return ElMessage({
      message: t("onlySupportFileType", [fileType]),
      type: "error",
    });
  }
  if (!isLt1M) {
    uploadFile.value!.clearFiles();
    return ElMessage({
      message: t("fileSizeLimit", ["1M"]),
      type: "error",
    });
  }
  upload(uploadUrl, file.raw!, {
    tableColumns: props.columns,
    importExistUpdate: props.existUpdate,
  })
    .then((res) => {
      ElMessage({
        message: t("uploadSuccess"),
        type: "success",
      });
      emit("submitted");
    })
    .catch((error) => {
      uploadFile.value!.clearFiles();
    });
};
</script>
