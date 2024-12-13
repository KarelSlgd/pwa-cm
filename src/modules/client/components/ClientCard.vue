<template>
    <Card class="flex flex-column justify-content-between h-full w-18rem">
        <template #header>
            <img class="w-full h-10rem border-round-lg card-image" :src="product.image || defaultProduct.image" :alt="product.productName || defaultProduct.title"/>
        </template>
        <template #title>
            {{ product.productName || defaultProduct.title }}
        </template>
        <template #content>
            <p class="card-subtitle">{{ product.description || defaultProduct.description }}</p>
        </template>
        <template #footer>
            <div class="flex flex-row align-items-center align-items-stretch gap-6 mt-auto">
                <p class="card-price">${{ product.price || defaultProduct.price }}</p>
                <Button label="Añadir al carrito" class="hover:surface-700 btn-carrito"></Button>
            </div>
        </template>
    </Card>
</template>

<script>
import Button from 'primevue/button';
import Card from 'primevue/card';

export default {
    name: "ClientCard",
    components: {
        Button, Card
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
                title: 'Producto por defecto',
                description: 'Descripción no disponible',
                price: 0
            }
        };
    }
};
</script>

<style scoped>
.card-image {
    object-fit: cover;
}

.card-subtitle {
    color: #757575;
    min-height: 2rem;
}

.card-price {
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
}

.btn-carrito {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    font-weight: 600;
    color: #ffffff;
    background-color: #252525;
    border: none;
    border-radius: 4px;
    text-decoration: none;
    cursor: pointer;
    box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
                0px 2px 2px 0px rgba(0, 0, 0, 0.14),
                0px 1px 5px 0px rgba(0, 0, 0, 0.12);
}

.btn-carrito:hover {
    background-color: #5a6268;
}

.btn-carrito:active {
    box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.2),
                0px 8px 10px 1px rgba(0, 0, 0, 0.14),
                0px 3px 14px 2px rgba(0, 0, 0, 0.12);
}

.btn-carrito:focus {
    outline: 0;
}
</style>