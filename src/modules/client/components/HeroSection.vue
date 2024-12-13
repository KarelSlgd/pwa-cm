<template>
  <div class="hero-section">
    <div class="grid align-items-center">
      <div class="col-12 md:col-6 text-left">
        <h1 class="text-4xl font-bold line-height-2">
          DESCUBRE PRODUCTOS <br />
          ÚNICOS HECHOS A <br />
          MANO EN CROCHET
        </h1>
        <p class="text-secondary mt-3">
          Explora nuestra amplia selección de productos de crochet perfectos
          para regalos, decoración del hogar y uso personal.
        </p>
        <router-link
          to="/descarga"
          class="p-button p-button-rounded p-button-lg mt-4"
          style="text-decoration: none"
        >
          Comprar Ahora
        </router-link>
        <div class="grid mt-5">
          <div class="col-12 sm:col-4">
            <h3 class="text-2xl font-bold">200+</h3>
            <p class="font-semibold">Diseños Artesanales</p>
          </div>
          <div class="col-12 sm:col-4">
            <h3 class="text-2xl font-bold">2,000+</h3>
            <p class="font-semibold">Materiales Ecológicos</p>
          </div>
          <div class="col-12 sm:col-4">
            <h3 class="text-2xl font-bold">30,000+</h3>
            <p class="font-semibold">Clientes Satisfechos</p>
          </div>
        </div>
      </div>

      <div class="col-12 md:col-6 text-center">
        <img :src="chica" alt="Fashion" style="width: 400px" />
      </div>
    </div>
  </div>
</template>

<script>
import chica from "@/assets/images/chica.jpg";

export default {
  data() {
    return {
      chica,
    };
  },
};
</script>

<style scoped>
.text-secondary {
  color: #666;
}

.line-height-2 {
  line-height: 2;
}
</style>
