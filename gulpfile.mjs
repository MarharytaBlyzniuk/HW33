// Підключаємо модулі за допомогою імпорту
import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import * as sass from 'sass';  // Додаємо компілятор Sass
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import rename from 'gulp-rename';
import browserSync from 'browser-sync';

const sassCompiler = gulpSass(sass); // Вказуємо компілятор для gulp-sass

// Шляхи до файлів
const paths = {
    scss: './src/scss/*.scss',
    html: './src/*.html'
};

// Компіляція SCSS у CSS
gulp.task('sass', function() {
    return gulp.src(paths.scss)
        .pipe(sassCompiler().on('error', sassCompiler.logError)) // Використовуємо sassCompiler
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./dist/css'))
        .pipe(cleanCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream());
});
// Перенесення HTML файлів
gulp.task('html', function() {
    return gulp.src(paths.html)
        .pipe(gulp.dest('./dist')) // Переносимо HTML файли у папку dist
        .pipe(browserSync.stream()); // Додаємо оновлення після компіляції HTML
});

// Оновлення сторінки в реальному часі
gulp.task('serve', function() {
    browserSync.init({
        server: './dist'
    });

    gulp.watch(paths.scss, gulp.series('html','sass')); // Спостерігає за змінами в SCSS
    gulp.watch(paths.html).on('change', browserSync.reload); // Оновлює сторінку при зміні HTML
});

// За замовчуванням виконуємо компіляцію та сервер
gulp.task('default', gulp.series('html','sass', 'serve'));
