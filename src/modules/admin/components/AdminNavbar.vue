<template>
  <div>
    <div class="header-container">
      <div class="header-left">
        <i class="pi pi-bars menu-icon" @click="toggleSidebar"></i>
        <p class="ml-3 text-lg" @click="goBack">{{ title }}</p>
        <p class="ml-3 text-lg">{{ subTitle }}</p>
      </div>
      <i class="pi pi-user user-icon"></i>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    sidebarVisible: Boolean,
    title: {
      type: String,
      default: "Inicio",
    },
    subTitle: {
      type: String,
      default: "",
    },
  },
  methods: {
    toggleSidebar() {
      this.$emit("toggle-sidebar");
    },
    goBack() {
      if (this.subTitle) {
        this.$router.go(-1);
      }
    },
  },
};
</script>

<style scoped>
.header-container {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
}

.header-left {
  display: flex;
  align-items: center;
}

.menu-icon {
  font-size: 1.5em;
  color: black;
  cursor: pointer;
}

.user-icon {
  font-size: 1.2em;
  color: white;
  background-color: #252525;
  border-radius: 50%;
  padding: 0.5em;
}
</style>
