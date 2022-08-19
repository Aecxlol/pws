'use strict';

const gulp         = require('gulp');
const sass         = require('gulp-sass')(require('sass'));
const postcss      = require('gulp-postcss');
const cssnano      = require('gulp-cssnano');
const browserSync  = require('browser-sync').create();
const concat       = require('gulp-concat');
// Avoids bug
const plumber      = require('gulp-plumber');
// Minifies .js file
const uglify       = require('gulp-uglify');
// For js compatibility
const babel        = require('gulp-babel');
const autoPrefixer = require('autoprefixer');


const scssFolder = 'static/scss/**/**/*.scss';
const jsFolder   = 'static/js/**/*.js';

/** INFOS **/
// /?\ .pipe() is similar to .then() in js /?\
// /?\ it means that .pipe() waits for src() to finish and then /?\
// /?\ does what it has to do /?\

//===================================================//
//====================CONFIG=========================//
//===================================================//
let cfg = {
    destinationFolder: 'public',
    proxy: '127.0.0.1:8000'
}

let workFiles = {
    css: {
        src: 'static/scss',
        destinationFolder: cfg.destinationFolder + '/css',
        destinationFileName: 'main.css'
    },

    js: {
        src: 'static/js',
        destinationFolder: cfg.destinationFolder + '/js',
        destinationFileName: 'main.js'
    },
}
//===================================================//
//=====================TASKS=========================//
//===================================================//
/**
 * SCSS TASK
 * @returns {*}
 */
let scssTask = () => {

    return gulp.src(scssFolder, {sourcemaps: true})
        .pipe(sass())
        .pipe(postcss([autoPrefixer()]))
        .pipe(concat(workFiles.css.destinationFileName))
        .pipe(cssnano())
        .pipe(gulp.dest(workFiles.css.destinationFolder, {sourcemaps: '.'}));
}

/**
 * JS TASK
 * @returns {*}
 */
let jsTask = () => {
    return gulp.src(jsFolder, {sourcemaps: true})
        .pipe(plumber())
        .pipe(babel())
        .pipe(concat(workFiles.js.destinationFileName))
        .pipe(uglify())
        .pipe(gulp.dest(workFiles.js.destinationFolder, {sourcemaps: '.'}));
}

/**
 * @param done
 */
let browsersyncServe = (done) => {
    browserSync.init({
        proxy: cfg.proxy
    });
    // callback function  that signifies the function is complete
    done();
}

/**
 * BROWSER SYNC RELOAD
 * @param done
 */
let browserSyncReload = (done) => {
    browserSync.reload();
    done();
}

/**
 * WATCH TASK
 */
let watchTask = () => {
    gulp.watch(scssFolder, gulp.series(scssTask, browserSyncReload));
    gulp.watch(jsFolder, gulp.series(jsTask, browserSyncReload));
}

/**
 * DEFAULT TASK
 */
exports.default = gulp.series(
    scssTask,
    jsTask,
    // browsersyncServe,
    watchTask
);