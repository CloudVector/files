"use strict";

const gulp = require('gulp');
const plugins = require('gulp-load-plugins')({ camelize: true });

gulp.task('lint', function () {
    let src = ['index.js', 'tests.js'];
    return gulp.src(src)
        .pipe(plugins.expectFile(src))
        .pipe(plugins.eslint('.eslintrc'))
        .pipe(plugins.eslint.format());
});


gulp.task('test', function () {
    let src = ['tests.js'];
    return gulp.src(src)
        //.pipe(plugins.lab('--reporter html --output temp/coverage.html'))
        .pipe(plugins.lab('--reporter console'))
        .on('error', plugins.util.log);
});


gulp.task('default', ['lint', 'test']);