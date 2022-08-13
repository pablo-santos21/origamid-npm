// adicionando modulos instalados
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;

// Funçao para compilar o SASS e adicionar os prefixos
function compilaSass() {
  return gulp
    .src('css/scss/*.scss')
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(
      autoprefixer({
        cascade: false,
      }),
    )
    .pipe(gulp.dest('css/'))
    .pipe(browserSync.stream());
}

exports.compilaSass = compilaSass;

//função para juntar os JS
function gulpConcat() {
  return gulp
    .src('js/main/*.js')
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('js/'))
    .pipe(browserSync.stream());
}

exports.gulpConcat = gulpConcat;

// JS Plugins externos
function pluginJS() {
  return gulp
    .src([
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/moment/min/moment.min.js',
      'js/plugins/*.js',
    ])
    .pipe(concat('plugins.js'))
    .pipe(gulp.dest('js/'))
    .pipe(browserSync.stream());
}

exports.pluginJS = pluginJS;

// Função para iniciar o browser
function browser() {
  browserSync.init({
    server: {
      baseDir: './',
    },
  });
}

exports.browser = browser;

// função que fica aguardando as mudanças
function watch() {
  gulp.watch('css/scss/*.scss', compilaSass);
  // depois da , pode pôr tarefas com gulp.series('tarefa1', 'tarefa2')
  // atualiza a pagina depois de mudar algo no scss ou gulp

  // aguarda mudanças nos JS para juntar no main.js
  gulp.watch('js/main/*.js', gulpConcat);

  // aguarda mudanças nos arquivos externos para juntar nos plugins.js
  gulp.watch('js/plugins/*.js', pluginJS);

  gulp.watch(['*.html']).on('change', browserSync.reload);
  // atualizando o navegador depois de mudar os htmls da pagina
}

// tarefa que fica observando o codigo
exports.watch = watch;

// tarefa que fica observando para dar reload na pagina ao salvamento
exports.default = gulp.parallel(
  watch,
  browser,
  compilaSass,
  gulpConcat,
  pluginJS,
);
