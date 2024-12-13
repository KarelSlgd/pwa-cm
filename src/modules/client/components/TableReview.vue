<template>
    <div class="rating-component">
      <div class="average-rating">
        <span class="rating-number">{{ avgProductReviews }}</span>
        <div class="flex flex-column">
            <Rating v-model="computedRating" :stars="5" :readonly="true" :cancel="false" />
            <h4 class="m-0 my-1">{{ totalProductReviews }} Calificaciones</h4>
        </div>
      </div>
  
      <div class="rating-breakdown">
        <div v-for="(count, index) in ratingsDistribution" :key="index" class="rating-row">
          <span class="star-count">{{ 5 - index }}</span>
          <Rating :stars="1" :readonly="true" :cancel="false" />
          <div class="progress-bar">
            <div
              class="progress"
              :style="{ width: ((count / totalReviews) * 100) + '%' }"
            ></div>
          </div>
          <span class="review-count">{{ count }}</span>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Rating from 'primevue/rating';
  export default {
    components:{
        Rating
    },
    props: {
      avgProductReviews: {
        type: Number,
        required: true,
        default: 0,
      },
      totalProductReviews: {
        type: Number,
        required: true,
        default: 0,
      },
    },
    data() {
      return {
        ratingsDistribution: [5, 3, 10, 12, 7],
      };
    },
    computed: {
      computedRating: {
        get() {
          return this.avgProductReviews;
        },
      },
    }
  };
  </script>
  
  <style scoped>
  .rating-component {
    font-family: Arial, sans-serif;
    color: #333;
  }
  
  .average-rating {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
  }
  
  .rating-number {
    font-size: 52px;
    font-weight: bold;
  }
  
  .total-reviews {
    font-size: 16px;
    color: #666;
  }
  
  .rating-breakdown {
    width: 200px;
    margin-top: 10px;
  }
  
  .rating-row {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }
  
  .star-count {
    width: 30px;
    font-weight: bold;
    color: #666;
  }
  
  .progress-bar {
    flex-grow: 1;
    height: 8px;
    background-color: #e0e0e0;
    border-radius: 4px;
    margin: 0 10px;
  }
  
  .progress {
    height: 100%;
    background-color: #252525;
    border-radius: 4px;
  }
  
  .review-count {
    font-size: 14px;
    color: #666;
  }
  </style>
  