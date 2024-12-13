<template>
    <div class="w-full md:w-11 lg:w-10 xl:w-8 mx-auto p-3">
        <h1 class="text-center text-2xl md:text-3xl lg:text-4xl mb-2 md:mb-3">
            Hola. ¿En que podemos ayudarte hoy?
        </h1>
        <p class="text-center mb-3 md:mb-5 subtitle">
            Encuentra la información necesaria para gestionar tu tienda de Crochet
        </p>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div v-for="(card, index) in helpCards" :key="index" class="card p-4 border-round-md shadow-1">
                <div class="icon mb-3 text-center">
                    <i :class="card.icon" class="text-4xl"></i>
                </div>
                <h3 class="text-xl font-bold text-center mb-2">{{ card.title }}</h3>
                <p class="text-sm text-center">{{ card.subtitle }}</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            helpCards: [
                {
                    title: "Tus Productos",
                    subtitle: "Administra el catálogo de productos de tu tienda",
                    icon: "pi pi-box",
                },
                {
                    title: "Categorías",
                    subtitle: "Organiza tus productos en categorías",
                    icon: "pi pi-th-large",
                },
                {
                    title: "Usuarios",
                    subtitle: "Gestiona información y permisos de usuarios",
                    icon: "pi pi-user",
                },
                {
                    title: "Ventas",
                    subtitle: "Revisa y controla todas las transacciones",
                    icon: "pi pi-shopping-cart",
                },
                {
                    title: "Configuración de Keys",
                    subtitle: "Gestiona claves de integración",
                    icon: "pi pi-key",
                },
                {
                    title: "Historial de Actividad",
                    subtitle: "Consulta registros de actividad recientes",
                    icon: "pi pi-clock",
                },
            ],
        };
    },
};
</script>

<style scoped>
.card {
    background-color: #fff;
    border: 1px solid #ddd;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
}

.card:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    align-items: stretch;
}
</style>