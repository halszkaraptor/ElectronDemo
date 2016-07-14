var gulp         = require('gulp');
var jetpack      = require('fs-jetpack');
var usemin       = require('gulp-usemin');
var uglify       = require('gulp-uglify');

var projectDir = jetpack;
var srcDir     = projectDir.cwd('./app');
var destDir    = projectDir.cwd('./build');
var distDir    = projectDir.cwd('./dist');

// get the dependencies
var gulp        = require('gulp'),
    childProcess  = require('child_process'),
    electron      = require('electron-prebuilt');
var exec = require('child_process').exec;

// create the gulp task
gulp.task('run', function () {
    childProcess.spawn(electron, ['./app'], { stdio: 'inherit' });
});

// create the gulp task for debug
gulp.task('flyswatter', function () {
    childProcess.spawn(electron, ['--debug=7821','./app'], { stdio: 'inherit' });
});

gulp.task('clean', function (callback) {
    destDir.dirAsync('.', { empty: true });
    return distDir.dirAsync('.', { empty: true });
});

gulp.task('copy', ['clean'], function () {
    return projectDir.copyAsync('app', destDir.path(), {
        overwrite: true, matching: [
            './node_modules/**/*',
            '*.html',
            '*.css',
            'main.js',
            'package.json'
        ]
    });
});

gulp.task('build', ['copy'], function () {
    return gulp.src('./app/index.html')
        .pipe(usemin({
            js: [uglify()]
        }))
        .pipe(gulp.dest('build/'));
});

gulp.task('package', ['build'], function () {
    exec('npm run dist', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
    });
});