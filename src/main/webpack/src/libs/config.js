'use strict'
/*global  exports, $,require,_*/

const configFactory = {
    test: {
        name: "test",
        search_url: "http://10.0.6.183:8082/search",
        search_index_url:"http://10.0.8.238:8080/index.html"
    },
    uat: {
        name: "uat",
        search_url: "http://10.0.5.173:8082/search",
        search_index_url:"http://10.0.16.105:8080/index.html"
    },
    pro: {
        name: "pro",
        search_url: "http://10.80.10.173:8082/Search",
        search_index_url:"http://10.90.8.113:8080/sales.engine.searchdata.api/index.html"
    }
}

let key = localStorage.getItem("configKey") || "test"
let configJson = localStorage.getItem("configJson")

let config = configJson ? JSON.parse(configJson) : configFactory[key];

export {config, key,configFactory}

