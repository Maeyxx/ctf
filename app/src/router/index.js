import {
  createRouter,
  createWebHashHistory
} from "vue-router";
import HomeView from "../views/Home.vue";
import AccountInfo from '../views/account/AccountInformations.vue'
import Login from '../views/authentication/Login.vue'
import store from '../store/store.js'
import Administration from '../views/admin/Administration.vue'
import Accounts from '../views/admin/Accounts.vue'
import Register from '../views/authentication/Register.vue'
import Sale from '../views/sales/Sale.vue'
import Product from '../views/sales/Product.vue'
import {
  useToast
} from 'vue-toastification'
const toast = useToast()

const routes = [{
    path: "/",
    name: "Home",
    component: HomeView,
    meta: {
      requiresAuth: true
    }
  },
  {

    path: '/login',
    name: 'Login',
    component: Login

  },
  {
    path: '/ventes',
    name: 'Sale',
    component: Sale,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/produits',
    name: 'Product',
    component: Product,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  }, {
    path: '/admin',
    name: 'Administration',
    component: Administration,
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/users',
    name: 'Accounts',
    component: Accounts,
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/mon-compte',
    name: 'AccountInfo',
    component: AccountInfo,
    meta: {
      requiresAuth: true
    }
  }


];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  //? THIS CODE IS NOT SECURE BETTER UNDER IT
  // const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  // const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
  // const isUserLoggedIn = store.getters.isLoggedIn;
  // const isAdmin = store.getters.isAdmin; 
  // console.log(isAdmin)

  // if (requiresAuth && !isUserLoggedIn) {
  //   next('/login');
  // } else if (requiresAdmin && !isAdmin) {
  //   next('/'); 
  // } else {
  //   next();
  // }

  //! THIS CODE IS SECURE
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
  const isUserLoggedIn = store.getters.isLoggedIn;
  let isAdmin = null
  const local = store.getters.local

  if (localStorage.getItem(local) == 1) {
    isAdmin = true
  }

  if (requiresAuth && !isUserLoggedIn) {
    next('/login');
  } else if (requiresAdmin && !isAdmin) {
    toast.error('Vous n\'avez pas les droits pour accéder à cette page', {
      timeout: 3000,
      position: 'bottom-right'
    })
    next('/');
  } else {
    next();
  }

});

export default router;