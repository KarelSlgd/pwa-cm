<template>
  <footer>
    <div class="footer-container">
      <!-- Logo and Navigation -->
      <div class="top-section">
        <div class="logo">
          <img :src="logo" alt="Logo" class="logo-img" />
        </div>
        <nav class="nav-links">
          <router-link to="/" class="footer-link">Inicio</router-link>
          <router-link to="/productos" class="footer-link">Productos</router-link>
          <router-link to="/descarga" class="footer-link">Más</router-link>
        </nav>
      </div>

      <!-- Social Icons -->
      <div class="social-icons">
        <a href="#" class="icon-circle"><i class="pi pi-facebook"></i></a>
        <a href="#" class="icon-circle"><i class="pi pi-twitter"></i></a>
        <a href="#" class="icon-circle"><i class="pi pi-instagram"></i></a>
        <a href="#" class="icon-circle"><i class="pi pi-linkedin"></i></a>
      </div>

      <!-- Footer Text -->
      <div class="bottom-section">
        <p>&copy; 2024 Crochet Creaciones. Todos los derechos reservados.</p>
      </div>
    </div>
  </footer>
</template>

<script>
import logo from "@/assets/images/grillo.png";

export default {
  data() {
    return {
      logo: logo,
    };
  },
};
</script>

<style scoped>
.footer-container {
  padding: 40px 20px;
  background-color: #f8f9fa;
  text-align: center;
  color: #6c757d;
  font-family: Arial, sans-serif;
}

.top-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}

.logo-img {
  width: 100px;
  margin-bottom: 10px;
}

.nav-links {
  display: flex;
  gap: 30px;
}

.footer-link {
  color: #252525;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  transition: color 0.3s ease;
}

.social-icons {
  margin: 20px 0;
  display: flex;
  justify-content: center;
  gap: 15px;
}

.icon-circle {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #252525;
  color: white;
  font-size: 20px;
  transition: transform 0.3s ease;
  text-decoration: none;
}

.icon-circle:hover {
  transform: scale(1.1);
}

.bottom-section {
  margin-top: 40px;
  font-size: 14px;
  color: #6c757d;
}
</style>
