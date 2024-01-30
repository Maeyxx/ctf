<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" sm="8" md="6">
                <v-card>
                    <v-card-title class="headline">
                        Informations de Mon Compte
                    </v-card-title>
                    <v-card-text>
                        <v-list v-if="dataLoaded">
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>Nom d'utilisateur</v-list-item-title>
                                    <v-list-item-subtitle>{{ userInfo.username }}</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>

                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>Prénom</v-list-item-title>
                                    <v-list-item-subtitle>{{ userInfo.firstname }}</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>

                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>Nom</v-list-item-title>
                                    <v-list-item-subtitle>{{ userInfo.lastname }}</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>

                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>Email</v-list-item-title>
                                    <v-list-item-subtitle>{{ userInfo.email }}</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>

                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>Téléphone</v-list-item-title>
                                    <v-list-item-subtitle>{{ userInfo.phone }}</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>

                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>Adresse</v-list-item-title>
                                    <v-list-item-subtitle>{{ userInfo.address }}</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>

                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>Code Postal</v-list-item-title>
                                    <v-list-item-subtitle>{{ userInfo.postalcode }}</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>

                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>Ville</v-list-item-title>
                                    <v-list-item-subtitle>{{ userInfo.city }}</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>

                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>Pays</v-list-item-title>
                                    <v-list-item-subtitle>{{ userInfo.country }}</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>

                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>Admin</v-list-item-title>
                                    <v-list-item-subtitle>{{ userInfo.isAdmin ? 'Oui' : 'Non' }}</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                        <span v-else>Aucune données</span>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
  
<script>
import axios from 'axios';
export default {
    name: 'AccountInformations',
    data() {
        return {

            dataLoaded: false,
            userInfo: {

            }
        };
    },

    computed: {
        isAdmin() {
            return this.$store.state.isAdmin;
        },

    },
    methods: {
        async fetchUserInfo() {

            if (!localStorage.getItem('jwt')) {
                return;
            }

            let jwt = localStorage.getItem('jwt')

            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/user-info`, {
                    headers: {
                        Authorization: `Bearer ${jwt}`
                    }
                });
                this.userInfo = response.data;
                this.dataLoaded = true;

            } catch (error) {
                console.error(error);
            }
        }
    },
    created() {
        this.fetchUserInfo();
    }
};
</script>
  