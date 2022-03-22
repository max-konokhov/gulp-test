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



// Функция удаления папки dev
const cleanDev = () => {
  return del('dev')
};

// Функция удаления папки build
const cleanBuild = () => {
  return del('build')
};


// Функция копирования ресурсов в dev (для Build - не нужно)
const resources = () => {
  return src('src/resources/**')
    .pipe(dest('dev'))
};

// Функция преобразования стилей DEV:
const stylesDev = () => {
  return src('src/styles/**/*.css')
    .pipe(sourcemaps.init())       //инициализация sourcemap
    .pipe(concat('main.css'))      //конкатенация файлов стилей в один
    .pipe(sourcemaps.write())      //запись sourcemap в конечный файл стилей.
    .pipe(dest('dev'))             //копирование файла стилей в папку сборки build
    .pipe(browserSync.stream())    //получение измененений файлов для BS
};

// Функция преобразования стилей Build:
const stylesBuild = () => {
  return src('src/styles/**/*.css')
    .pipe(concat('main.css'))      //конкатенация файлов стилей в один
    .pipe(autoprefixes({           //автопрефиксер конечного файла стилей
      cascade: false
    }))
    .pipe(cleanCSS({               //очистка конечного файла стилей
      level: 2
    }))
    .pipe(dest('build'))           //копирование файла стилей в папку сборки dev
    .pipe(browserSync.stream())    //получение измененений файлов для BS
};



//Копирование html-файлов в исходном виде для DEV:
const htmlCopyDev = () => {
  return src('src/**/*.html')
    .pipe(dest('dev'))            //копирование
    .pipe(browserSync.stream())   //получение измененений файлов для BS
};

//Функция минификации html-файлов для build:
const htmlMinifyBuild = () => {
  return src('src/**/*.html')
    .pipe(htmlMin({               //минификация
      collapseWhitespace: true,
    }))
    .pipe(dest('build'))          //копирование
    .pipe(browserSync.stream())   //получение измененений файлов для BS
};


//Функция сборщика единого svg-спрайта для dev:
const svgSpritesDev = () => {
  return src('src/images/svg/**/*.svg')
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: '../sprite.svg'
        }
      }
    }))
    .pipe(dest('dev/images'))
}

//Функция сборщика единого svg-спрайта для build:
const svgSpritesBuild = () => {
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

// Функция преобразования скриптов для Dev:
const scriptsDev = () => {
  return src([
      'src/js/components/**/*.js',
      'src/js/main.js'
    ])
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(sourcemaps.write())
    .pipe(dest('dev'))
    .pipe(browserSync.stream())
}

// Функция преобразования скриптов для Build:
const scriptsBuild = () => {
  return src([
      'src/js/components/**/*.js',
      'src/js/main.js'
    ])
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(concat('app.js'))
    .pipe(uglify({
      toplevel: true
    }).on('error', notify.onError()))
    
    .pipe(dest('build'))
    .pipe(browserSync.stream())
}

// ФУНКЦИЯ IMAGES - НЕ РАБОТАЕТ

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

const watchFilesDev = () => {
  browserSync.init({
    server: {
      baseDir: 'dev'
    }
  })
};

const watchFilesBuild = () => {
  browserSync.init({
    server: {
      baseDir: 'build'
    }
  })
};


watch('src/**/*.html', htmlCopyDev);
watch('src/**/*.html', htmlMinifyBuild);

watch('src/styles/**/*.css', stylesDev);
watch('src/styles/**/*.css', stylesBuild);

watch('src/images/svg/**/*.svg', svgSpritesDev);
watch('src/images/svg/**/*.svg', svgSpritesBuild);

watch('src/js/**/*.js', scriptsDev);
watch('src/js/**/*.js', scriptsBuild);

watch('src/resources/**', resources);
watch('src/**/*.html', htmlCopyDev);


// ТАСКИ
exports.cleanDev = cleanDev;
exports.cleanBuild = cleanBuild;
exports.stylesDev = stylesDev;
exports.stylesBuild = stylesBuild;
exports.resources = resources;
exports.htmlCopyDev = htmlCopyDev;
exports.htmlMinifyBuild = htmlMinifyBuild;
exports.svgSpritesDev = svgSpritesDev;
exports.svgSpritesBuild = svgSpritesBuild;
exports.scriptsDev = scriptsDev;
exports.scriptsBuild = scriptsBuild;
// exports.images = images;

// Единый ТАСК
exports.default = series(cleanDev, cleanBuild, resources, htmlCopyDev, htmlMinifyBuild, scriptsDev, stylesDev, scriptsBuild, stylesBuild, svgSpritesDev, svgSpritesBuild, watchFilesDev, watchFilesBuild);

// Dev ТАСК
//  ФУНКЦИИ ДЛЯ СБОРКИ "--DEV--"

// 1. Удаление папки dev
// 2. Копирование ресурсов в папку dev
// 3  Копирования html-файлов без преобразования
// 4. Копирование скриптов без преобразования (только конкатенация в один) + добавление карты источников
// 5. Копирование стилей без преобразования (только конкатенация в один) + добавление карты источников
// 6. Объединение всех спрайтов в один и его копирование в сборку dev
// 7. Запуск функции слежения за изменениями
exports.dev = series(cleanDev, resources, htmlCopyDev, scriptsDev, stylesDev, svgSpritesDev, watchFilesDev,);


//Build ТАСК
//  ФУНКЦИИ ДЛЯ СБОРКИ "--BUILD--"

// 1. Удаление папки BUILD
// 2. Копирование ресурсов в папку build
// 3  Минификация html- файлов и копирование в папку build
// 4. Преобразование скриптов (конкатенация, сжатие, обфускация), копирование в сборку БЕЗ КАРТ ИСТОЧНИКОВ 
// 5. Преобразование стилей (конкатеннация, автопрефиксер, очищение), копирование в сборку БЕЗ КАРТ ИСТОЧНИКОВ
// 6. Объединение всех спрайтов в один и его копирование в сборку
// 7. Запуск функции слежения за изменениями
exports.build = series( cleanBuild, htmlMinifyBuild, scriptsBuild, stylesBuild, svgSpritesBuild, watchFilesBuild);





