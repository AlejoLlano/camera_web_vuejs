import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import * as Vue from 'vue' // in Vue 3
import axios from 'axios'
import VueAxios from 'vue-axios'

import './assets/main.css'

const app = createApp(App)

app.use(router)

app.mount('#app')

app.use(VueAxios, axios)