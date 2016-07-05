'use strict'

export default function (router) {
    router.map({
        '/dashboard': {
            name: 'dashboard',
            component: require('./views/dashboard.vue')
        },
        '/config': {
            name: 'config',
            component: require('./views/config.vue')
        }
    })
}
