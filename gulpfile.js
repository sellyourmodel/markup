var gulp = require('gulp'),
sass = require('gulp-sass'),
browserSync = require('browser-sync'),
concat = require('gulp-concat'),
uglify = require('gulp-uglifyjs'),
cssnano = require('gulp-cssnano'),
rename = require('gulp-rename'),
del = require('del'),
imagemin = require('gulp-imagemin'),
pngquant = require('imagemin-pngquant'),
cache = require('gulp-cache'),
jade = require('gulp-jade');


gulp.task('jade', function() {
return gulp.src('app/templates/**/*.jade')
.pipe(jade({
		pretty: true
	}))
.pipe(gulp.dest('dist'))
.pipe(browserSync.reload({stream: true}));
});

gulp.task('sass', function() {
	return gulp.src([
	'app/sass/**/*.sass'
])
.pipe(sass().on('error', sass.logError))
.pipe(gulp.dest('app/css'))
.pipe(browserSync.reload({stream: true}));
});

gulp.task('compile-css', function() {
	return gulp.src([
		'app/css/style.css',
		'app/css/libs.min.css',
	])
	.pipe(gulp.dest('dist/css'));
});

gulp.task('scripts', function() {
return gulp.src([
	'app/libs/jquery-1.11.0.min.js',
	'app/libs/jquery-migrate.min.js',
	'app/libs/jquery.formstyler.min.js',
	'app/libs/jquery.fancybox.pack.js',
	'app/libs/jquery.rating.js',
	'app/libs/slick.min.js'
])
.pipe(concat('libs.min.js'))
.pipe(uglify())
.pipe(gulp.dest('app/js'))
.pipe(browserSync.reload({stream: true}));
});

gulp.task('css-libs', ['sass'], function() {
return gulp.src('app/css/libs.css')
.pipe(cssnano())
.pipe(rename({suffix: '.min'}))
.pipe(gulp.dest('app/css'))
.pipe(browserSync.reload({stream: true}));
});


gulp.task('browser-sync', function() {
browserSync({
	server: {
		baseDir: 'dist'
	},
	notify: false
});
});


gulp.task('clean', function() {
return del.sync('dist');
});

gulp.task('clear', function() {
return cache.clearAll();
});


gulp.task('img', function() {
return gulp.src('app/img/**/*')
.pipe(cache(imagemin({
	interlaced: true,
	progressive: true,
	svgoPlugins: [{removeViewBox: false}],
	une: [pngquant()]
})))
.pipe(gulp.dest('dist/img'));
});

gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'], function() {
gulp.watch('app/sass/**/*.sass', ['sass', 'css-libs', 'compile-css']);
gulp.watch('app/js/**/*.js', browserSync.reload);
gulp.watch('app/templates/**/*.jade', ['jade']);
});


gulp.task('build', ['clean', 'img', 'sass', 'compile-css', 'scripts', 'jade'], function(){
var buidFonts = gulp.src('app/fonts/**/*')
.pipe(gulp.dest('dist/fonts'));

var buildJs = gulp.src('app/js/**/*')
.pipe(gulp.dest('dist/js'));

});

gulp.task('deploy-copy',  function () {
	return gulp.src([
			'dist/**/*'
	]).pipe(gulp.dest('../src/AppBundle/Resources/public'));
});

gulp.task('default', ['build', 'jade', 'watch'], browserSync.reload);