<template>
    <v-row justify="center">
        <v-col cols="12" sm="8" md="12">
            <v-card>
                <v-card-title class="headline">Nos ventes</v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" md="3">
                            <v-card color="purple" v-if="!salesLoading">
                                <v-card-title class="headline">Ventes total (en nombre)</v-card-title>
                                <v-divider></v-divider>
                                <v-card-text class="text-h3 my-5">{{ sales.length }}</v-card-text>
                            </v-card>
                            <v-skeleton-loader v-else type="card"></v-skeleton-loader>

                        </v-col>
                        <v-col cols="12" md="4">
                            <v-card color="purple" v-if="!salesLoading">
                                <v-card-title class="headline">Ventes total (en €)</v-card-title>
                                <v-divider></v-divider>
                                <v-card-text class="text-h3 my-5">{{ getAmountPrice() }}€</v-card-text>
                            </v-card>
                            <v-skeleton-loader v-else type="card"></v-skeleton-loader>

                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-text>
                    <v-data-table :headers="headers" :items="sales" :items-per-page="10"
                        items-per-page-text="Éléments par page" :loading="salesLoading">
                        <template v-slot:item.productId.price="{ item }">
                            {{ item.productId.price }} €
                        </template>

                        <template v-slot:item.total="{ item }">
                            {{ getPrice(item.amount * item.productId.price) }} €
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
    name: 'Sale',
    data() {
        return {
            salesLoading: false,
            sales: [],
            headers: [
                { title: 'Nom', value: 'productId.name' },
                { title: 'Lot', value: 'amount' },
                { title: 'Prix unitaire', value: 'productId.price' },
                { title: 'Total', value: 'total', sortable: true },
            ],
        };
    },
    created() {
        this.getSales();
    },
    methods: {
        getPrice(price) {
            return price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        },
        getAmountPrice() {
            let amount = 0;
            this.sales.forEach(sale => {
                amount += sale.amount * sale.productId.price;
            });
            return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        },
        async getSales() {
            this.sales = [];
            this.salesLoading = true;
            axios
                .get(`${process.env.VUE_APP_API_BASE_URL}/sales`)
                .then(response => {
                    const salesData = response.data;
                    this.sales = Object.values(salesData);
                    this.sales.forEach(sale => {
                        sale.totalAmount = sale.amount * sale.productId.price;
                    });

                    this.salesLoading = false;
                })
                .catch(error => {
                    console.error(error);
                });
        },
    }

};
</script>
  