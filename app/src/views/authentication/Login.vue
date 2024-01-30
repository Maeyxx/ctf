<template>
    <div class="main-container">
        <v-card>
            <v-card-title>
                <span class="headline"> <v-icon color="purple">mdi-water</v-icon>Connectez-vous à {{ APP_NAME
                }}
                </span>
            </v-card-title>
            <v-card-subtitle>Connectez-vous pour accéder à l'application</v-card-subtitle>
            <v-card-text>
                <v-form @keyup.enter="submitForm" ref="form">
                    <v-container>
                        <v-row class="justify-center">
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field v-model="username" label="Nom d'utilisateur" color="purple"
                                    :rules="[rules.required]"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row class="justify-center">
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field v-model="password" label="Mot de passe" color="purple"
                                    :rules="[rules.required]"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="purple" @click="submitForm">Se connecter</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

  
<script>
// @ is an alias to /src

import moment from "moment";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { createCookie } from "@/functions/functions";
import { useToast } from "vue-toastification";
import config from "@/configurator/config";
const toast = useToast();
moment.locale("fr");

export default {
    name: "Login",
    created() {
    },
    methods: {
        async submitForm() {
            const { valid } = await this.$refs.form.validate();

            if (valid) {
                this.login(this.username, this.password);
            }
        },

        login(username, password) {
            axios.post(`${process.env.VUE_APP_API_BASE_URL}/login`, {
                username: username,
                password: password,
            }).then(response => {
                //create jwt cookie

                const jwt = response.data.accessToken;

                localStorage.setItem("jwt", jwt);

                //decode jwt
                let decoded = jwtDecode(jwt);


                if (jwt) {
                    this.$store.dispatch('updateAdminStatus', decoded.isAdmin);
                    this.$store.commit('setLoggedIn', true, decoded.isAdmin);

                    if (decoded.isAdmin) {
                        localStorage.setItem(this.$store.getters.local, 1);
                    }
                    else {
                        localStorage.setItem(this.$store.getters.local, 0);
                    }

                    this.$store.dispatch('updateUser',
                        {
                            username: decoded.username,
                        })
                }

                this.$router.push({ name: "Home" });

                toast.success("Connexion réussie", {
                    timeout: 2000,
                    position: "bottom-right"
                });
            }).catch(error => {
                console.error(error);
                toast.error("Erreur de connexion", {
                    timeout: 2000,
                    position: "bottom-right"
                });
            });
        },
    },
    data() {
        return {
            APP_NAME: config.APP_NAME,
            rules: {
                required: value => !!value || 'Ce champ est requis.',
            },
            newUser: {
                username: "",
                password: "",
                isAdmin: false,
            },
            username: null,
            password: null,
            isAdmin: false,
        };
    },

    computed: {
        isAdmin() {
            return this.$store.getters.isAdmin;
        }
    }

};
</script>
  