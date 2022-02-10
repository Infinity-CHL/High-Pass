const {
  src,
  dest,
  series,
  parallel,
  watch,
} = require('gulp')

const concat = require('gulp-concat')
const htmlMin = require('gulp-htmlmin')
const autoprefixer = require('gulp-autoprefixer')
const cleanCss = require('gulp-clean-css')
const sass = require('gulp-sass')(require('sass')) // +
const rename = require('gulp-rename')
const svgPrite = require('gulp-svg-sprite')
const image = require('gulp-image')
const uglify = require('gulp-uglify-es').default
const babel = require('gulp-babel')
const notify = require('gulp-notify') // +
const sourceMaps = require('gulp-sourcemaps') // +
const fileInclude = require('gulp-file-include')
const del = require('del')
// const ttf2woff = require('gulp-ttf2woff')
// const ttf2woff2 = require('gulp-ttf2woff2')
const fs = require('fs')
const webpack = require('webpack')
const webpackStream = require('webpack-stream')
const browserSync = require('browser-sync') // +


const fonts = () => {
  return src(['./src/fonts/**.woff', './src/fonts/**.woff2'])
    .pipe(dest('./app/fonts'))
}


// const cb = () => {}

// let srcFonts = './src/scss/_fonts.scss'
// let appFonts = './app/fonts'

// const fontsStyle = (done) => {
//     let file_content = fs.readFileSync(srcFonts)

//     fs.writeFile(srcFonts, '', cb)
//     fs.readdir(appFonts, function (err, items) {
//         if (items) {
//             let c_fontname
//             for (var i = 0; i < items.length; i++) {
//                 let fontname = items[i].split('.');
//                 fontname = fontname[0];
//                 if (c_fontname != fontname) {
//                     fs.appendFile(srcFonts, '@include font-face("' + fontname + '", "' + fontname + '", 400)\r\n', cb);
//                 }
//                 c_fontname = fontname;
//             }
//         }
//     })
// }

const styles = () => {
  return src('./src/scss/**/*.scss')
    .pipe(sourceMaps.init())
    .pipe(sass({
      outputStyle: 'expanded',
      includePaths: require('node-normalize-scss').includePaths
    }).on('error', notify.onError()))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(cleanCss({
      level: 2
    }))
    .pipe(sourceMaps.write('.'))
    .pipe(dest('./app/css/'))
    .pipe(browserSync.stream())

}

const htmlInclude = () => {
  return src('./src/index.html')
    .pipe(fileInclude({
      prefix: '@',
      basepath: '@file'
    }))
    .pipe(dest('./app'))
    .pipe(browserSync.stream())
}

const imgToApp = () => {
  return src(['./src/img/**/*.jpg', './src/img/**/*.png', './src/img/**/*.jpeg'])
    .pipe(dest('./app/img'))
}

const svgSprite = () => {
  return src('./src/img/svg/**.svg')
    .pipe(svgPrite({
      mode: {
        stack: {
          sprite: '../sprite.svg'
        }
      }
    }))
    .pipe(dest('./app/img'))
}

const resources = () => {
  return src('./src/resurces/**')
    .pipe(dest('./app'))
}

const clean = () => {
  return del(['app/*'])
}

const scripts = () => {
  return src('./src/js/**/*.js')
    .pipe(webpackStream({
      output: {
        filename: 'main.js'
      },
      module: {
        rules: [{
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: "defaults"
                }]
              ]
            }
          }
        }]
      }
    }))
    .pipe(sourceMaps.init())
    .pipe(uglify().on('error', notify.onError()))
    .pipe(sourceMaps.write('.'))
    .pipe(dest('./app/js'))
    .pipe(browserSync.stream())
}


const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: './app'
    }
  })

  watch('./src/scss/**/*.scss', styles)
  watch('./src/**.html', htmlInclude)
  watch('./src/img/**.jpg', imgToApp)
  watch('./src/img/**.png', imgToApp)
  watch('./src/img/**.jpeg', imgToApp)
  watch('./src/img/svg/**.svg', imgToApp)
  watch('./src/resources/**', resources)
  watch('./src/fonts/**.woff', fonts)
  watch('./src/fonts/**.woff', fonts)
  watch('./src/js/**/*.js', scripts)
}


exports.default = series(clean, parallel(htmlInclude, scripts, fonts, imgToApp, svgSprite, resources), styles, watchFiles)

const images = () => {
  return src(['./src/img/**/*.jpg', './src/img/**/*.png', './src/img/*.svg', 'src/img/**/*.jpeg', ])
    .pipe(image())
    .pipe(dest('./app/img'))
}

const stylesBuild = () => {
  return src('./src/scss/**/*.scss')
    .pipe(sass({
      outputStyle: 'expanded'
    }).on('error', notify.onError()))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(cleanCss({
      level: 2
    }))
    .pipe(dest('./app/css/'))

}

const scritpsBuild = () => {
  return src('./src/js/main.js')
    .pipe(webpackStream({
      output: {
        filename: 'main.js'
      },
      module: {
        rules: [{
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: "defaults"
                }]
              ]
            }
          }
        }]
      }
    }))
    .pipe(uglify().on('error', notify.onError()))
    .pipe(dest('./app/js'))
}

exports.build = series(clean, parallel(htmlInclude, scritpsBuild, fonts, imgToApp, svgSprite, resources), stylesBuild, images)
