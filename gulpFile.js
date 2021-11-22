const gulp = require('gulp');
const cache = require('gulp-cached');
const sass = require('gulp-sass')(require('sass'));
const babel = require('gulp-babel');
const nodemon = require('gulp-nodemon');
const eslint = require('gulp-eslint');

const sassTask = (done) => {
    gulp.src('./scss/style.scss') //load in the file
        .pipe(cache('sass')) //cache it in memory
        .pipe(sass().on('error', sass.logError)) //change it into valid css and check for errors
        .pipe(gulp.dest('./hosted/')); //write file to hosted folder

    done();
};

const jsTask = (done) => {
    gulp.src(['./client/*.js', './client/*.jsx']) //load all files with .js or .jsx extension
        .pipe(cache('babel'))
        .pipe(babel({
            presets: ['@babel/preset-env', '@babel/preset-react']
        }))
        .pipe(gulp.dest('./hosted/'));

    done();
};

const lintTask = (done) => {
    gulp.src(['./server/*.js'])
        .pipe(eslint({ fix: true }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());

    done();
};

const watch = () => {
    gulp.watch('./scss/main.scss', sassTask); //file to watch, task to run
    gulp.watch(['./client/*.js', './client/*.jsx'], jsTask);
    
    nodemon({
        script: './server/app.js',
        ignore: ['node_modules/', 'scss/', 'client/'],
        ext: 'js html css', //extenstions to watch
    });
};

module.exports.build = gulp.parallel(sassTask, jsTask, lintTask);
module.exports.watch = watch;