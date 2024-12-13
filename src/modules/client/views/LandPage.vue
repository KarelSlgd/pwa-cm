<template>
  <div class="pt-5">
    <HeroSection />
    <div class="px-4">
      <div class="grid align-items-center justify-content-between">
        <h1 class="col-10">¡Nuevos productos!</h1>
        <router-link to="/productos" class="col-2 text-right"
          style="text-decoration: none; color: #252525; font-weight: bold">
          <h2>Da click para ver mas</h2>
        </router-link>
      </div>
      <div class="grid pt-3">
        <div class="col-12 md:col-6 lg:col-4 xl:col-3" v-for="(product, index) in newProducts" :key="index">
          <CardsProducts :product="product" @click="redirectToProduct(product.numProduct)"
            class="related-product-card" />
        </div>
      </div>

      <div class="grid align-items-center justify-content-between mt-5">
        <h1 class="col-10">Categorías</h1>
        <router-link to="/productos" class="col-2 text-right"
          style="text-decoration: none; color: #252525; font-weight: bold">
          <h2>Ver más</h2>
        </router-link>
      </div>
      <div class="grid">
        <div class="col-12 sm:col-6 md:col-2 lg:col-2" v-for="(category, index) in categories" :key="index">
          <CategoryCard :category="category" class="p-4" />
        </div>
      </div>

      <div class="grid align-items-center justify-content-between">
        <h1 class="col-10">Mejor Valorados</h1>
        <router-link to="/productos" class="col-2 text-right"
          style="text-decoration: none; color: #252525; font-weight: bold">
          <h2>Ver más</h2>
        </router-link>
      </div>
      <div class="grid pt-3">
        <div class="col-12 md:col-6 lg:col-4 xl:col-3" v-for="(product, index) in topRatedProducts" :key="index">
          <CardsProducts :product="product" @click="redirectToProduct(product.numProduct)"
            class="related-product-card" />
        </div>
      </div>

      <div class="grid pt-5 mt-3">
        <h1>Nuestros Clientes Opinan</h1>
      </div>
      <div class="mb-4">
        <div class="grid">
          <div v-for="(review, index) in productReviews" :key="index" class="col-12 lg:col-6 xl:col-4">
            <ClientCardsReview :data="review" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CardsProducts from "../components/CardsProducts.vue";
import HeroSection from "../components/HeroSection.vue";
import ClientCardsReview from "../components/ClientCardsReview.vue";
import CategoryCard from "../components/ClientCardCategory.vue";
import carouselImage1 from "@/assets/images/Banner-1.png";
import carouselImage2 from "@/assets/images/Banner-2.png";
import carouselImage3 from "@/assets/images/Banner-3.png";
import carouselImage4 from "@/assets/images/Banner-4.png";
import ClientService from "../services/ClientServices";
export default {
  components: {
    CardsProducts,
    ClientCardsReview,
    CategoryCard,
    HeroSection,
  },
  data() {
    return {
      images: [
        {
          itemImageSrc: carouselImage1,
          alt: "Image 1",
        },
        {
          itemImageSrc: carouselImage2,
          alt: "Image 2",
        },
        {
          itemImageSrc: carouselImage3,
          alt: "Image 3",
        },
        {
          itemImageSrc: carouselImage4,
          alt: "Image 4",
        },
      ],
      topRatedProducts: [],
      newProducts: [],
      categories: [],
      productReviews: [],
    };
  },
  methods: {
    async getNewProducts() {
      try {
        const response = await ClientService.getNewProducts();
        this.newProducts = response.data.slice(0, 4);
      } catch (error) {
        console.log(error);
      }
    },
    async getTopRatedProducts() {
      try {
        const response = await ClientService.getTopRatedProducts();
        this.topRatedProducts = response.data.slice(0, 4);
      } catch (error) {
        console.log(error);
      }
    },
    async getCategories() {
      try {
        const response = await ClientService.getCategories();
        this.categories = response.data.slice(0, 6);
      } catch (error) {
        console.log(error);
      }
    },
    async getTopRatedComments() {
      try {
        const response = await ClientService.getTopRatedComments();
        this.productReviews = response.data.slice(0, 3);
      } catch (error) {
        console.log(error);
      }
    },
    redirectToProduct(numProduct) {
      localStorage.setItem("selectedProduct", JSON.stringify(numProduct));
      this.$router.push({ name: "DetailsProduct" });
    },
  },
  mounted() {
    this.getNewProducts();
    this.getTopRatedProducts();
    this.getCategories();
    this.getTopRatedComments();
  },
};
</script>

<style lang="css">
.hero-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem 0;
  background-color: #ffffff;
}

.content h1 {
  font-size: 3rem;
  font-weight: bold;
  margin: 0;
  color: #252525;
}

.content p {
  font-size: 1.2rem;
  margin: 10px 0 20px 0;
  color: #666;
}

.search-bar {
  display: flex;
  justify-content: center;
  align-items: center;
}

.search-input {
  width: 100%;
  padding: 20px;
  font-size: 1.2rem;
  border: 1px solid #ddd;
  border-radius: 5px 0 0 5px;
}

.search-button {
  background-color: black;
  color: white;
  font-size: 1rem;
  padding: 23px;
  border: none;
  border-radius: 0 5px 5px 0;
  cursor: pointer;
}

.search-button:hover {
  background-color: #333;
}

.horizontal-scroll-container {
  overflow-x: scroll;
  display: flex;
  scroll-behavior: smooth;
  padding-bottom: 1rem;
}

.horizontal-scroll-content {
  display: flex;
  gap: 1rem;
  scroll-snap-type: x mandatory;
}

.related-product-card {
  scroll-snap-align: start;
  flex: 0 0 auto;
  width: 220px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.related-product-card:hover {
  transform: translateY(-5px);
}

.horizontal-scroll-container::-webkit-scrollbar {
  height: 8px;
}

.horizontal-scroll-container::-webkit-scrollbar-thumb {
  background-color: #252525;
  border-radius: 10px;
}

.search-container {
  width: 100%;
}

.p-input-icon-left {
  display: flex;
  align-items: center;
  width: 100%;
  border: 1px solid #d3d3d3;
}

.p-input-icon-left .p-inputtext {
  flex: 1;
  border: none;
  box-shadow: none;
  outline: none;
  width: 100%;
}
</style>