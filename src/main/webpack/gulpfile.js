'use strict'

var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    webpack = require('webpack'),
    rename = require('gulp-rename'),
    path = require('path'),
    fs = require('fs'),
    del = require('del');

var config = require('./webpack.config');

/**
 *  清理生产目录文件
 */
gulp.task('clean', function (cb) {
    del(['./dist/*.js', './dist/*.css', './dist/*.map']).then(
        cb())
});

/**
 *  执行webpack打包
 */
gulp.task('webpack', ['clean'], function (cb) {
    webpack(config, cb)
});

/**
 *  压缩css文件
 */
gulp.task('style', function () {
    console.log
    gulp.src('./dist/style.css')
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('dist'));

});

/**
 *  压缩js文件
 */
gulp.task('script', ['webpack'], function (cb) {
    gulp.src('./dist/*.js')
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist'))
        .on('end', cb);
});

gulp.task('default', ['script'], function (cb) {
    let source = path.resolve("./dist");
    let target = path.resolve("../webapp/dist");
    del([target + "/*"]).then(()=> {
        gulp.src([source + "/*"])
            .pipe(gulp.dest(target))
            .on('end', ()=>{
                console.log('dist')
                cb()
            });
    });
});

