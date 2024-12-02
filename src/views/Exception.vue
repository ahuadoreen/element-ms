<template>
  <el-empty :description="type" :image="image">
    <el-button type="primary" @click="goToHome">{{
      $t("backToHome")
    }}</el-button>
  </el-empty>
</template>
<script lang="ts" setup>
import { onBeforeMount, Ref, ref } from "vue";
import router from "~/router";
import svg403 from "../assets/403.svg";

const props = defineProps({
  type: {
    type: String,
    default: "404",
  },
});
const image: Ref<string | undefined> = ref(undefined);
const goToHome = () => {
  router.push("/");
};
onBeforeMount(() => {
  if (props.type == "403") {
    image.value = svg403;
  }
});
</script>
<style scoped>
:deep(.ep-empty__description) p {
  font-size: 24px !important;
}
</style>
