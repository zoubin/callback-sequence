import gulp from 'gulp'

gulp.task('clean', () => {
  let del = require('del')
  return del('build')
})

gulp.task('scripts', ['clean'], () => {
  let babel = require('gulp-babel')
  return gulp.src(['lib/*.js', 'bin/*.js'], { base: process.cwd() })
    .pipe(babel())
    .pipe(gulp.dest('build'))
})

gulp.task('docs', ['clean'], () => {
  return gulp.src(['README.md', 'LICENSE'])
    .pipe(gulp.dest('build'))
})

gulp.task('package', ['clean'], () => {
  let editor = require('gulp-json-editor')
  return gulp.src('./package.json')
    .pipe(editor( (p) => {
      p.main = 'lib/main'
      return p
    }))
    .pipe(gulp.dest('build'))
})

gulp.task('build', ['scripts', 'package', 'docs'])

gulp.task('lint', () => {
  let eslint = require('gulp-eslint')
  return gulp.src(['*.js', 'bin/*.js', 'lib/*.js', 'test/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})

gulp.task('test', ['lint'], function test() {
  require('task-tape')
  let tape = require('gulp-tape')
  let reporter = require('tap-spec')
  return gulp.src('test/*.js')
    .pipe(tape({
      reporter: reporter(),
    }))
})
gulp.task('default', ['test'])

