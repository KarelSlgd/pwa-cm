<template>
    <Card class="flex flex-column justify-content-between p-3 border-round-xl w-full max-w-20rem">
        <template #header>
            <img class="w-full h-10rem border-round-lg card-image" :src="product.image || defaultProduct.image" :alt="product.productName || defaultProduct.title" />
        </template>
        <template #title>
            <h3>{{ product.productName || defaultProduct.title }}</h3>
        </template>
        <template #content>
            <div class="flex align-items-center gap-2 card-rating">
                <Rating :value="product.rating || defaultProduct.rating" :readonly="true" :stars="5" :cancel="false"/>
                <p class="card-reviews">({{ product.reviews || defaultProduct.reviews }} reseñas)</p>
            </div>
        </template>
    </Card>
</template>

<script>
import Card from 'primevue/card';
import Rating from 'primevue/rating';

export default {
    name: "ClientRatingCard",
    components: {
        Card, Rating
    },
    props: {
        product: {
            type: Object,
            required: false,
            default: () => ({})
        }
    },
    data() {
        return {
            defaultProduct: {
                image: 'https://via.placeholder.com/150',
                title: 'Producto destacado',
                rating: 3,
                reviews: 50
            }
        };
    }
};
</script>

<style scoped>
.card-image {
    object-fit: cover;
}

.card-rating {
    color: #757575;
}

.card-reviews {
    font-size: 0.9rem;
    color: #757575;
}
</style>
