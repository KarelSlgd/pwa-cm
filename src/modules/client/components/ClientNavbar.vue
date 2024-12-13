<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <router-link to="/" style="text-decoration: none; color: white"
        >CrochetMart</router-link
      >
    </div>
    <button class="navbar-toggler" @click="toggleMenu">
      <i class="pi pi-bars"></i>
    </button>
    <div :class="['navbar-links', { 'navbar-links-active': isMenuOpen }]">
      <router-link to="/productos" class="navbar-link"> Productos </router-link>
      <router-link to="/descarga" class="navbar-link">
        Iniciar Sesión
      </router-link>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      isMenuOpen: false,
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
  },
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: #252525;
  height: 60px;
}

.navbar-brand {
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
}

.navbar-toggler {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  display: none;
  cursor: pointer;
  position: absolute;
  right: 20px;
}

.navbar-links {
  display: flex;
  gap: 30px;
}

.navbar-link {
  color: white;
  text-decoration: none;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 5px;
}

.navbar-link i {
  font-size: 1.2rem;
}

.navbar-link:hover {
  color: gray;
}

@media (max-width: 768px) {
  .navbar-toggler {
    display: block;
  }

  .navbar-links {
    display: none;
    flex-direction: column;
    gap: 10px;
    background-color: #252525;
    position: absolute;
    top: 60px;
    right: 0;
    left: 0;
    padding: 10px 20px;
    z-index: 10;
  }

  .navbar-links-active {
    display: flex;
  }
}
</style>
