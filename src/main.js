// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyLoad from "vue-lazyload"
import infiniteScroll from "vue-infinite-scroll"
import Vuex from "vuex"
import { currency } from "./util/currency"

import './assets/css/base.css'
import './assets/css/checkout.css'
import './assets/css/product.css'
Vue.config.productionTip = false

Vue.use(Vuex)
Vue.use(VueLazyLoad, {
    loading: "/static/loading-svg/loading-bars.svg"
})
Vue.filter("currency", currency)
Vue.use(infiniteScroll)


const store = new Vuex.Store({
    state: {
        nickName: "", //用户名
        cartCount: 0 //购物车数量
    },
    mutations: {
        //改变用户信息
        updateUserInfo(state, nickName) {
            state.nickName = nickName
        },
        //改变购物车数量
        updateCartCount(state, cartCount) {
            state.cartCount += cartCount
        },
        //初始化购物车
        initCartCount(state, cartCount) {
            state.cartCount = cartCount
        }
    }
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})