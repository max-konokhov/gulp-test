const { src, dest, series, watch } = require('gulp');
const concat = require('gulp-concat');
const htmlMin = require('gulp-htmlmin');
const autoprefixes = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
// const image = require('gulp-image'); Нужно подключить через IMPORT
const svgSprite = require('gulp-svg-sprite');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify-es').default;
const del = require('del');
const notify = require('gulp-notify');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();

// import gulp from 'gulp';
// import image from 'gulp-image';
// import concat from 'gulp-concat';
// import autoprefixes from 'gulp-autoprefixer';
// import htmlMin from 'gulp-htmlmin';


const clean = () => {
  return del('build')
};

const resources = () => {
  return src('src/resources/**')
    .pipe(dest('build'))
};

const styles = () => {
  return src('src/styles/**/*.css')
    .pipe(sourcemaps.init())
    .pipe(concat('main.css'))
    .pipe(autoprefixes({
      cascade: false
    }))
    .pipe(cleanCSS({
      level: 2
    }))
    .pipe(sourcemaps.write())
    .pipe(dest('build'))
    .pipe(browserSync.stream())
};

const htmlMinify = () => {
  return src('src/**/*.html')
    .pipe(htmlMin({
      collapseWhitespace: true,
    }))
    .pipe(dest('build'))
    .pipe(browserSync.stream())
};

const svgSprites = () => {
  return src('src/images/svg/**/*.svg')
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: '../sprite.svg'
        }
      }
    }))
    .pipe(dest('build/images'))
}


  // ТАSК IMAGES - НЕ РАБОТАЕТ

// const images = () => {
//   return src([
//       'src/images/**/*.jpg',
//       'src/images/**/*.png',
//       'src/images/*.svg',
//       'src/images/**/*.jpeg'
//     ])
//     .pipe(image())
//     .pipe(dest('build/images'))
// }


// import gulp from 'gulp';
// import image from 'gulp-image';

// gulp.task('image', function () {
//   gulp.src([
//     'src/images/**/*.jpg',
//     'src/images/**/*.png',
//     'src/images/*.svg',
//     'src/images/**/*.jpeg'
//   ])
//     .pipe(image())
//     .pipe(dest('build/images'))
// });

// gulp.task('default', ['image']);


const scripts = () => {
  return src([
      'src/js/components/**/*.js',
      'src/js/main.js'
    ])
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(concat('app.js'))
    .pipe(uglify({
      toplevel: true
    }).on('error', notify.onError()))
    .pipe(sourcemaps.write())
    .pipe(dest('build'))
    .pipe(browserSync.stream())
}


const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: 'build'
    }
  })
};



watch('src/**/*.html', htmlMinify);
watch('src/styles/**/*.css', styles);
watch('src/images/svg/**/*.svg', svgSprites);
watch('src/js/**/*.js', scripts);
watch('src/resources/**', resources);



exports.clean = clean;
exports.styles = styles;
exports.htmlMinify = htmlMinify;
exports.scripts = scripts;
// exports.images = images;
exports.default = series(clean, resources, htmlMinify, scripts, styles, svgSprites, watchFiles);