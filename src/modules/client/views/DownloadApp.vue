<template>
  <div class="download-app-screen my-5">
    <div class="content">
      <h1 class="title">¡Compra desde nuestra App!</h1>
      <p class="description">
        Solo puedes realizar tus compras a través de nuestra aplicación.
        <br />
        Descárgala ahora en Android y iOS.
      </p>

      <div class="buttons">
        <a
          :href="androidFile"
          download="App-Android.apk"
          target="_blank"
          class="btn"
        >
          <i class="pi pi-android icon"></i>
          Para Android
        </a>
        <a :href="iosFile" download="App-iOS.ipa" target="_blank" class="btn">
          <i class="pi pi-apple icon"></i>
          Para iOS
        </a>
      </div>

      <div class="mockups">
        <img :src="mobile1" alt="Mobile Mockup 1" class="mockup" />
        <img :src="mobile2" alt="Mobile Mockup 2" class="mockup" />
        <img :src="mobile3" alt="Mobile Mockup 3" class="mockup" />
      </div>
    </div>
  </div>
</template>

<script>
import mobile1 from "@/assets/images/mobile2.jpg";
import mobile2 from "@/assets/images/mobile1.jpg";
import mobile3 from "@/assets/images/mobile3.jpg";
import ClientServices from "../services/ClientServices";

export default {
  data() {
    return {
      mobile1,
      mobile2,
      mobile3,
      androidFile: "",
      iosFile: "",
    };
  },
  methods: {
    async getLinkAndroid() {
      try {
        const response = await ClientServices.getLinkAndroid();
        const { data, statusCode } = response;
        if (statusCode === 200) {
          this.androidFile = data.url;
        }
      } catch (error) {
        this.$toast.error("Error al obtener los pedidos");
      }
    },
    async getLinkIos() {
      try {
        const response = await ClientServices.getLinkIos();
        const { data, statusCode } = response;
        if (statusCode === 200) {
          this.iosFile = data.url;
        }
      } catch (error) {
        this.$toast.error("Error al obtener los pedidos");
      }
    },
  },
  mounted() {
    this.getLinkAndroid();
    this.getLinkIos();
  },
};
</script>

<style scoped>
.download-app-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
  text-align: center;
  padding: 20px;
}

.content {
  max-width: 600px;
}

.title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #333;
}

.description {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #555;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  font-size: 1rem;
  color: #fff;
  background-color: #252525;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #4d4d4d;
}

.icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.mockups {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.mockup {
  width: 300px;
  height: auto;
  border-radius: 10px;
  border: 1px solid #ddd;
  box-shadow: 0 8px 10px rgba(0, 0, 0, 0.1);
}
</style>
