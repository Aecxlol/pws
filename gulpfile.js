'use strict';

const {src, dest, watch, series} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const scssFolder = 'static/scss/*.scss';

// .pipe() is similar to .then() in js
// it means that .pipe() waits for src() to finish and then
// does what it has to do

// SCSS TASK
function scssTask() {
    return src(scssFolder, { sourceMap : true })
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(concat('main.css'))
        .pipe(postcss([cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('public/css', { sourceMap : '.' }));
}

// BROWSERSYNC RELOAD
function browserSyncReload(cb) {
    browserSync.reload();
    cb();
}

//WATCH TASK
function watchTask() {
    watch('*.html.twig', browserSyncReload);
    watch(scssFolder, series(scssTask, browserSyncReload));
}

exports.default = series(
    scssTask,
    watchTask
);