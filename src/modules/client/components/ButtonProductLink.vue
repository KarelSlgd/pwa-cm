<template>
    <router-link :to="to" class="inline-flex align-items-center justify-content-center text-base font-semibold text-white no-underline border-round-sm btn-products">
        <slot></slot>
    </router-link>
</template>

<script>
export default {
    name: 'ButtonLink',
    props: {
        to: {
            type: String,
            required: true
        }
    }
};
</script>

<style scoped>
.btn-products {
    padding: 0.5rem 1rem;
    background-color: #252525;
    border: none;
    cursor: pointer;
    box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
                0px 2px 2px 0px rgba(0, 0, 0, 0.14),
                0px 1px 5px 0px rgba(0, 0, 0, 0.12);
}

.btn-products:hover {
    background-color: #5a6268;
}

.btn-products:active {
    box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.2),
                0px 8px 10px 1px rgba(0, 0, 0, 0.14),
                0px 3px 14px 2px rgba(0, 0, 0, 0.12);
}

.btn-products:focus {
    outline: 0;
}
</style>
