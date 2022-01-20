'use strict'
const gulp = require("gulp"); // сохраняем в переменную gulp большой объект, позволяющий создавать задачи, считывать и перемещать файлы
// На примере предыдущей задачи видно, что запускать последовательно несколько тасок - долго. Хотелось бы их всех  объединить в одну задачу - "перемещение файлов". Но как это сделать, если .src считывает разные файлы? Достаточно легко, с помощью методов .series или >parallel

const del = require('del');
const plumber = require('gulp-plumber');
const concat = require('gulp-concat'); //конкатенирование файлов
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const fileinclude = require('gulp-file-include'); //ипортирование частей


const moveCSS = () => 
    gulp.src("./src/css/*.css")
    .pipe(gulp.dest("./dist/css/"))
    .pipe(browserSync.stream());

const moveIMG = () => 
    gulp.src("./src/img/**")
    .pipe(imagemin({
        progressive: true
    }))
    .pipe(gulp.dest("./dist/img/"))
    .pipe(browserSync.stream());

const concatCss = () =>
    gulp.src('./src/css/*.css')
    .pipe(concat('all.css'))
    .pipe(gulp.dest('./dist/css/'))
    .pipe(browserSync.stream());

const moveHtml = () =>
    gulp.src('./src/*.html')
    .pipe(fileinclude())
    .pipe(gulp.dest('./dist/'))
    .pipe(browserSync.stream());

function buildScss() {
    return gulp.src('./src/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass.sync({
            //outputStyle: 'compressed'
        }
        ).on('error', sass.logError))
        .pipe(concat('main.css'))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream());
};

gulp.task("moveCSS", moveCSS);
gulp.task("moveIMG", moveIMG);
gulp.task("concatCss", concatCss);
gulp.task("moveHtml", moveHtml);
//gulp.task("buildStyles", buildStyles);
gulp.task("buildScss", buildScss);

// gulp.parallel принимает название функций, которые должны выполняться
// gulp.task("moveFiles", gulp.parallel(moveCSS, moveIMG));

// Если же названия указаны в кавычках, то это - название тасок. Если эти таски не было созданы, то команда gulp moveFiles вызовет  ошибку
gulp.task("moveFiles", gulp.parallel("buildScss", "moveIMG", "moveHtml"));


gulp.task('serve', () => {
    return browserSync.init({
        server: {
            baseDir: [ 'dist' ]
        },
        port: 9000,
        open: true
    });
});


const watch = () => {
	//gulp.watch('./src/css/*.css', concatCss);
    //gulp.watch('./src/css/*.css', moveCSS);
    gulp.watch('./src/img/**', moveIMG).on('change', browserSync.reload);
    //gulp.watch('./src/sass/**/*.sass', buildStyles);
    gulp.watch('./src/scss/**/*.scss', buildScss).on('change', browserSync.reload);
    gulp.watch('./src/**/*.html', moveHtml).on('change', browserSync.reload);
}

const delDist = () => {
    return del('./dist');
}

gulp.task('default', gulp.series(delDist, 'moveFiles', gulp.parallel('serve', watch)));

