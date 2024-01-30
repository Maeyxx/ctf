<template>
  <v-app>
    <v-dialog v-model="dialogDisconnect" persistent max-width="400">
      <v-card>
        <v-card-title class="text-h5">Confirmer la déconnexion</v-card-title>
        <v-card-text>Voulez-vous vraiment vous déconnecter ?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogDisconnect = false">Annuler</v-btn>
          <v-btn color="red darken-1" text @click="confirmDisconnect">Se déconnecter</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-app-bar absolute="" color="secondary-darken-1" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" v-if="isLoggedIn"></v-app-bar-nav-icon>
      <v-icon color="purple" class="mr-n2">mdi-water</v-icon>
      <v-toolbar-title class="">{{ APP_NAME }}</v-toolbar-title>

      <v-spacer></v-spacer>
      <span v-if="isLoggedIn && !!user" class="mr-2">Welcome, <span class="purple--text">{{ user.username }}</span></span>

      <v-btn v-if="isAdmin" icon :to="{ name: 'Administration' }" color="purple" class="mr-2">
        <v-icon>mdi-cog</v-icon>
      </v-btn>
      <v-btn icon v-if="isLoggedIn" :to="{ name: 'AccountInfo' }" class="mr-2">
        <v-icon>mdi-account</v-icon>
      </v-btn>
      <v-btn v-if="!isLoggedIn" :to="{ name: 'Login' }" class="mr-2">Se connecter</v-btn>
      <v-btn v-else @click="disconnect" color="error">Se déconnecter</v-btn>
      <v-btn v-if="!isLoggedIn" color="purple" :to="{ name: 'Register' }">S'inscrire</v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" absolute="" color="secondary" v-if="isLoggedIn">
      <v-list density="compact">
        <v-list-subheader>MENU</v-list-subheader>

        <v-list-item v-for="(item, i) in items" :key="i" :value="item" color="purple" :to="item.to">
          <template v-slot:prepend>
            <v-icon :icon="item.icon"></v-icon>
          </template>

          <v-list-item-title v-text="item.title"></v-list-item-title>
        </v-list-item>
      </v-list>

    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>

    <v-footer app color="secondary-darken-1" dark>
      <span class="white--text">&copy; coded w/ 💖 by {{ APP_AUTHOR }} {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>
<script>

import config from "@/configurator/config";
import { useTheme } from 'vuetify'

import {
  useToast
} from 'vue-toastification';
const toast = useToast();

import { jwtDecode } from 'jwt-decode';
import {
  faker
} from '@faker-js/faker';



export default {
  name: "App",
  setup() {
    const theme = useTheme()
    document.title = config.APP_NAME

    return {
      theme,
      toggleTheme: () => theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
    }
  },
  data() {
    return {
      dialogDisconnect: false,
      items: [
        { title: 'Accueil', icon: 'mdi-view-dashboard', to: '/' },
        { title: 'Mes collaborateurs', icon: 'mdi-account-supervisor', to: '/users' },
        { title: 'Mes ventes', icon: 'mdi-shopping', to: '/ventes' },
        { title: 'Mes produits', icon: 'mdi-cards', to: '/produits' },
        { title: 'Mon compte', icon: 'mdi-account', to: '/mon-compte' },
      ],
      drawer: true,
      APP_NAME: config.APP_NAME,
      APP_VERSION: config.APP_VERSION,
      APP_AUTHOR: config.APP_AUTHOR,
    }
  },
  computed: {

  },
  methods: {
    disconnect() {
      this.dialogDisconnect = true;
    },
    confirmDisconnect() {
      this.$store.commit('setLoggedIn', false);
      this.$store.dispatch('updateAdminStatus', false);

      localStorage.removeItem("jwt");
      localStorage.clear();

      //delete jwt cookie

      this.$router.push({ name: "Login" });

      this.dialogDisconnect = false;
      toast.success("Vous êtes déconnecté", {
        timeout: 2000,
        position: "bottom-right"
      });
    },

  },
  computed: {
    isLoggedIn() {
      return this.$store.state.isLoggedIn;
    },
    isAdmin() {

      return this.$store.state.isAdmin;
    },

    user() {
      return this.$store.state.user;
    }

  },
  created() {

    const local = faker.string.alpha()
    this.$store.dispatch('updateLocal', local)
    // localStorage.setItem(local, 0)

    if (!localStorage.getItem("jwt")) {
      return;
    }
    const jwt = localStorage.getItem("jwt");
    let decoded = jwtDecode(jwt);
    if (jwt) {
      this.$store.dispatch('restoreSession', jwt);
      this.$store.dispatch('updateAdminStatus', decoded.isAdmin);
      this.$store.dispatch('updateUser', {
        username: decoded.username,
      });

    }
    else {
      this.isLoggedIn = false;
    }


  },


};
</script>

