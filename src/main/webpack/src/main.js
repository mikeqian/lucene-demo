'use strict'

import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import validator from 'vue-validator'
import filters from './filters'
import routerMap from './routers'

import util from './libs/util'

Vue.use(VueResource);
Vue.use(VueRouter);
Vue.use(validator);

Vue.config.debug = true

$.ajaxSettings.crossDomain = true;

//实例化Vue的filter
Object.keys(filters).forEach(k => Vue.filter(k, filters[k])
);
//实例化VueRouter
let router = new VueRouter({
    hashbang: true,
    history: false,
    saveScrollPosition: true,
    transitionOnLoad: true
});

//注册全局组件
Vue.component('lte-top', require("./components/top.vue"));
Vue.component('content', require("./components/content.vue"));


//登录中间验证，页面需要登录而没有登录的情况直接跳转登录
router.beforeEach(transition => {
    if ( util.hasLogin() || transition.to.name=="home") {
        transition.next();
    } else {
        transition.redirect("/");
    }
})

let app = Vue.extend({});

routerMap(router);

router.start(app, "#app");
