<template>
  <div class="category-card">
    <p class="category-name font-bold">{{ category.categoryName }}</p>
  </div>
</template>

<script>

export default {
  props: {
    category: {
      type: Object,
      required: true,
    },
  },
  computed: {

  },
};
</script>

<style scoped>
.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.icon-container {
  background-color: #1e1e1e;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 120px;
  height: 120px;
}

.category-name {
  font-size: 1rem;
  color: #252525;
  margin-top: 1rem;
}
</style>
