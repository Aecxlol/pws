'use strict';

const gulp         = require('gulp');
const sass         = require('gulp-sass')(require('sass'));
const postcss      = require('gulp-postcss');
const cssnano      = require('gulp-cssnano');
const browserSync  = require('browser-sync').create();
const sourcemaps   = require('gulp-sourcemaps');
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
          mainScssFile: 'app.scss',
          destinationFolder: 'public'
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

    return gulp.src(scssFolder, {sourceMap: true})
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(concat(workFiles.css.destinationFileName))
        .pipe(postcss([autoPrefixer()]))
        .pipe(cssnano())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(workFiles.css.destinationFolder, {sourceMap: '.'}));
}

/**
 * JS TASK
 * @returns {*}
 */
let jsTask = () => {
    return gulp.src(jsFolder)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(concat(workFiles.js.destinationFileName))
        .pipe(uglify())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(workFiles.js.destinationFolder));
}

/**
 * BROWSER SYNC RELOAD
 * @param cb
 */
let browserSyncReload = (cb) => {
    browserSync.reload();
    cb();
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
    watchTask
);