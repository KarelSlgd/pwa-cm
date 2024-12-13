import Vue from 'vue'
import Vuex from 'vuex'
import jwt_decode from 'jwt-decode';

Vue.use(Vuex)
export default new Vuex.Store({
    state() {
        return {
            role: null,
            user: null,
            token: localStorage.getItem("token") || null,
        }
    },
    getters: {
        getUser: state => state.user,
        tokenExists: state => state.token !== null,
        getToken: state => state.token,
        getRole: state => state.role,
        getCode: state => state.code,
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
        setToken(state, token) {
            state.token = token;
            localStorage.setItem("token", token);
            let { roles } = jwt_decode(token);
            let roleName = roles[0].authority;
            state.role = roleName
        },
        clearToken(state) {
            state.token = null;
            localStorage.removeItem("token");
        },
        clearCode(state) {
            state.code = "";
        },
        clearUser(state) {
            state.user = "";
        },
    },
    actions: {
        loginUser({ commit }, token) {
            commit('setToken', token);
        },
        logoutUser({ commit }) {
            commit('clearToken');
        }
    },
    modules: {
    }
})