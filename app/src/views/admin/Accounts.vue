<template>
    <v-row>
        <v-col cols="12" sm="8" md="6">
            <v-btn @click="generateUsers" :disabled="users.length > 0">Générer des utilisateurs</v-btn>
        </v-col>
    </v-row>
    <v-row justify="center">
        <v-col cols="12" sm="8" md="12">
            <v-card>
                <v-card-title class="headline">
                    Nos collaborateurs ({{ users.length }})
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="search" label="Recherche" @input="searchUsers"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-data-table :headers="headers" :items="users" :items-per-page="10"
                        items-per-page-text="Éléments par page" :loading="usersLoading">
                        <template v-slot:item.isAdmin="{ item }">
                            <v-chip v-if="item.userId.isAdmin" color="purple">
                                <v-icon left class="mr-2">mdi-cog</v-icon>
                                Administrateur</v-chip>
                            <span v-else>Collaborateur</span>
                        </template>
                        <template v-slot:item.address="{ item }">
                            <span v-if="item.address">{{ item.address }}</span>

                        </template>
                        <template v-slot:item.phone="{ item }">
                            <span v-if="item.phone">{{ item.phone }}</span>
                        </template>
                        <template v-slot:no-data>
                            <span>Aucun utilisateur existant pour {{ search }}</span>
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>
  
<script>
import axios from 'axios';
import { useToast } from 'vue-toastification';
const toast = useToast();
export default {
    name: 'Administration',
    data() {
        return {
            search: '',
            usersLoading: false,
            users: [],
            headers: [
                { title: 'id', value: '_id' },
                { title: 'Nom', value: 'username' },
                { title: 'Adresse', value: 'address' },
                { title: 'Téléphone', value: 'phone' },
            ],
        };
    },
    created() {
        this.getUsers();
    },

    methods: {
        adjustHeaders(users) {
            const hasAddress = users.some(user => user.address);
            const hasPhone = users.some(user => user.phone);

            let headers = [
                { title: 'id', value: '_id' },
                { title: 'Nom', value: 'username' }
            ];

            if (hasAddress) {
                headers.push({ title: 'Adresse', value: 'address' });
            }

            if (hasPhone) {
                headers.push({ title: 'Téléphone', value: 'phone' });
            }

            return headers;
        },
        async searchUsers() {
            const jwt = localStorage.getItem("jwt");
            this.usersLoading = true;
            const searchText = this.search; // Texte brut de la recherche

            axios.get(`${process.env.VUE_APP_API_BASE_URL}/search-users`, {
                params: { search: searchText },
                headers: { Authorization: `Bearer ${jwt}` }
            })
                .then(response => {
                    this.users = response.data;
                    this.headers = this.adjustHeaders(this.users); // Ajuster les en-têtes
                    this.usersLoading = false;
                })
                .catch(error => {
                    console.error(error);
                });
        },
        async generateUsers() {
            axios.post(`${process.env.VUE_APP_API_BASE_URL}/generate-users`).then(response => {

                toast.success("Données générées");
            }).catch(error => {
                console.error(error);
                toast.error("Erreur de génération");
            });
        },
        async getUsers() {
            this.usersLoading = true;
            this.users = [];
            const jwt = localStorage.getItem("jwt");
            axios.get(`${process.env.VUE_APP_API_BASE_URL}/get-users`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                }
            }).then(response => {
                this.users = response.data;
                this.headers = this.adjustHeaders(this.users); // Ajuster les en-têtes
                this.usersLoading = false;

            }).catch(error => {
                console.error(error);

            });
        }
    },

};
</script>
<style>
.hidden {
    display: none;
}
</style>
  