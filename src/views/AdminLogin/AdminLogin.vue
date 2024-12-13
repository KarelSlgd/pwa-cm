<template>
    <div class="flex justify-content-center align-items-center">
        <Card class="p-4 border-round shadow-2 sm:w-10 md:w-8 lg:w-6 xl:w-4 m-2 sm:m-4 md:m-6 lg:m-8">
            <template #content>
                <div class="flex justify-content-center">
                    <img src="../../assets/images/logo.jpg" alt="Crochet Mart" class="logo" />
                </div>

                <!-- Formulario -->
                <form @submit.prevent="login">
                    <div class="field mb-3">
                        <label for="email">Correo electrónico</label>
                        <InputText id="email" v-model="email" class="w-full" :class="{ 'p-invalid': emailError }"
                            placeholder="user34v@hotmail.com" />
                        <small v-if="emailError" class="p-error">Correo inválido.</small>
                    </div>

                    <div class="field mb-3">
                        <label for="password">Contraseña</label>
                        <Password id="password" v-model="password" inputStyle="width: 100%; padding-right: 2rem;"
                            class="w-full" :class="{ 'p-invalid': passwordError }" placeholder="*****************"
                            toggleMask :promptLabel="'Ingresa tu contraseña'" :weakLabel="'Débil'"
                            :mediumLabel="'Moderada'" :strongLabel="'Fuerte'">
                            <template #footer>
                                <Divider />
                                <ul class="pl-2 ml-2 mt-0" style="line-height: 1.5">
                                    <li>Al menos una letra mayúscula</li>
                                    <li>Al menos una letra minúscula</li>
                                    <li>Al menos un número y un carácter especial</li>
                                    <li>Mínimo 8 caracteres</li>
                                </ul>
                            </template>
                        </Password>
                        <small v-if="passwordError" class="p-error">La contraseña es requerida.</small>
                    </div>
                    <div class="flex justify-content-end mb-3"></div>
                    <div class="w-full">
                        <Button label="Ingresar" style="background-color: #252525;" class="w-full" type="submit" />
                        <small v-if="loginError" class="p-error block mt-2">Credenciales incorrectas.</small>
                    </div>
                </form>
            </template>
        </Card>
    </div>
</template>

<script>
import Divider from 'primevue/divider';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Password from 'primevue/password';
import AdminServices from '@/modules/admin/services/AdminServices'
import { mapActions } from 'vuex';
import utils from '@/core/utils/FunctionGlobals'
export default {
    components: {
        InputText,
        Button,
        Card,
        Password,
        Divider
    },
    data() {
        return {
            email: '',
            password: '',
            emailError: false,
            passwordError: false,
            loginError: false,
        };
    },
    methods: {
        validateEmail(email) {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        },
        ...mapActions(['loginUser']),

        async login() {
            this.emailError = !this.validateEmail(this.email);
            this.passwordError = this.password === '';

            if (!this.emailError && !this.passwordError) {
                try {
                    const response = await AdminServices.loginAdmin(this.email, this.password);
                    const { data, statusCode, message } = response;
                    if (statusCode === 200) {
                        this.loginUser(data);
                        const role = utils.getRole();
                        if (role.toString().toLowerCase() === 'admin') {
                            this.$router.push('/admin');
                        }
                    } else {
                        this.$toast.error(message);

                    }

                } catch (error) {
                    this.$toast.error("Ocurrió un error");
                }
            }
        },
    },
};
</script>


<style scoped>
.forgot-password {
    color: #6b6b6b;
    text-decoration: none;
    font-size: 0.9rem;
}

.forgot-password:hover {
    text-decoration: underline;
    color: #000;
}

.logo {
    width: 100%;
    height: auto;
}
</style>
