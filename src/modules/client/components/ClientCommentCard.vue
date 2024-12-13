<template>
    <Card class="flex flex-column justify-content-between p-3 border-round-xl w-full max-w-30rem">
        <template #content>
            <div class="flex justify-content-between align-items-center mb-2">
                <Rating :value="commentData.rating" :readonly="true" :stars="5" :cancel="false" />
                <span class="card-date">{{ commentData.date }}</span>
            </div>
            <p class="card-text">{{ commentData.text }}</p>
        </template>
    </Card>
</template>

<script>
import Card from 'primevue/card';
import Rating from 'primevue/rating';

export default {
    name: "ClientCommentCard",
    components: {
        Card, Rating
    },
    props: {
        comment: {
            type: Object,
            required: true
        }
    },
    computed: {
        commentData() {
            return {
                rating: this.comment.rating || 0,
                date: this.comment.date || 'Sin fecha',
                text: this.comment.text || 'Sin comentario'
            };
        }
    }
};
</script>

<style scoped>
.card-date {
    font-size: 0.9rem;
    color: #757575;
}

.card-text {
    font-size: 1rem;
    color: #333;
}
</style>
