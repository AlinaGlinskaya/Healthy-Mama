import gulp from 'gulp';
import webserver from 'browser-sync';
import plumber from 'gulp-plumber';
import sourcemaps from 'gulp-sourcemaps';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import cleanCSS from 'gulp-clean-css';
import imagemin from 'gulp-imagemin';
import del from 'del';
import rename from 'gulp-rename';
import makeWebp from 'gulp-webp';
import sass from 'gulp-sass';
import fileinclude from 'gulp-file-include';
import webpackStream from 'webpack-stream';
import webpackConfig from './webpack.config.cjs';
import svgstore from 'gulp-svgstore';
import {htmlValidator} from 'gulp-w3c-html-validator';
import woff2 from 'gulp-ttftowoff2';

const path = {
    build: {
        html: 'assets/build',
        js: 'assets/build/js/',
        css: 'assets/build/css/',
        img: 'assets/build/img/',
        fonts: 'assets/build/fonts/',
        favicon: 'assets/build/favicon',
        video: 'assets/build/video/',
    },
    src: {
        html: 'assets/src/html/*.html',
        js: 'assets/src/js/main.js',
        style: 'assets/src/css/style.scss',
        img: 'assets/src/img/**/*.*',
        fonts: 'assets/src/fonts/**/*.*',
        favicon: 'assets/src/favicon/**',
        svg: 'assets/src/img/**/*.svg',
        sprite: 'assets/src/img/sprite/*.svg',
        video: 'assets/src/video/**/*.*',
    },
    watch: {
        html: 'assets/src/**/*.html',
        js: 'assets/src/js/**/*.js',
        css: 'assets/src/css/**/*.scss',
        img: 'assets/src/img/**/*.*',
        fonts: 'assets/srs/fonts/**/*.*',
        favicon: 'assets/src/favicon/**',
        video: 'assets/src/video/**/*.*',
    },
    dest: {
        webp: 'assets/src/img',
        sprite: 'assets/build/img'
    },
    clean: './assets/build/*',
    validate: 'assets/build/*.html'
};

const config = {
    server: {
        baseDir: './assets/build'
    },
    notify: false
};

/* задачи */

// запуск сервера
export const server = () => {
  webserver(config);
};

// html
export const htmlBuild = () => {
  return gulp.src(path.src.html)
  .pipe(plumber())
  .pipe(fileinclude({
      basepath: '@root'
  }))
  .pipe(gulp.dest(path.build.html))
  .pipe(webserver.reload({ stream: true }));
};

// стили
export const cssBuild = () => {
  return gulp.src(path.src.style)
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(sass())
  .pipe(postcss([autoprefixer()]))
  .pipe(gulp.dest(path.build.css))
  .pipe(rename({ suffix: '.min' }))
  .pipe(cleanCSS())
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest(path.build.css))
  .pipe(webserver.reload({ stream: true }));
};

// js
export const jsBuild = () => {
  return  gulp.src(path.src.js)
  .pipe(webpackStream(webpackConfig))
  .pipe(gulp.dest(path.build.js))
  .pipe(webserver.reload({ stream: true }));
};

// перенос шрифтов
export const fontsBuild = () => {
  return gulp.src(path.src.fonts)
  .pipe(gulp.dest(path.build.fonts));
};

// перенос favicon
export const faviconBuild = () => {
  return gulp.src(path.src.favicon)
  .pipe(gulp.dest(path.build.favicon));
};

// перенос картинок
export const imageBuild = () => {
  return gulp.src(path.src.img)
  .pipe(gulp.dest(path.build.img));
};

// перенос видео
export const videoBuild = () => {
  return gulp.src(path.src.video)
  .pipe(gulp.dest(path.build.video));
};

// обработка картинок
export const optimizeImg = () => {
  return gulp.src(path.src.img)
  .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.mozjpeg({quality: 75, progressive: true})
  ]))
  .pipe(gulp.dest(path.build.img));
};

// генерация webp
export const webp = () => {
  return gulp.src(path.src.img)
  .pipe(makeWebp({quality: 80}))
  .pipe(gulp.dest(path.dest.webp));
};

// оптимизация svg
export const svgo = () => {
  return gulp.src(path.src.svg)
  .pipe(imagemin([
      imagemin.svgo({
          plugins: [
              {removeViewBox: false},
              {removeRasterImages: true},
              {removeUselessStrokeAndFill: false},
          ]
      })
  ]))
};

// svg-спрайт
export const sprite = () => {
  return gulp.src(path.src.sprite)
  .pipe(svgstore({inlineSvg: true}))
  .pipe(rename('sprite-auto.svg'))
  .pipe(gulp.dest(path.dest.sprite));
};

// валидатор html
export const validate = () => {
  return gulp.src(path.validate)
      .pipe(htmlValidator.analyzer())
      .pipe(htmlValidator.reporter());
};

// конвертация шрифтов
export const fontsWoff2 = () => {
  return gulp.src('assets/src/fonts/*.ttf')
  .pipe(woff2())
  .pipe(gulp.dest('assets/src/fonts'))
}

export const fonts = gulp.series(fontsWoff2);

// удаление каталога build
export const cleanBuild = () => {
  return del(path.clean);
};

// сборка
export const build = gulp.series(
    cleanBuild,
    svgo,
    sprite,
    fontsBuild,
    imageBuild,
    faviconBuild,
    videoBuild,
    cssBuild,
    jsBuild,
    htmlBuild
  );

// запуск задач при изменении файлов
export const watch = () => {
  gulp.watch(path.watch.html, gulp.series(htmlBuild));
  gulp.watch(path.watch.css, gulp.series(cssBuild));
  gulp.watch(path.watch.js, gulp.series(jsBuild));
  gulp.watch(path.watch.img, gulp.series(imageBuild));
  gulp.watch(path.watch.fonts, gulp.series(fontsBuild));
  gulp.watch(path.watch.video, gulp.series(videoBuild));
  gulp.watch(path.watch.favicon, gulp.series(faviconBuild));
  gulp.watch(path.src.sprite, gulp.series(sprite, htmlBuild));
};

// задача по умолчанию
export const start = gulp.series(build,gulp.parallel(server, watch));
