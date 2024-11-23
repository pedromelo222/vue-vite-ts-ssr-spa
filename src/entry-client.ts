import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

// __INITIAL_STATE__
declare global {
  interface Window {
    __INITIAL_STATE__?: {
      serverTime: number;
      tenant: string
      other: string
    }
  }
}

const initialState = window.__INITIAL_STATE__
if (initialState) {
    console.log(initialState)
}

app.use(createPinia())
app.use(router)
app.mount('#app')
