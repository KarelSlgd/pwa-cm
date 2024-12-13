<template>
  <Card>
    <template #content>
      <div class="p-4 grid align-items-center justify-content-between">
        <div class="text-center md:text-left">
          <span class="text-lg font-bold">{{ title }}</span>
          <div class="font-bold text-3xl md:text-4xl">{{ count }}</div>
        </div>
        <i :class="icon" class="text-4xl md:text-6xl mt-3 md:mt-0"></i>
      </div>
    </template>
  </Card>
</template>
<script>
import Card from "primevue/card";
export default {
  components: {
    Card,
  },
  props: {
    title: {
      type: String,
      default: "Card",
    },
    count: {
      type: Number,
      default: 0,
    },
    icon: {
      type: String,
      default: "pi pi-circle-on",
    },
  },
};
</script>

<style scoped>
.p-card {
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #f0f0f0;
}
</style>
