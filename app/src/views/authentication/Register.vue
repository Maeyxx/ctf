<template>
    <div class="main-container">
        <v-card>
            <v-card-title>
                <span class="headline">Login</span>
            </v-card-title>
            <v-card-subtitle>Connectez-vous pour accéder à l'application</v-card-subtitle>
            <v-card-text>
                <v-form @keyup.enter="submitForm" ref="form">
                    <v-container>
                        <v-row>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field label="Nom d'utilisateur" v-model="newUser.username"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field label="Mot de passe" v-model="newUser.password"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field label="Prénom" v-model="newUser.firstname"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field label="Nom" v-model="newUser.lastname"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field label="Email" v-model="newUser.email"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field label="Téléphone" v-model="newUser.phone"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field label="Adresse" v-model="newUser.address"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field label="Code Postal" v-model="newUser.postalcode"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field label="Ville" v-model="newUser.city"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field label="Pays" v-model="newUser.country"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-btn color="primary" @click="fakerApp" variant="outlined"><v-icon left
                        class="mr-2">mdi-history</v-icon>Générer</v-btn>

                <v-spacer></v-spacer>
                <v-btn color="purple" @click="submitForm()">Se connecter</v-btn>
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

import { faker } from '@faker-js/faker';
const toast = useToast();
moment.locale("fr");

export default {
    name: "Login",
    created() {
        this.fakerApp();
    },
    methods: {
        fakerApp() {

            this.newUser = {
                firstname: faker.person.firstName(),
                lastname: faker.person.lastName(),
                email: faker.internet.email({
                    provider: 'lyceedelasalle.fr'
                }),
                phone: faker.phone.number(),
                address: faker.location.streetAddress(),
                postalcode: faker.location.zipCode(),
                city: faker.location.city(),
                country: faker.location.country(),
            }
        },
        submitForm() {
            if (this.$refs.form.validate()) {

                this.register(this.newUser);
            }
        },
        register() {
            axios.post(`${process.env.VUE_APP_API_BASE_URL}/register`, {
                username: this.newUser.username,
                password: this.newUser.password,
                firstname: this.newUser.firstname,
                lastname: this.newUser.lastname,
                email: this.newUser.email,
                phone: this.newUser.phone,
                address: this.newUser.address,
                postalcode: this.newUser.postalcode,
                city: this.newUser.city,
                country: this.newUser.country,
            }).then(response => {
                //create jwt cookie

                // const local = 
                // localStorage.setItem(this.$store.getters.local, 0)

                //redirect to home
                this.$router.push({ name: "Login" });

                toast.success("Votre compte a été créé, vous pouvez désormais vous connecter", {
                    timeout: 6000,
                    position: "bottom-right"
                });
            }).catch(error => {
                console.error(error);
                toast.error("Impossible de créer votre compte !", {
                    timeout: 2000,
                    position: "bottom-right"
                });
            });
        }
    },
    data() {
        return {
            rules: {
                required: value => !!value || 'Valeur requis.',
                min: v => v.length >= 8 || 'Min 8 characters',
            },
            newUser: {
                username: "",
                password: "",
                isAdmin: false,
            },
            username: "",
            password: "",
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
  