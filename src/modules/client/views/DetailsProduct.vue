<template lang="">
    <div>
        <div class="grid pt-5">
            <div class="col-12 lg:col-6 xl:col-6">
                <div :class="paddingPosition == 'px-4' ? 'px-0' : 'pl-8'">
                    <Galleria 
                        :value="images.length > 0 ? images : placeholderImages" 
                        :responsiveOptions="responsiveOptions" 
                        :numVisible="4" 
                        :thumbnailsPosition="thumbnailsPosition"
                        :showItemNavigatorsOnHover="true" 
                        :showItemNavigators="true" 
                        :circular="true"
                    >
                        <template #item="slotProps">
                            <img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt" style="width: 100%; height: 500px; display: block; object-fit: cover;" />
                        </template>
<template #thumbnail="slotProps">
  <div class="grid grid-nogutter justify-content-center">
    <img
      :src="slotProps.item.thumbnailImageSrc"
      :alt="slotProps.item.alt"
      style="width: 60px; height: 60px; display: block; object-fit: cover"
    />
  </div>
</template>
</Galleria>
</div>
</div>
<div class="col-12 lg:col-6 xl:col-6">
    <div :class="paddingPosition == 'px-8' ? 'pr-8' : paddingPosition">
        <h2 class="m-0">{{ productDetails?.productVariant?.product?.name }}</h2>
        <div v-if="comments.length > 0 || rating.totalProductReviews > 0"
            class="flex align-items-center justify-content-start">
            <Rating v-model="rating.avgProductReviews" :stars="5" :readonly="true" :cancel="false" />
            <p class="m-2">({{ rating.totalProductReviews }})</p>
        </div>
        <h1>${{ productDetails?.productVariant?.price }}</h1>
        <h3>Color</h3>
        <ButtonSelectColor :colors="availableColors" @color-selected="handleColorSelected"   :is-loading="isLoadingImages"
        />
        <h3>Cantidad</h3>
        <div class="flex flex-row flex-wrap">
            <div class="flex align-items-center justify-content-center mr-4 mb-4">
                <ButtonCounter />
            </div>
            <div class="flex align-items-center justify-content-center mb-4">
                <router-link to="/descarga" class="p-button p-button-rounded p-button-text custom-button">
                    Agregar al carrito
                </router-link>
            </div>
        </div>
    </div>
</div>
</div>
<div :class="paddingPosition">
    <!-- Descripción -->
    <div class="pt-5">
        <h1>Descripción</h1>
        <div>
            <p class="m-0" style="font-size: 20px;">
                {{ productDetails?.productVariant?.product?.productDescription }}
            </p>
        </div>
    </div>
    <!-- Reseñas -->
    <div v-if="comments.length > 0 || rating.totalProductReviews > 0" class="grid pt-5">
        <h1>Reseñas del producto</h1>
    </div>
    <div v-if="comments.length > 0 || rating.totalProductReviews > 0" class="grid">
        <div class="col-12 lg:col-4 xl:col-3">
            <TableReview :avgProductReviews="rating.avgProductReviews"
                :totalProductReviews="rating.totalProductReviews" />
        </div>
        <div class="col-12 lg:col-8 xl:col-9" v-for="(comment, index) in comments" :key="index">
            <ClientCardsReview :data="comment" />
        </div>
    </div>
    <!-- Productos relacionados -->
    <div class="grid align-items-center justify-content-between">
        <h1 class="col-10">Productos relacionados</h1>
        <router-link to="/productos" class="col-2 text-right"
            style="text-decoration: none; color: #252525; font-weight: bold">
            <h2>Ver más</h2>
        </router-link>
    </div>
    <div class="grid pt-3 mb-5">
        <div class="col-12 md:col-6 lg:col-4 xl:col-3" v-for="(product, index) in relatedProducts" :key="index">
            <CardsProducts :product="product" @click="redirectToProduct(product.numProduct)"
                class="related-product-card" />
        </div>
    </div>
</div>
</div>
</template>

<script>
import Galleria from 'primevue/galleria';
import Rating from 'primevue/rating';
import notFound from "@/assets/images/noImageFound.png";

import ClientCardsReview from '../components/ClientCardsReview.vue';
import ButtonCounter from '../components/ButtonCounter.vue';
import ButtonSelectColor from '../components/ButtonSelectColor.vue';
import TableReview from '../components/TableReview.vue';
import CardsProducts from '../components/CardsProducts.vue';
import ClientService from "../services/ClientServices";

export default {
    components: {
        Galleria,
        Rating,
        ButtonCounter,
        ButtonSelectColor,
        ClientCardsReview,
        TableReview,
        CardsProducts,
    },
    data() {
        return {
            notFound,
            rating: { avgProductReviews: 0, totalProductReviews: 0 },
            images: [],
            responsiveOptions: [
                { breakpoint: '1024px', numVisible: 4 },
                { breakpoint: '768px', numVisible: 4 },
                { breakpoint: '560px', numVisible: 4 },
            ],
            placeholderImages: [
                {
                    itemImageSrc: notFound,
                    thumbnailImageSrc: notFound,
                    alt: 'No image available',
                },
            ],
            comments: [],
            relatedProducts: [],
            availableColors: [],
            thumbnailsPosition: 'left',
            paddingPosition: 'px-8',
            productDetails: null,
            selectedColor: null,
            variationData: [],
            isLoadingImages: false,
        };
    },
    methods: {
        handleColorSelected(color) {
            if (this.isLoadingImages) return;
            this.selectedColor = color;
            const selectedVariant = this.variationData.find(
                (variation) => variation.attributeHasValue.name === color.name
            );

            if (selectedVariant) {
                this.productDetails = selectedVariant;
                this.isLoadingImages = true;
                this.fetchVariantImages(selectedVariant.productVariant.idProductVariant);
                this.isLoadingImages = false; 

            }
        },
        async fetchVariantImages(variantId) {
            try {
                const imagesResponse = await ClientService.getProductVariantImages(variantId);
                if (!imagesResponse.error && imagesResponse.data) {
                    this.images = imagesResponse.data.map((url) => ({
                        itemImageSrc: url,
                        thumbnailImageSrc: url,
                        alt: "Product Image",
                    }));
                }
            } catch (error) {
                console.error("Error al cargar imágenes:", error);
            }
        },
        updateThumbnailsPosition() {
            this.thumbnailsPosition = window.innerWidth <= 768 ? 'bottom' : 'left';
        },
        updatePaddingPosition() {
            this.paddingPosition = window.innerWidth <= 768 ? 'px-4' : 'px-8';
        },
        async fetchData(productNum) {
            try {
                const [variationResponse, commentsResponse, newProductsResponse] = await Promise.all([
                    ClientService.getVariationAttributes(productNum),
                    ClientService.getReviewProduct(productNum),
                    ClientService.getNewProducts(),
                ]);
                let variantId = null;
                if (!variationResponse.error && variationResponse.data.length > 0) {
                    this.variationData = variationResponse.data;
                    this.productDetails = variationResponse.data[0];
                    variantId = variationResponse.data[0].productVariant.idProductVariant;
                    // Procesar los colores
                    this.availableColors = variationResponse.data.map(variation => ({
                        name: variation.attributeHasValue.name,
                        value: `#${variation.attributeHasValue.value}`, // Convertir valor a hexadecimal
                    }));
                }
                if (!commentsResponse.error) {
                    this.comments = commentsResponse.data.productReviews;
                    this.rating = commentsResponse.data;
                }
                if (!newProductsResponse.error) {
                    this.relatedProducts = newProductsResponse.data.slice(0, 4);
                }
                if (variantId) {
                    const imagesResponse = await ClientService.getProductVariantImages(variantId);
                    if (!imagesResponse.error && imagesResponse.data) {
                        this.images = imagesResponse.data.map((url) => ({
                            itemImageSrc: url,
                            thumbnailImageSrc: url,
                            alt: "Product Image",
                        }));
                    }
                }
            } catch (error) {
                console.error("Error al cargar datos:", error);
            }
        },
    },
    mounted() {
        const numProduct = JSON.parse(localStorage.getItem("selectedProduct"));
        if (numProduct) {
            this.fetchData(numProduct);
        }
        this.updateThumbnailsPosition();
        this.updatePaddingPosition();
        window.addEventListener('resize', this.updateThumbnailsPosition);
        window.addEventListener('resize', this.updatePaddingPosition);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.updateThumbnailsPosition);
        window.removeEventListener('resize', this.updatePaddingPosition);
        localStorage.removeItem("selectedProduct");
    },
};
</script>

<style lang="css">
.p-button {
    width: 257px;
    border-radius: 12%;
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

.custom-button {
    background-color: #007ad9; /* Cambia el color según tus preferencias */
    color: white;
    text-align: center;
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 1rem;
    font-weight: bold;
    display: inline-block;
    text-decoration: none;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.custom-button:hover {
    background-color: #005bb5; /* Color al pasar el cursor */
    transform: translateY(-2px);
}

.custom-button:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
