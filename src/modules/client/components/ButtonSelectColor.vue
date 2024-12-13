<template>
  <div class="color-picker">
    <div class="colors">
      <div v-for="(color, index) in colors" :key="index" :style="{ backgroundColor: color.value }" class="color-circle"
      :class="{ selected: selectedColor?.value === color.value, loading: isLoading }"
      @click="selectColor(color)"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    colors: {
      type: [Array, Object],
      required: true, // Array de objetos { name, value }
    },
    initialSelectedColor: {
      type: [Object, String],
      default: null, // Objeto { name, value } inicial
    },
    isLoading: {
      type: Boolean,
      default: false, 
    },
  },
  data() {
    return {
      selectedColor: this.initialSelectedColor, // Color seleccionado actual
    };
  },
  methods: {
    selectColor(colorValue) {
      if (this.isLoading) return;
      this.selectedColor = colorValue; // Actualizar el color seleccionado
      this.$emit("color-selected", colorValue); // Emitir el objeto { name, value } al componente padre
    },
  },
};
</script>

<style scoped>
.color-picker {
  color: #252525;
  font-size: 18px;
}

.colors {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.color-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.color-circle:hover {
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

.color-circle.selected {
  border-color: #252525;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.4);
}
.color-circle.loading {
  pointer-events: none; 
  opacity: 0.5; 
}
@media (max-width: 768px) {
  .color-circle {
    width: 30px;
    height: 30px;
  }
}

@media (max-width: 480px) {
  .color-circle {
    width: 25px;
    height: 25px;
  }
}
</style>
