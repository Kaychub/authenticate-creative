import Vue from 'vue'
import VueRouter from 'vue-router'
import Create from '../views/Create.vue'
import Palette from '../views/Palette.vue'
import SelectPalette from '../views/select-palette.vue'
import Edit from '../views/Edit.vue'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/create',
    name: 'Create',
    component: Create
  },
  {
    path: '/palette',
    name: 'Palette',
    component: Palette
  },
  {
    path: '/',
    name: 'Select-Palette',
    component: SelectPalette,
  },
  {
    path: '/edit/:paletteID/:swatchID',
    name: 'Edit',
    component: Edit,
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
