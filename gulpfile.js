const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const prefix = require('gulp-autoprefixer');
const minify = require('gulp-clean-css');
const terser = require('gulp-terser');
const gulpIf = require('gulp-if');
const cssmin = require('gulp-cssmin');
const sourcemaps = require('gulp-sourcemaps');
const isProd = process.env.NODE_ENV === 'prod';
// const imagemin = require('gulp-imagemin');
// const imagewebp = import('gulp-webp');

// function compilescss(){
//   return src('src/scss/*.scss')
//     .pipe(sass())
//     .pipe(prefix())
//     .pipe(minify())
//     .pipe(dest('/dist/css'))
// }

function compilescss() {
  return src('src/scss/*.scss')
      .pipe(gulpIf(!isProd, sourcemaps.init()))
      .pipe(sass({
          includePaths: ['node_modules']
      }).on('error', sass.logError))
      .pipe(gulpIf(!isProd, sourcemaps.write()))
      .pipe(gulpIf(isProd, cssmin()))
      .pipe(dest('dist/css/'));
}

function jsmin(){
  return src('src/js/*.js')
    .pipe(terser())
    .pipe(dest('dist/js/'))
}

// function optimizeimg(){
//   return src('src/images/*.{jpg,png}')
//     .pipe(imagemin([
//       imagemin.mozjpeg({ quality:80, progressive: true }),
//       imagemin.optipng({ optimizationLevel: 2}),
//     ]))
//     .pipe(dest('/dist/images'))
// }

// function webpImage(){
//   return src('dist/images/*.{jpg,png}')
//     .pipe(imagewebp())
//     .pipe(dest('/dist/images'))
// }

function watchTask(){
  watch('src/scss/*.scss', compilescss);
  watch('src/js/*.js', jsmin);
  // watch('src/images/*.{jpg,png}', optimizeimg);
  // watch('dist/images/*.{jpg,png}', webpImage);
}

exports.default = series(compilescss, jsmin, watchTask);