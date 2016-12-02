const gulp = require('gulp');
const babel = require('gulp-babel');
const jsmin = require('gulp-jsmin');
const concat = require('gulp-concat');
const rename = require('gulp-rename');

gulp.task('default', ['build-dev', 'build-prod']);

gulp.task('build-prod', () => {

	return gulp.src(['./src/corrector.js', './src/*.js'])
		.pipe(concat('corrector.js'))
		.pipe(babel({
			presets: ['latest']
		}))
		.pipe(jsmin())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('./'));

});

gulp.task('build-dev', () => {

	return gulp.src(['./src/corrector.js', './src/*.js'])
		.pipe(concat('corrector.js'))
		.pipe(babel({
			presets: ['latest']
		}))
		.pipe(gulp.dest('./'));

});

gulp.task('watch', () => {

	gulp.watch('./src/*.js', ['default']);

});
