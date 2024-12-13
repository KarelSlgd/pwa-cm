<template>
  <div>
    <Navbar />
    <div style="margin: 0 auto; max-width: 95%">
      <router-view />
    </div>
    <Footer />
  </div>
</template>

<script>
import Navbar from "@/modules/client/components/ClientNavbar.vue";
import Footer from "@/modules/client/components/ClientFooter.vue";

export default {
  components: {
    Navbar,
    Footer,
  },
  data() {
    return {};
  },
};
</script>