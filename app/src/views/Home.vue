<template>
  <div class="main-container">
    <v-row>
      <v-col cols="12">
        <v-alert v-model="alert" border="start" variant="tonal" color="purple" title="Changelog 2.0.0">
          <v-row>
            <v-col cols="12" md="6">
              <ul>
                <li>Refonte de la page de gestion des produits</li>
                <li>Refonte de la page de gestion des ventes</li>
                <li>Refonte de la page de gestion des utilisateurs - Modification de la collection users et
                  users_informations</li>
                <li>Ajout de l'adresse et du numéro de téléphone d'un utilisateur</li>
              </ul>
            </v-col>
          </v-row>

        </v-alert>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <v-card v-if="!loadingSales || !loadingProducts" color="secondary" rounded="xl" max-width="100%" min-height="475"
          max-height="600">
          <v-card-title>Ventes total (x{{ getTotalSales() }})</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" class="text-right">
                <v-select v-model="graphicalItems" :items="[
                  { text: 'En ligne', value: 'line' },
                  { text: 'En bar', value: 'bar' },
                  { text: 'En radar', value: 'radar' },
                  { text: 'En doughnut', value: 'doughnut' },
                  { text: 'En pie', value: 'pie' },
                  { text: 'En polarArea', value: 'polarArea' },
                  { text: 'En bubble', value: 'bubble' },
                  { text: 'En scatter', value: 'scatter' },
                  { text: 'En area', value: 'area' },
                  { text: 'En mixed', value: 'mixed' },
                ]" item-title="text" item-value="value" @change="createChart">

                </v-select>
              </v-col>
            </v-row>
            <canvas id="myChart"></canvas>
          </v-card-text>
        </v-card>
        <v-skeleton-loader v-else type="card"></v-skeleton-loader>

      </v-col>
      <v-col cols="12" md="6">
        <v-card v-if="!loadingSales || !loadingProducts" color="secondary" rounded="xl" max-width="100%" min-height="475"
          max-height="600">
          <v-card-title>Chiffre d'affaire</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" class="text-right">
                <v-select v-model="graphicalItems" :items="[
                  { text: 'En ligne', value: 'line' },
                  { text: 'En bar', value: 'bar' },
                  { text: 'En radar', value: 'radar' },
                  { text: 'En doughnut', value: 'doughnut' },
                  { text: 'En pie', value: 'pie' },
                  { text: 'En polarArea', value: 'polarArea' },
                  { text: 'En bubble', value: 'bubble' },
                  { text: 'En scatter', value: 'scatter' },
                  { text: 'En area', value: 'area' },
                  { text: 'En mixed', value: 'mixed' },
                ]" item-title="text" item-value="value" @change="createChart">

                </v-select>
              </v-col>
            </v-row>
            <canvas id="myChartMoney"></canvas>
          </v-card-text>
        </v-card>
        <v-skeleton-loader v-else type="card"></v-skeleton-loader>

      </v-col>
      <v-col cols="12" md="6">
        <v-card v-if="!loadingSales || !loadingProducts" color="secondary" rounded="xl" max-width="100%" min-height="475"
          max-height="600">
          <v-card-title>Ventes total par collaborateur</v-card-title>
          <v-card-text>

            <canvas id="myChartCollaborator"></canvas>
          </v-card-text>
        </v-card>
        <v-skeleton-loader v-else type="card"></v-skeleton-loader>

      </v-col>

    </v-row>
  </div>
</template>

<style></style>

<script>
// @ is an alias to /src

import { useToast } from "vue-toastification";
const toast = useToast();
import moment from "moment";
import axios from "axios";

import Chart from 'chart.js/auto';
moment.locale("fr");

export default {
  name: "Home",
  data() {
    return {
      loadingSales: false,
      loadingProducts: false,
      myChart: null,
      graphicalItems: "line",
      sales: [],
      products: [],
      newUser: {
        username: "",
        password: "",
        isAdmin: false,
      },
      username: "",
      password: "",
      salesOrdered: [],
    };
  },

  async created() {
    this.getProducts()
    this.getSales()

  },
  mounted() {
  },
  methods: {
    createSalesByUserChart() {
      const salesByUser = this.groupSalesByUser();
      const usernames = Object.keys(salesByUser);
      const salesCounts = usernames.map(username => salesByUser[username].count);
      const totalAmounts = usernames.map(username => salesByUser[username].totalAmount);

      const ctx = document.getElementById('myChartCollaborator').getContext('2d');
      if (this.myChartCollaborator) {
        this.myChartCollaborator.destroy();
      }

      this.myChartCollaborator = new Chart(ctx, {
        type: 'bar', // Vous pouvez changer le type de graphique selon vos besoins
        data: {
          labels: usernames,
          datasets: [{
            label: 'Nombre de Ventes par Utilisateur',
            data: salesCounts,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }, {
            label: 'Chiffre d\'Affaires par Utilisateur',
            data: totalAmounts,
            backgroundColor: 'rgba(255, 206, 86, 0.5)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    },
    groupSalesByUser() {
      let salesByUser = {};
      this.sales.forEach(sale => {
        const username = sale.userId.username;
        if (!salesByUser[username]) {
          salesByUser[username] = { count: 0, totalAmount: 0 };
        }
        salesByUser[username].count++;
        salesByUser[username].totalAmount += sale.totalAmount;
      });
      return salesByUser;
    },
    getMonthlySalesCount() {
      let monthlyCount = Array(12).fill(0);
      this.sales.forEach(sale => {
        const month = moment(sale.date).month();
        monthlyCount[month]++;
      });
      return monthlyCount;
    }, getMonthlySalesValue() {
      let monthlyValue = Array(12).fill(0);
      this.sales.forEach(sale => {
        const month = moment(sale.date).month();
        monthlyValue[month] += sale.totalAmount;
      });
      return monthlyValue;
    },
    getSalesMonth() {
      if (!this.sales || this.sales.length === 0) {
        return; // Sortie anticipée si aucune donnée de vente
      }

      let monthlySales = [];
      for (let i = 0; i < 12; i++) {
        let total = 0;
        this.sales.forEach(sale => {
          if (moment(sale.date).month() === i) {
            total += sale.totalAmount; // Utiliser totalAmount au lieu de amount
          }
        });
        monthlySales.push(total);
      }

      return monthlySales;
    },
    generateMonth() {
      const month = [];
      for (let i = 0; i < 12; i++) {
        month.push(moment().subtract(i, 'months').format('MMMM'));
      }
      return month;
    },
    createChart() {

      const ctx = document.getElementById('myChart').getContext('2d');
      if (this.myChart) {
        this.myChart.destroy(); // Détruire l'ancien graphique si existant
      }

      const monthlySalesCount = this.getMonthlySalesCount();
      const monthlySalesValue = this.getMonthlySalesValue();

      this.myChart = new Chart(ctx, {
        type: this.graphicalItems,
        data: {
          labels: this.generateMonth(),
          datasets: [
            {
              label: "Nombre de Ventes",
              data: monthlySalesCount,
              backgroundColor: "rgba(54, 162, 235, 0.5)",
              borderColor: "#36A2EB",
              borderWidth: 1
            },

          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });

      const ctxMoney = document.getElementById('myChartMoney').getContext('2d');

      this.myChartSaleMoney = new Chart(ctxMoney, {
        type: 'bar',
        data: {
          labels: this.generateMonth(),
          datasets: [
            {
              label: "Chiffre d'affaire",
              data: monthlySalesValue,
              backgroundColor: "rgba(255, 99, 132, 0.5)",
              borderColor: "#FF6384",
              borderWidth: 1

            },

          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });

    },
    getTotalSales() {
      return this.sales.length;
    },
    getTotalAmountSales() {
      let total = 0;
      this.sales.forEach(sale => {
        total += sale.amount;
      });
      return total;
    },
    getTotalAmountSales() {
      return this.sales.reduce((total, sale) => total + sale.totalAmount, 0);
    },
    getTotalAmount() {
      let total = 0;
      this.products.forEach(product => {
        total += product.price;
      });
      return total;
    },
    async getSales() {
      this.loadingSales = true;
      this.sales = [];
      axios
        .get(`${process.env.VUE_APP_API_BASE_URL}/sales`)
        .then(response => {
          const salesData = response.data;
          this.sales = Object.values(salesData);
          this.sales.forEach(sale => {
            sale.totalAmount = sale.amount * sale.productId.price;
          });
          this.salesOrdered = this.getSalesMonth();

        }).finally(() => {
          this.createChart();
          this.createSalesByUserChart();
          this.loadingSales = false;
        })
        .catch(error => {
          console.error(error);
        });
    },
    async getProducts() {
      this.loadingProducts = true;
      this.products = []
      axios.get(`${process.env.VUE_APP_API_BASE_URL}/products`).then((response) => {

        this.products = response.data;
        this.loadingProducts = false;
      }).catch((error) => {
        console.error(error);
      });
    }

  },

  computed: {

    isAdmin() {
      return this.$store.getters.isAdmin;
    }
  }

};
</script>
