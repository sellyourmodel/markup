const gulp = require('gulp'),
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

gulp
	.task('jade', () => gulp.src('app/templates/**/*.jade')
		.pipe(jade({ pretty: true }))
		.pipe(gulp.dest('dist'))
		.pipe(browserSync.reload({ stream: true }))
	)
	.task('sass', () => gulp.src('app/sass/**/*.sass')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({ stream: true }))
	)
	.task('compile-css', () => gulp.src([
			'app/css/style.css',
			'app/css/libs.min.css',
		])
		.pipe(gulp.dest('dist/css'))
	)
	.task('compile-js', () => gulp.src('app/js/**/*')
		.pipe(gulp.dest('dist/js'))
		.pipe(browserSync.reload({ stream: true }))
	)
	.task('scripts', () => gulp.src([
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
		.pipe(browserSync.reload({ stream: true }))
	)
	.task('css-libs', ['sass'], () => gulp.src('app/css/libs.css')
		.pipe(cssnano())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({ stream: true }))
	)
	.task('browser-sync', () => browserSync({
			server: {
				baseDir: 'dist'
			},
			notify: false
		})
	)
	.task('clean', () => del.sync('dist'))
	.task('clear', () => cache.clearAll())
	.task('img', () => gulp.src('app/img/**/*')
		.pipe(cache(imagemin({
			interlaced: true,
			progressive: true,
			svgoPlugins: [{ removeViewBox: false }],
			une: [pngquant()]
		})))
		.pipe(gulp.dest('dist/img'))
	)
	.task('watch', ['browser-sync', 'css-libs', 'scripts'], () => {
		gulp.watch('app/sass/**/*.sass', ['sass', 'css-libs', 'compile-css']);
		gulp.watch('app/js/**/*.js', ['compile-js']);
		gulp.watch('app/templates/**/*.jade', ['jade']);
	})
	.task('build', ['clean', 'img', 'sass', 'compile-css', 'compile-js', 'scripts', 'jade'], () => gulp.src('app/fonts/**/*')
		.pipe(gulp.dest('dist/fonts'))
	)
	.task('deploy-copy', () => gulp.src('dist/**/*').pipe(gulp.dest('../src/AppBundle/Resources/public')))
	.task('default', ['build', 'jade', 'watch'], browserSync.reload);