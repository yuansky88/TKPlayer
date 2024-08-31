const gulp = require("gulp");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");
const cleanCSS = require("gulp-clean-css");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");

function buildJs() {
	return gulp
		.src("src/**/*.js")
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(rename({ suffix: ".min" }))
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest("dist/js"));
}

function buildCss() {
	const processors = [autoprefixer()];
	return gulp
		.src("src/**/*.css")
		.pipe(postcss(processors))
		.pipe(cleanCSS({ compatibility: "ie8" }))
		.pipe(rename({ suffix: ".min" }))
		.pipe(gulp.dest("dist/css"));
}

exports.default = gulp.parallel(buildJs, buildCss);
