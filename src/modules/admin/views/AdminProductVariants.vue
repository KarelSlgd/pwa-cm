<template>
  <div class="grid grid-nogutter px-4 sm:px-6 lg:px-6">
    <div class="col-12 md:col-6 flex align-items-center py-2">
      <p class="text-lg font-bold">Administrar variantes del producto</p>
    </div>
    <div class="col-12 md:col-6 flex justify-content-end py-3">
      <Button class="p-button-primary" @click="openModal"> Agregar</Button>
    </div>
    <AddVariantModal
      v-if="product?.numProduct"
      :visible.sync="isAddModalVisible"
      :numProduct="product.numProduct"
      @variantAdded="refreshTable"
    />

    <div class="col-12">
      <div>
        <DataTable
          :value="processedVariants"
          :paginator="true"
          :rows="5"
          dataKey="id"
          :filters.sync="filters"
          filterDisplay="menu"
          responsiveLayout="scroll"
          :globalFilterFields="['price', 'color', 'stock', 'estado']"
          @row-click="handleRowClick"
        >
          <template #header>
            <div class="flex justify-content-end">
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText
                  v-model="filters['global'].value"
                  placeholder="Buscar producto"
                />
              </span>
            </div>
          </template>

          <Column field="image" header="Imagen">
            <template #body="{ data }">
              <img
                :src="data.image || image"
                alt="product"
                class="product-image"
              />
            </template>
          </Column>
          <Column field="price" header="Precio" :sortable="true">
            <template #body="{ data }">
              {{ data.price }}
            </template>
          </Column>
          <Column field="color" header="Color" :sortable="true">
            <template #body="{ data }">
              {{ getColor(data.attributes) }}
            </template>
          </Column>
          <Column field="stock" header="Stock" :sortable="true">
            <template #body="{ data }">
              {{ data.stock }}
            </template>
          </Column>
          <Column field="estado" header="Estado" :sortable="true">
            <template #body="{ data }">
              <span
                v-if="data.stock > 0"
                class="status-badge available font-bold"
                >Disponible</span
              >
              <span v-else class="status-badge no-available font-bold"
                >Agotado</span
              >
            </template>
          </Column>

          <Column header="Acciones">
            <template #body="{ data }">
              <Button
                icon="pi pi-pencil"
                class="mr-2"
                style="border-radius: 100px !important"
                @click="openModalEdit(data)"
              />
            </template>
          </Column>
        </DataTable>
      </div>
      <EditVariantModal
        v-if="selectedVariant"
        :visible.sync="isEditModalVisible"
        :variant="selectedVariant?.id"
        :numProduct="product.numProduct"
        @close="selectedVariant = null"
        @variantUpdated="refreshTable"
      />
    </div>
  </div>
</template>

<script>
import AddVariantModal from "@/modules/admin/components/products/AddVariantModal.vue";
import EditVariantModal from "@/modules/admin/components/products/EditVariantModal.vue";
import image from "@/assets/images/noImageFound.png";
import Button from "primevue/button";
import AdminServices from "../services/AdminServices";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";

export default {
  components: {
    Button,
    DataTable,
    Column,
    InputText,
    AddVariantModal,
    EditVariantModal,
  },
  data() {
    return {
      image,
      variants: [],
      product: null,
      selectedProduct: null,
      selectedVariant: null,
      isEditModalVisible: false,
      isAddModalVisible: false,
      filters: {
        global: { value: null },
        price: { value: null, matchMode: "contains" },
        color: { value: null, matchMode: "contains" },
        stock: { value: null, matchMode: "contains" },
        estado: { value: null, matchMode: "contains" },
      },
    };
  },
  methods: {
    handleRowClick(event) {
      const product = event.data;
      this.$router.push({
        name: "productvariants",
        params: { numProduct: product.numProduct },
      });
    },
    getColor(attributes) {
      const colorAttribute = attributes.find((attr) => attr.name === "Color");
      return colorAttribute ? colorAttribute.value : "N/A";
    },
    openModal() {
      this.isAddModalVisible = true;
    },
    openModalEdit(variant) {
      this.selectedVariant = variant;
      this.isEditModalVisible = true;
    },
    async getVariants(numProduct) {
      try {
        const response = await AdminServices.getVariants(numProduct);
        console.log(response);
        const { data, statusCode } = response;

        if (statusCode === 200) {
          this.variants = data;
        }
      } catch (error) {
        this.$toast.error("Error al obtener las variantes");
      }
    },
    refreshTable() {
      this.getVariants(this.product.numProduct);
    },
  },
  computed: {
    processedVariants() {
      return this.variants.map((variant) => ({
        ...variant,
        color: this.getColor(variant.attributes),
      }));
    },
  },
  mounted() {
    const storedProduct = sessionStorage.getItem("selectedProduct");
    if (storedProduct) {
      this.product = JSON.parse(storedProduct);
      if (this.product) {
        this.$root.$emit("updateNavbarSubtitle", this.product.name);
        this.getVariants(this.product.numProduct);
      }
    }
  },
};
</script>

<style>
.status-badge {
  padding: 0.5em 1em;
  border-radius: 10px;
  width: 80%;
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
  margin: 0 auto;
}
.available {
  background-color: #c9fdd4;
}
.no-available {
  background-color: #fdc9c9;
}
.product-image {
  width: 100px;
  object-fit: cover;
}
</style>