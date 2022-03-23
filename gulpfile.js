"use strict"
// gulpプラグインを読み込み
const { src, dest, watch } = require("gulp");
// Sassをコンパイルするプラグインを読み込みnpm
const sass = require('gulp-sass')(require('sass'));
const postcss = require("gulp-postcss");
const sassGlob = require("gulp-sass-glob");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const autoprefixer = require("autoprefixer");
const cleancss = require("gulp-clean-css");
const rename = require("gulp-rename");

// コンパイル
const compileSass = () =>
  // style.scssファイルを取得(お好きなフォルダを指定してください。)
  src("Sass/style.scss")
    // sassのエラー時でもwatchを止めない
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    // Sassのコンパイルを実行
    // Sassの@importのlobを有効化
    .pipe(sassGlob())
    .pipe(
      // コンパイル後のCSSを展開
      sass({
        outputStyle: "expanded"
      }))
    // prefixを付与
    .pipe(postcss([autoprefixer({
      cascade: false
    })
    ]))
    // 圧縮前のcssを出力
    .pipe(dest("./assets/css/"))

    // CSS圧縮の実行
    .pipe(cleancss())
    // ファイル名変換
    .pipe(rename({
      extname:'.min.css'
    }))
    // sassフォルダー以下に保存(お好きなフォ ルダを指定してください)
    .pipe(dest("./assets/css/"));

/**
 * sassフォルダ内の全てのファイルを監視し、変更があったらSassをコンパイルします
 * お好きなフォルダに変更して構いません。
 */
const watchSassFiles = () => watch("Sass/**/*.scss", compileSass);

// npx gulpというコマンドを実行時、watchSassFilesが実行されるようにします
exports.default = watchSassFiles;
