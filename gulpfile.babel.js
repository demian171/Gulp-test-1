'use strict'
const gulp = require("gulp"); // сохраняем в переменную gulp большой объект, позволяющий создавать задачи, считывать и перемещать файлы
// На примере предыдущей задачи видно, что запускать последовательно несколько тасок - долго. Хотелось бы их всех  объединить в одну задачу - "перемещение файлов". Но как это сделать, если .src считывает разные файлы? Достаточно легко, с помощью методов .series или >parallel

const del = require('del');
const plumber = require('gulp-plumber');
var concat = require('gulp-concat'); //конкатенирование файлов



const moveCSS = () => 
    gulp.src("./src/css/*.css"). 
    pipe(gulp.dest("./dist/css/"));

const moveIMG = () => 
    gulp.src("./src/image/**/*.jpg"). 
    pipe(gulp.dest("./dist/img/"));

const concatCss = () =>
    gulp.src('./src/css/*.css')
    .pipe(concat('all.css'))
    .pipe(gulp.dest('./dist/css/'));

const concatHtml = () =>
    gulp.src('./src/css/*.css')
        .pipe(concat('all.css'))
        .pipe(gulp.dest('./dist/css/'));


gulp.task("moveCSS", moveCSS);
gulp.task("moveIMG", moveIMG);
gulp.task("concatCss", concatCss);
gulp.task("concatHtml", concatHtml);

// gulp.parallel принимает название функций, которые должны выполняться
// gulp.task("moveFiles", gulp.parallel(moveCSS, moveIMG));

// Если же названия указаны в кавычках, то это - название тасок. Если эти таски не было созданы, то команда gulp moveFiles вызовет  ошибку
gulp.task("moveFiles", gulp.parallel("concatCss", "moveIMG"));
//gulp.task("moveFiles2", gulp.parallel(moveCSS, moveIMG));
/*
gulp.task("moveFiles2", ()=>{
    moveCSS();
    moveIMG();
});
*/
const watch = () => {
	gulp.watch('./src/css/*.css', concatCss);
    //gulp.watch('./src/css/*.css', moveCSS);
    gulp.watch('./src/image/**/*.jpg', moveIMG);
}

const delDist = () => {
    return del('./dist');
}

gulp.task('default', gulp.series(delDist, 'moveFiles', watch));

