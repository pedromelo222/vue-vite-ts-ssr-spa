import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)


console.log('here')

const initialState = window.__INITIAL_STATE__
if (initialState) {
  console.log(initialState)
}

app.use(createPinia())
app.use(router)
app.mount('#app')
