/* eslint-disable */

import {
    createApp
} from "vue";
import App from "./App.vue";
import router from "./router";
import PrimeVue from 'primevue/config';
import "primevue/resources/themes/lara-light-indigo/theme.css";
import "primevue/resources/primevue.min.css";
import 'primeicons/primeicons.css';
import VueConfetti from 'vue-confetti'
import 'primeflex/primeflex.css';
// import '@/assets/theme.css'
import '@/assets/theme4.css';
import ToastService from 'primevue/toastservice';
import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import {
    library
} from '@fortawesome/fontawesome-svg-core'
import {
    fas
} from '@fortawesome/free-solid-svg-icons'
import {
    FontAwesomeIcon
} from '@fortawesome/vue-fontawesome'

library.add(fas)

import Vuex from 'vuex'
import store from "./store/store";

import {
    createVuetify
} from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'dark',
        themes: {
            dark: {
                dark: true,
                variables: {}, // ✅ this property is required to avoid Vuetify crash

                colors: {
                    //green: '#00ff00' // cannot use primary color names here, so use a custom color name (such as 'greenish')
                    greenish: '#03DAC5',

                    // Workaround: Custom colors seem to erase default colors, so we need to include the default colors (of `light` or `dark` theme)
                    background: '#36393e',
                    surface: '#212121',
                    primary: '#CF6679',
                    'primary-darken-1': '#3700B3',
                    secondary: '#282b30',
                    'secondary-darken-1': '#282b30',
                    error: '#CF6679',
                    info: '#2196F3',
                    success: '#4CAF50',
                    warning: '#FB8C00',
                    purple: '#7289da'
                },
            },
            light: {
                dark: false,
                variables: {}, // ✅ this property is required to avoid Vuetify crash

                colors: {
                    //green: '#00ff00' // cannot use primary color names here, so use a custom color name (such as 'greenish')
                    greenish: '#03DAC5',

                    // Workaround: Custom colors seem to erase default colors, so we need to include the default colors (of `light` or `dark` theme)
                    background: '#111928',
                    surface: '#212121',
                    primary: '#00ff00',
                    'primary-darken-1': '#3700B3',
                    secondary: '#03DAC5',
                    'secondary-darken-1': '#03DAC5',
                    error: '#CF6679',
                    info: '#2196F3',
                    success: '#4CAF50',
                    warning: '#FB8C00'
                },
            }
        }
    }
})

const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(PrimeVue);
app.use(router);
app.use(ToastService);
app.use(vuetify);
app.use(Toast, {
    maxToasts: 2,

})
app.use(Vuex);
app.use(store);
app.use(VueConfetti)
app.mount("#app");