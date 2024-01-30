<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="2">
                <v-dialog width="700" v-model="dialogAddUser">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" text="Créer un compte"> </v-btn>
                    </template>

                    <template v-slot:default="dialog">
                        <v-card>
                            <v-card-title>Ajout d'un compte</v-card-title>
                            <v-card-text>
                                <v-form>
                                    <v-row>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field label="Nom d'utilisateur"
                                                v-model="newUser.username"></v-text-field>
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
                                    <v-checkbox label="Administrateur ?" v-model="newUser.isAdmin"></v-checkbox>

                                </v-form>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn text @click="dialog.isActive = false">Annuler</v-btn>
                                <v-btn color="primary" text @click="addUser">Ajouter</v-btn>
                            </v-card-actions>
                        </v-card>
                    </template>
                </v-dialog>
            </v-col>
            <v-col md="2">
                <v-btn text="Génerer data product" @click="generateDataProducts"> </v-btn>
                <v-btn text="Génerer data sale" @click="generateDataSales"> </v-btn>

            </v-col>

        </v-row>
        <v-row justify="center">
            <v-col cols="12" sm="8" md="6">
                <v-card>
                    <v-card-title class="headline">
                        Informations de Mon Compte
                    </v-card-title>

                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
  
<script>
import axios from 'axios';
import { useToast } from 'vue-toastification';
const toast = useToast();
export default {
    name: 'Administration',
    data() {
        return {
            dialogAddUser: false,
            dataLoaded: false,
            newUser: {
                username: '',
                password: '',
                firstname: '',
                lastname: '',
                email: '',
                phone: '',
                address: '',
                postalcode: '',
                city: '',
                country: '',
                isAdmin: false,
            },
            userInfo: {

            }
        };
    },
    methods: {
        generateDataProducts() {
            axios.post(`${process.env.VUE_APP_API_BASE_URL}/generate-products`).then(response => {

                toast.success("Données générées");
            }).catch(error => {
                console.error(error);
                toast.error("Erreur de génération");
            });
        },
        generateDataSales() {
            axios.post(`${process.env.VUE_APP_API_BASE_URL}/generate-data`).then(response => {

                toast.success("Données générées");
            }).catch(error => {
                console.error(error);
                toast.error("Erreur de génération");
            });
        },
        addUser() {
            axios.post(`${process.env.VUE_APP_API_BASE_URL}/add-user`, {
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
                isAdmin: this.newUser.isAdmin,

            }).then(response => {

                this.dialogAddUser = false
                toast.success("Utilisateur ajouté");
            }).catch(error => {
                console.error(error);
                toast.error("Erreur d'ajout");
            });
        },
    },

};
</script>
  