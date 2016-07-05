'use strict'

export default function (router) {
    router.map({
        '/': { //首页
            name: 'home',
            component: require('./views/home.vue')
        },
        '/product': {
            name: 'product',
            component: require('./views/product.vue')
        },
        /* 404路由 */
        //'*': {
        //    component: require('./views/index.vue')
        //},
        '/message': {
            name: 'message',
            component: require('./views/message.vue')
        },
        '/request': {
            name: 'request',
            component: require('./views/request.vue')
        },
        '/matchRequest': {
            name: 'matchRequest',
            component: require('./views/matchRequest.vue')
        },
        '/nodetail': {
            name: 'nodetail',
            component: require('./views/nodetail.vue')
        },
        '/search': {
            name: 'search',
            component: require('./views/iframes/search.vue')
        },
        '/searchIndex': {
            name: 'searchIndex',
            component: require('./views/iframes/searchIndex.vue')
        },
        '/queryRequest': {
            name: 'queryRequest',
            component: require('./views/queryRequest.vue')
        },
        '/querySelfProduct': {
            name: 'querySelfProduct',
            component: require('./views/querySelfProduct.vue')
        },
        '/queryUnionProduct': {
            name: 'queryUnionProduct',
            component: require('./views/queryUnionProduct.vue')
        },
        '/queryPurchaseSelfProduct': {
            name: 'queryPurchaseSelfProduct',
            component: require('./views/queryPurchaseSelfProduct.vue')
        },
        '/queryPurchaseUnionProduct': {
            name: 'queryPurchaseUnionProduct',
            component: require('./views/queryPurchaseUnionProduct.vue')
        },
        '/searchRequest': {
            name: 'searchRequest',
            component: require('./views/searchRequest.vue')
        },
        '/exception': {
            name: 'exception',
            component: require('./views/exception.vue')
        },
        '/alert': {
            name: 'alert',
            component: require('./views/alert.vue')
        },
        '/view/:url': {
            name: 'view',
            component: require('./views/view.vue')
        },
        '/job': {
            name: 'job',
            component: require('./views/job.vue')
        },
        '/dashboard': {
            name: 'dashboard',
            component: require('./views/dashboard.vue')
        },
        '/charts': {
            component: {
                template: ' <content><router-view ></router-view></content> '
            },
            subRoutes: {
                '/search': {
                    component: require('./views/charts/c_search.vue')
                },
                '/pro': {
                    component: require('./views/charts/c_pro.vue')
                },
                '/trace': {
                    component: require('./views/charts/c_trace.vue')
                },
                '/stock': {
                    component: require('./views/charts/c_stock.vue')
                },
            },
        }
    })
}
