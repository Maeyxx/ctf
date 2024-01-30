<template>
    <v-row justify="center">
        <v-col cols="12" sm="8" md="12">
            <v-card>
                <v-card-title class="headline">
                    Nos produits
                </v-card-title>
                <v-card-text>
                    <v-data-table :headers="headers" :items="products" :items-per-page="10"
                        items-per-page-text="Éléments par page" :loading="productsLoading">
                        <template v-slot:item.logo="{ item }">
                            <v-avatar size="64" class="my-5">
                                <v-img :src="item.logo"></v-img>
                            </v-avatar>
                        </template>
                        <template v-slot:item.price="{ item }">
                            {{ getPrice(item.price) }} €
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
import {
    faker
} from '@faker-js/faker';


export default {
    name: 'Product',
    data() {
        return {
            productsLoading: false,
            products: [],
            headers: [
                { title: 'Logo', value: 'logo' },
                { title: 'Nom', value: 'name' },
                { title: 'Prix unitaire', value: 'price' },
                { title: 'description', value: 'description' },
            ],
        };
    },
    created() {
        this.getProducts();
    },
    methods: {
        getPrice(price) {
            return price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        },
        async getProducts() {
            this.products = [];
            axios
                .get(`${process.env.VUE_APP_API_BASE_URL}/products`)
                .then(response => {
                    const productsData = response.data;
                    this.products = Object.values(productsData);
                    this.products.forEach(product => {
                        product.logo = faker.image.urlLoremFlickr({ category: 'business' })
                    });
                })
                .catch(error => {
                    console.error(error);
                });
        },
    },
}

</script>
  