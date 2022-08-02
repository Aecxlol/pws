'use strict';

const gulp        = require('gulp');
const sass        = require('gulp-sass')(require('sass'));
const postcss     = require('gulp-postcss');
const cssnano     = require('cssnano');
const browserSync = require('browser-sync').create();
const sourcemaps  = require('gulp-sourcemaps');
const concat      = require('gulp-concat');
// Avoid bug
const plumber     = require('gulp-plumber');
// Minify .js file
const uglify      = require('gulp-uglify');
// For js compatibility
const babel       = require('gulp-babel');

const scssFolder = 'static/scss/**/**/*.scss';
const jsFolder   = 'static/js/**/*.js';

// .pipe() is similar to .then() in js
// it means that .pipe() waits for src() to finish and then
// does what it has to do

// SCSS TASK
let scssTask = () => {
    return gulp.src(scssFolder, {sourceMap: true})
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(concat('main.css'))
        .pipe(postcss([cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/css', {sourceMap: '.'}));
}

// JS TASK
let jsTask = () => {
    return gulp.src(jsFolder)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest('public/js'));
}

// BROWSERSYNC RELOAD
let browserSyncReload = (cb) => {
    browserSync.reload();
    cb();
}

//WATCH TASK
let watchTask = () => {
    gulp.watch(scssFolder, gulp.series(scssTask, browserSyncReload));
    gulp.watch(jsFolder, gulp.series(jsTask, browserSyncReload));
}

exports.default = gulp.series(
    scssTask,
    jsTask,
    watchTask
);