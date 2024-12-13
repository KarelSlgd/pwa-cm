<template>
    <div class="grid">
        <div class="col-12 md:col-3 lg:col-3">
            <h1>Filtros</h1>
            <Card class="flex flex-column max-w-full overflow-hidden">
                <template #content>
                    <Fieldset legend="Categoría" class="mb-3">
                        <Dropdown v-model="selectedCategory" :options="categories" optionLabel="categoryName"
                            placeholder="Selecciona categoría" class="w-full" />
                    </Fieldset>
                    <Fieldset legend="Precio" class="mb-3">
                        <div class="mb-2">
                            <span>Precio: ${{ priceRange[0] }} - ${{ priceRange[1] }}</span>
                        </div>
                        <Slider v-model="priceRange" :min="minPrice" :max="maxPrice" :range="true"
                            class="w-full mb-2" />
                    </Fieldset>
                    <Fieldset legend="Color" class="mb-3">
                        <div class="flex flex-wrap justify-content-center gap-2">
                            <ButtonSelectColor :colors="availableColors" :initialSelectedColor="selectedColor"
                                @color-selected="handleColorSelection" class="w-full" />
                        </div>
                    </Fieldset>
                    <Button label="Aplicar Filtros" @click="fetchFilteredProducts" class="w-full mt-3" />
                </template>
            </Card>
        </div>
        <div class="col-12 md:col-9">
            <h1>Productos</h1>
            <div v-if="filteredProducts.length > 0">
                <div class="grid gap-2">
                    <div class="col-12 sm:col-6 md:col-4 lg:col-3 xl:col-3" v-for="(product, index) in paginatedProducts" :key="index">
                        <CardsProducts :product="product" @click="redirectToProduct(product.numProduct)" class="related-product-card" />
                    </div>
                </div>
                <Paginator :rows="itemsPerPage" :totalRecords="filteredProducts.length" :page="currentPage"
                    @page="onPageChange" />
            </div>
            <div v-else>
                <p>No se encontraron productos con los filtros seleccionados.</p>
            </div>
        </div>
    </div>
</template>

<script>
import Card from 'primevue/card';
import Dropdown from 'primevue/dropdown';
import Slider from 'primevue/slider';
import Fieldset from 'primevue/fieldset';
import Button from 'primevue/button';
import Paginator from 'primevue/paginator';

import ButtonSelectColor from '../components/ButtonSelectColor.vue';
import CardsProducts from "../components/CardsProducts.vue";
import ClientService from "../services/ClientServices";

export default {
    components: {
        Card,
        Dropdown,
        Slider,
        Fieldset,
        Button,
        Paginator,
        ButtonSelectColor,
        CardsProducts,
    },
    data() {
        return {
            categories: [],
            products: [],
            availableColors: [],
            selectedCategory: null,
            priceRange: [0, 2000],
            minPrice: 0,
            maxPrice: 2000,
            selectedColor: null,
            currentPage: 1,
            itemsPerPage: 6,
        };
    },
    computed: {
        filteredProducts() {
            return this.products.filter(product => product && typeof product === 'object');
        },
        paginatedProducts() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredProducts.slice(start, end);
        }
    },
    methods: {
        async getCategory() {
            try {
                const response = await ClientService.getCategoryByStatus("enable");
                if (response && response.data) {
                    this.categories = response.data;
                }
            } catch (error) {
                console.error("Error obteniendo categorías:", error);
            }
        },
        async getMinMaxPrice() {
            try {
                const response = await ClientService.getMinAndMaxPrice();
                if (response && response.data) {
                    this.minPrice = response.data.minPrice;
                    this.maxPrice = response.data.maxPrice;
                    this.priceRange = [this.minPrice, this.maxPrice];
                }
            } catch (error) {
                console.error('Error obteniendo precios:', error);
            }
        },
        async getColors() {
            try {
                const response = await ClientService.getAttributeByName("color");
                if (response && response.data) {
                    this.availableColors = response.data.map(color => ({
                        name: color.name,
                        value: `#${color.value}`, // Convertimos el valor a hexadecimal
                    }));
                }
            } catch (error) {
                console.error("Error obteniendo colores:", error);
            }
        },
        async fetchFilteredProducts() {
            try {
                const filters = {
                    color: this.selectedColor || null,
                    category: this.selectedCategory?.categoryName || null,
                    minPrice: this.priceRange[0],
                    maxPrice: this.priceRange[1],
                };
                Object.keys(filters).forEach(key => {
                    if (!filters[key]) delete filters[key];
                });
                const response = await ClientService.getProductsByFilters(filters);
                if (response && response.data && Array.isArray(response.data)) {
                    this.products = response.data;
                } else {
                    console.error("El formato de respuesta no es válido.");
                    this.products = [];
                }
            } catch (error) {
                console.error("Error obteniendo productos filtrados:", error);
            }
        },
        handleColorSelection(color) {
            this.selectedColor = color.name;
        },
        onPageChange(event) {
            this.currentPage = event.page + 1;
        },
        redirectToProduct(numProduct) {
            localStorage.setItem("selectedProduct", JSON.stringify(numProduct));
            this.$router.push({ name: "DetailsProduct" });
        },
    },
    mounted() {
        this.getCategory();
        this.getMinMaxPrice();
        this.getColors();
        this.fetchFilteredProducts();
    },
};
</script>

<style scoped>
.related-product-card {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
}

.related-product-card:hover {
    transform: translateY(-5px);
}
</style>
