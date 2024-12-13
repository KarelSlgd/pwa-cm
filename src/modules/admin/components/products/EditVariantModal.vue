<template>
  <div>
    <Dialog
      header="Editar variante"
      :visible.sync="localVisible"
      :containerStyle="{ width: '50vw' }"
      class="font-bold"
      @hide="closeModal"
      modal
      closable
    >
      <div class="flex flex-wrap md:flex-nowrap">
        <div class="col-12 md:col-8 mb-3 md:mb-0">
          <div class="image-upload-container">
            <input
              type="file"
              ref="fileInput"
              multiple
              accept="image/*"
              class="hidden-input"
              @change="handleFileInput"
            />
            <div
              class="upload-area"
              @click="triggerFileInput"
              @dragover.prevent
              @drop.prevent="handleFileDrop"
            >
              <i class="pi pi-upload"></i>
              <p>Arrastra y suelta archivos aquí para subir o selecciona.</p>
            </div>
            <div v-if="uploadedFiles.length" class="uploaded-images">
              <div
                v-for="(file, index) in uploadedFiles"
                :key="index"
                class="image-item flex align-items-center"
              >
                <img
                  :src="file.objectURL"
                  alt="Uploaded"
                  class="uploaded-image"
                />
                <div class="file-info">
                  <p class="file-name">{{ file.name }}</p>
                </div>
                <Button icon="pi pi-times" @click="removeImage(index)" />
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 md:col-4">
          <div class="p-fluid">
            <div class="field">
              <label for="price">Precio</label>
              <InputNumber
                id="price"
                v-model="price"
                mode="currency"
                currency="MXN"
                locale="es-MX"
                :class="{ 'p-invalid': isPriceInvalid }"
                @blur="validatePrice"
              />
              <small v-if="isPriceInvalid" class="p-error"
                >El precio es obligatorio.</small
              >
            </div>
            <div class="field">
              <label for="color">Color</label>
              <Dropdown
                id="color"
                v-model="selectedColor"
                :options="colors"
                optionLabel="name"
                appendTo="body"
                placeholder="Seleccione un color"
                :class="{ 'p-invalid': isColorInvalid }"
                @blur="validateColor"
              >
                <template #option="slotProps">
                  <div class="flex align-items-center">
                    <span
                      class="color-preview"
                      :style="{ backgroundColor: slotProps.option.value }"
                    ></span>
                    <span>{{ slotProps.option.name }}</span>
                  </div>
                </template>
              </Dropdown>
              <small v-if="isColorInvalid" class="p-error"
                >El color es obligatorio.</small
              >
            </div>
            <div class="field">
              <label for="stock">Existencia</label>
              <InputNumber
                id="stock"
                v-model="stock"
                :class="{ 'p-invalid': isStockInvalid }"
                @blur="validateStock"
                :min="0"
              />
              <small v-if="isStockInvalid" class="p-error"
                >Las existencias son obligatorias.</small
              >
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <Button
          label="Cancelar"
          @click="closeModal"
          class="p-button-text p-button-secondary"
        />
        <Button
          label="Guardar"
          @click="submitForm"
          class="p-button"
          :disabled="isLoading"
          :loading="isLoading"
        />
      </template>
    </Dialog>
  </div>
</template>

<script>
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputNumber from "primevue/inputnumber";
import Dropdown from "primevue/dropdown";
import AdminServices from "@/modules/admin/services/AdminServices";

export default {
  components: {
    Button,
    Dialog,
    InputNumber,
    Dropdown,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    variant: {
      type: String,
      required: true,
    },
    numProduct: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      localVisible: this.visible,
      price: null,
      stock: null,
      selectedColor: null,
      uploadedFiles: [],
      colors: [],
      isPriceInvalid: false,
      isStockInvalid: false,
      isImageInvalid: false,
      isColorInvalid: false,
      fileUploadKey: 0,
      isLoading: false,
    };
  },
  methods: {
    async getAttributes() {
      try {
        const response = await AdminServices.getAttributesAvailable(
          this.numProduct
        );
        this.colors = response.data.map((attr) => ({
          name: attr.name,
          value: "#" + attr.value,
        }));
      } catch (error) {
        this.colors = [];
      }
    },
    closeModal() {
      this.localVisible = false;
      this.$emit("update:visible", false);
      this.resetForm();
    },
    resetForm() {
      this.price = null;
      this.stock = null;
      this.selectedColor = null;
      this.uploadedFiles = [];
      this.fileUploadKey++;
      this.isPriceInvalid = false;
      this.isColorInvalid = false;
      this.isStockInvalid = false;
      this.isImageInvalid = false;
    },
    removeImage(index) {
      const file = this.uploadedFiles[index];
      URL.revokeObjectURL(file.objectURL);
      this.uploadedFiles.splice(index, 1);
      this.validateImages();
    },
    validatePrice() {
      this.isPriceInvalid = !this.price || this.price.toString().length > 10;
    },
    validateColor() {
      this.isColorInvalid = !this.selectedColor;
    },
    validateStock() {
      this.isStockInvalid = !this.stock || this.stock.toString().length > 10;
    },
    validateImages() {
      this.isImageInvalid =
        this.uploadedFiles.length === 0 || this.uploadedFiles.length > 5;
    },
    async submitForm() {
      this.validatePrice();
      this.validateColor();
      this.validateStock();
      this.validateImages();

      if (
        !this.isPriceInvalid &&
        !this.isColorInvalid &&
        !this.isStockInvalid &&
        !this.isImageInvalid
      ) {
        this.isLoading = true;
        try {
          this.updateVariant().then(() => {
            this.$emit("variantUpdated");
          });
          this.closeModal();
        } catch (error) {
          this.$toast.error("Error al actualizar la variante");
        } finally {
          this.isLoading = false;
        }
      }
    },
    async updateVariant() {
      try {
        const formData = new FormData();
        formData.append("price", this.price != null ? this.price : 0);
        formData.append("stock", this.stock != null ? this.stock : 0);
        formData.append("color", this.selectedColor?.name || "");
        formData.append("numProduct", this.variant);

        this.uploadedFiles.forEach(({ file }) => {
          formData.append("imagesDtoList", file);
        });

        const response = await AdminServices.updateVariant(formData);
        const { statusCode, message } = response;

        if (statusCode === 200) {
          this.$toast.success(message);
        } else {
          this.$toast.error(message);
        }
      } catch (error) {
        console.error("Error al actualizar la variante:", error);
        this.$toast.error("Error al actualizar la variante");
      }
    },
    async urlToFile(url, filename) {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new File([blob], filename, { type: blob.type });
      } catch (error) {
        console.error("Error al convertir URL a archivo:", error);
        throw error;
      }
    },
    async loadVariantData() {
      try {
        const response = await AdminServices.getVariantDetails(this.variant);
        const { data, statusCode } = response;

        if (statusCode === 200) {
          this.price = data.price;
          this.stock = data.stock;
          this.colors = data.attributes.map((attr) => ({
            name: attr.value,
            value: "#" + attr.c,
          }));
          this.selectedColor = this.colors.find(
            (color) => color.name === data.attributes[0]?.value
          );

          const imagePromises = data.images.map((imageUrl, index) =>
            this.urlToFile(this.cleanUrl(imageUrl), `image_${index + 1}.webp`)
          );

          const files = await Promise.all(imagePromises);
          this.uploadedFiles = files.map((file) => ({
            file,
            objectURL: URL.createObjectURL(file),
            name: file.name,
            size: file.size,
          }));
        }
      } catch (error) {
        this.$toast.error("Error al cargar los datos de la variante");
      }
    },
    fileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    },
    cleanUrl(url) {
      return url.replace(/http:\/\/[^/]+\/http:\/\//, "http://");
    },
    base64ToFileWithObjectURL(base64, filename) {
      return new Promise((resolve, reject) => {
        try {
          const [header, data] = base64.split(",");
          const mime = header.match(/:(.*?);/)[1];
          const binary = atob(data);
          const array = new Uint8Array(binary.length);

          for (let i = 0; i < binary.length; i++) {
            array[i] = binary.charCodeAt(i);
          }

          const file = new File([array], filename, { type: mime });
          const objectURL = URL.createObjectURL(file);

          Object.defineProperty(file, "objectURL", {
            value: objectURL,
            writable: false,
            enumerable: true,
            configurable: true,
          });

          resolve(file);
        } catch (error) {
          this.$toast.error("Imagen inválida");
          reject(error);
        }
      });
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileInput(event) {
      const files = Array.from(event.target.files).map((file) => ({
        file,
        objectURL: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
      }));

      const validFiles = files.filter((file) => file.size <= 1048576);
      const invalidFiles = files.filter((file) => file.size > 1048576);

      if (this.uploadedFiles.length + validFiles.length > 5) {
        this.$toast.warn("Solo puedes subir un máximo de 5 imágenes.");
        return;
      }

      if (invalidFiles.length > 0) {
        this.$toast.error(
          `Las siguientes imágenes exceden el tamaño permitido de 1 MB: ${invalidFiles
            .map((file) => file.name)
            .join(", ")}`
        );
      }

      this.uploadedFiles.push(...validFiles);
      this.validateImages();
    },
    handleFileDrop(event) {
      const files = Array.from(event.dataTransfer.files).map((file) => ({
        file,
        objectURL: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
      }));

      const validFiles = files.filter((file) => file.size <= 1048576);
      const invalidFiles = files.filter((file) => file.size > 1048576);

      if (this.uploadedFiles.length + validFiles.length > 5) {
        this.$toast.warn("Solo puedes subir un máximo de 5 imágenes.");
        return;
      }

      if (invalidFiles.length > 0) {
        this.$toast.error(
          `Las siguientes imágenes exceden el tamaño permitido de 1 MB: ${invalidFiles
            .map((file) => file.name)
            .join(", ")}`
        );
      }

      this.uploadedFiles.push(...validFiles);
      this.validateImages();
    },
    async openModal() {
      try {
        await this.getAttributes();
        await this.loadVariantData();
        this.localVisible = true;
      } catch (error) {
        this.$toast.error("Error al abrir el modal");
      }
    },
  },
  mounted() {
    this.getAttributes();
    this.loadVariantData();
  },
  watch: {
    visible(newValue) {
      if (newValue) {
        this.openModal();
      } else {
        this.closeModal();
      }
    },
  },
};
</script>

<style scoped>
.color-preview {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 8px;
  border-radius: 4px;
}
.p-error {
  color: red;
}
.image-upload-container {
  display: flex;
  flex-direction: column;
}
.upload-area {
  border: 2px dashed #ddd;
  border-radius: 8px;
  text-align: center;
  padding: 20px;
  cursor: pointer;
}
.upload-area i {
  font-size: 2rem;
  color: #555;
}
.upload-area p {
  margin-top: 8px;
  font-size: 0.9rem;
  color: #888;
}
.hidden-input {
  display: none;
}
.uploaded-images {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}
.image-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.uploaded-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  margin-right: 10px;
}
.file-info {
  flex-grow: 1;
}
.file-name {
  font-weight: bold;
  margin: 0;
}
.file-size {
  font-size: 0.85em;
  color: gray;
}
.p-button-danger {
  margin-left: 10px;
}
</style>
