// store.js

import Vue from 'vue';
import Vuex from 'vuex';

export default new Vuex.Store({
    state: {
        isAdmin: false,
        isLoggedIn: false,
        user: {
            name: null,
        },
        local: null,
    },
    mutations: {
        setAdminStatus(state, isAdmin) {
            state.isAdmin = isAdmin;
        },
        setLoggedIn(state, isLoggedIn) {
            state.isLoggedIn = isLoggedIn;
        },
        setUser(state, user) {
            state.user = user;
        },
        setLocal(state, local) {
            state.local = local;
        },
    },
    actions: {
        restoreSession({
            commit
        }, token) {
            commit('setLoggedIn', true);
        },
        updateAdminStatus({
            commit
        }, isAdmin) {
            commit('setAdminStatus', isAdmin);
        },
        updateLoggedIn({
            commit
        }, isLoggedIn) {
            commit('setLoggedIn', isLoggedIn);
        },
        updateUser({
            commit
        }, user) {
            commit('setUser', user);
        },
        updateLocal({
            commit
        }, local) {
            commit('setLocal', local);
        },


    },
    getters: {
        isAdmin: state => state.isAdmin,
        isLoggedIn: state => state.isLoggedIn,
        user: state => state.user,
        local: state => state.local,
    }
});