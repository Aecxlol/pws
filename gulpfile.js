'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
// const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');

function buildStyles() {
    return gulp.src('./static/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.init())
        // .pipe(concat('main.scss'))
        .pipe(sourcemaps.write())
        // .pipe(uglify())
        .pipe(gulp.dest('./public/css'));
}

exports.default = buildStyles;