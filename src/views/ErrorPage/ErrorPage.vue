<template>
    <div class="surface-0 text-center">
        <div class="flex flex-column align-items-center justify-content-center" style="height: calc(100vh - 150px);">
            <img src="@/assets/images/Logo404.png" alt="Saltamontes" class="w-6rem mb-4" />

            <h2 class="text-2xl font-semibold mb-2">¡Oops!</h2>

            <div class="text-container">
                <p class="text-secondary mb-4">
                    Parece que hemos perdido el hilo. La página que buscas se ha deshilachado o no existe en nuestro
                    tejido de crochet.
                </p>
            </div>

            <button @click="goBack" class="p-button custom-button text-white px-4 py-2 font-bold text-base">
                Volver al inicio
            </button>
        </div>

        <div class="wave-container">
            <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
                <path fill="#82E0AA" fill-opacity="1"
                    d="M0,96L60,112C120,128,240,160,360,165.3C480,171,600,149,720,149.3C840,149,960,171,1080,176C1200,181,1320,171,1380,165.3L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z">
                </path>
            </svg>
        </div>
    </div>
</template>

<script>
import utils from '@/core/utils/FunctionGlobals'
export default {
    name: "ErrorPage",
    methods: {
        goBack() {
            const token = utils.getToken();

            if (!token) {
                this.$router.push("/");
                return;
            }

            const role = utils.getRole();
            if (role.toString().toLowerCase() === "admin") {
                this.$router.push("/admin");
            } else {
                this.$router.push("/");
            }
        },
    },
};
</script>

<style scoped>
.surface-0 {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100vh;
}

.text-primary {
    color: #333333;
}

.text-secondary {
    color: #555555;
}

.text-container {
    max-width: 400px;
    margin: 0 auto;
    text-align: center;
}

.custom-button {
    background-color: #16A34A !important;
    border: none;
    transition: background-color 0.3s ease;
}

.custom-button:hover {
    background-color: #15803D !important;
}

.wave-container {
    width: 100%;
    height: auto;
    overflow: hidden;
    position: relative;
}

.responsive-logo {
    width: 350px;
    max-width: 300px;
    height: auto;
}

@media (max-width: 768px) {
    .responsive-logo {
        width: 120px;
    }

    .text-container {
        max-width: 300px;
    }

    .custom-button {
        font-size: 14px;
        padding: 10px 16px;
    }
}

@media (min-width: 1024px) {
    .responsive-logo {
        width: 200px;
    }

    .text-container {
        max-width: 500px;
    }
}
</style>
