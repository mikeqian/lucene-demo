'use strict';
/*global  exports, $,require,_*/
let moment = require('moment');


String.prototype.format = function () {
    var args = arguments;
    var reg = /\{(\d+)}/g;
    return this.replace(reg, function (g0, g1) {
        return args[+g1];
    });
};

Array.prototype.chain = function () {
    return _.chain(this)
};

if (!Array.prototype.find) {
    Array.prototype.find = function (fn) {
        return _.find(this, fn)
    };
}


//localStorage.setItem('flag',"test_flag/")
let prefix = localStorage.getItem('flag') || "";
let preProxy = localStorage.getItem('proxy') || "";
let fix = function (url) {
    if (!_.includes(url, "_proxy")) {
        url = preProxy + _.trimLeft(url, "/")
        if (prefix == "test_flag/") {
            url = "mc_proxy/" + _.trimLeft(url, "/")
        }
    }

    url = prefix + url; // maybe need a prefix
    return url;
};

let doAjax = function (url, data) {
    return $.ajax({
        type: "post",
        url: url,
        beforeSend: function (request) {
            request.setRequestHeader("content-type", "application/json");
        },
        dataType: "json",
        data: data
    })
};

let doAjaxSync = function (url, data) {
    return $.ajax({
        type: "post",
        url: url,
        async: false,
        beforeSend: function (request) {
            request.setRequestHeader("content-type", "application/json");
        },
        dataType: "json",
        data: data
    })
};

let ajaxGet = function (url, data) {
    return $.ajax({
        type: "get",
        url: url
    })
};
//需要代理的请求,带上proxy标识,从这里走 目前只有rc  (开发时mc也走代理)
//ex: http://localhost:4072/test_flag/mc_proxy/internal/message/query
let postProxy = function (url, data, proxy) {
    proxy = proxy || "rc";
    proxy = proxy + "_proxy/";
    return doAjax(fix(proxy + url), data)
};

let postQesProxy = function (url, data, proxy) {
    proxy = proxy || "qc";
    proxy = proxy + "_proxy/";
    return doAjax(fix(proxy + url), data)
};

//直接请求后台
let postLocal = function (url, data) {
    return doAjax(fix(url), data)
};

let postLocalSync = function (url, data) {
    return doAjaxSync(fix(url), data)
};

/**
 *
 * @return {String} YYYY-MM-DD HH:mm:ss.SSS
 */
let getJavaDate = function (str) {
    return moment(str).format("YYYY-MM-DD HH:mm:ss.SSS")
};
let getShortDateStr = function (date) {
    date = date || new Date()
    return moment(date).format("YYYY-MM-DD")
};

let addDaysWithDateStr = function (dateStr, days) {
    return moment(dateStr).add(days, 'd').format("YYYY-MM-DD");
};

let getMinTimeStr = function (dateStr) {
    dateStr = dateStr ? moment(dateStr.format("YYYY-MM-DD")) : moment().format("YYYY-MM-DD");
    return moment(dateStr).format("YYYY-MM-DD HH:mm:ss")
};
let getMaxTimeStr = function (dateStr) {
    dateStr = dateStr ? moment(dateStr.format("YYYY-MM-DD")) : moment().format("YYYY-MM-DD");
    return moment(dateStr).add(1, 'd').add(-1, 's').format("YYYY-MM-DD HH:mm:ss")
};
let getRangeDateFromEnd = function (end) {
    end = end || moment().format("YYYY-MM-DD");
    let start = addDaysWithDateStr(end, -7);
    return [getJavaDate(getMinTimeStr(start)), getJavaDate(getMinTimeStr(end))]
};

let sortDateStrArr = function (arr) {
    return arr.map(d=> {
        return {"key": d, "value": moment(d).valueOf()}
    }).sort((a, b)=>a.value - b.value).map(a=>a.key);
};
let getVueObj = function (obj) {
    return JSON.parse(JSON.stringify(obj))
};

//为图标option 加上统一的一些设置
let setOption = function (opt) {
    _.extend(opt, {
        toolbox: {
            show: true,
            feature: {
                mark: {show: true},
                dataView: {show: true, readOnly: false},
                magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        }
    });
    opt.series.forEach(item=>item.itemStyle = {
        normal: {
            label: {
                position: "top",
                show: true,
            }
        }
    });
    return opt;
};

let hasLogin = function () {
    let key = localStorage.getItem("login.key") || sessionStorage.getItem("login.key")
    return key === "sm_admin" || isAdmin()
}

let isAdmin = function () {
    let key = localStorage.getItem("login.key") || sessionStorage.getItem("login.key")
    return key === "ss_admin"
}

let getSize = function () {
    let winWidth, winHeight = 0;
//获取窗口宽度
    if (window.innerWidth)
        winWidth = window.innerWidth;
    else if ((document.body) && (document.body.clientWidth))
        winWidth = document.body.clientWidth;
//获取窗口高度
    if (window.innerHeight)
        winHeight = window.innerHeight;
    else if ((document.body) && (document.body.clientHeight))
        winHeight = document.body.clientHeight;
//通过深入Document内部对body进行检测，获取窗口大小
    if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
        winHeight = document.documentElement.clientHeight;
        winWidth = document.documentElement.clientWidth;
    }
//结果输出至两个文本框
    return [winWidth, winHeight]
}


//dashboard 饼图 需要对0-5 5-10这样的字符串进行排序,根据str返回sort
let sortRange = function (str) {
    let sortArr = "<0123456789>".split("")
    return sortArr.findIndex((ch)=> str[0] == ch)
}
var deepCopy = function (source) {
    var result = {};
    for (var key in source) {
        result[key] = typeof source[key] === 'object' ? deepCopy(source[key]) : source[key];
    }
    return result;
}

exports.getVueObj = getVueObj;
exports.setOption = setOption;
exports.postProxy = postProxy;
exports.postLocal = postLocal;
exports.postQesProxy = postQesProxy;
exports.postLocalSync = postLocalSync;
exports.getJavaDate = getJavaDate;
exports.getShortDateStr = getShortDateStr;
exports.getMinTimeStr = getMinTimeStr;
exports.getMaxTimeStr = getMaxTimeStr;
exports.getRangeDateFromEnd = getRangeDateFromEnd;
exports.ajaxGet = ajaxGet;
exports.sortDateStrArr = sortDateStrArr;
exports.hasLogin = hasLogin;
exports.getSize = getSize;
exports.sortRange = sortRange;
exports.deepCopy = deepCopy;
exports.isAdmin = isAdmin;
