<template>
    <div class="counter">
      <button @click="decrement" :disabled="value <= min">-</button>
      <input type="text" v-model="value" readonly />
      <button @click="increment" :disabled="value >= max">+</button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      min: {
        type: Number,
        default: 1
      },
      max: {
        type: Number,
        default: 10
      },
      initialValue: {
        type: Number,
        default: 1
      }
    },
    data() {
      return {
        value: this.initialValue
      };
    },
    methods: {
      increment() {
        if (this.value < this.max) {
          this.value++;
        }
      },
      decrement() {
        if (this.value > this.min) {
          this.value--;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .counter {
    display: flex;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 8px;
    overflow: hidden;
    width: 140px;
  }
  
  button {
    width: 40px;
    height: 40px;
    border: none;
    background-color: #fff;
    cursor: pointer;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  button:disabled {
    color: #ccc;
    cursor: not-allowed;
  }
  
  input {
    width: 60px;
    height: 40px;
    text-align: center;
    border: none;
    font-size: 18px;
    pointer-events: none;
  }
  </style>
  