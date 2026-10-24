import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import PageA from './PageA.vue'
import PageB from './PageB.vue'
import './style.css'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [{ path: '/', redirect: '/a' }, { path: '/a', component: PageA }, { path: '/b', component: PageB }],
})
createApp(App).use(router).mount('#app')
