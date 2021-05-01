const fs = require('fs');
const gulp = require('gulp');
const pug = require('gulp-pug');
const less = require('gulp-less');

const getTemplateData = (path) =>
  JSON.parse(fs.readFileSync(path));

gulp.task('pug-to-html', (done) => {
  const data = getTemplateData('src/data.json');
  const INCLUDED_FILES = 'src/templates/**/*.pug';
  const EXCLUDED_FILES = '!src/templates/includes/*.pug';

  for (let lang in data) {
    console.log(`Compiling for language: ${lang}`);
    gulp.src([INCLUDED_FILES, EXCLUDED_FILES])
      .pipe(pug({
        doctype: 'html',
        pretty: true,
        data: data[lang],
      }))
      .pipe(gulp.dest(`build/${lang}/`));
  }
  done()
});

gulp.task('less-to-css', () => {
  return gulp.src('src/styles.less')
      .pipe(less())
      .pipe(gulp.dest('build/'));
});

gulp.task('copy-images', () => {
  return gulp.src('src/images/**/*.*')
    .pipe(gulp.dest('build/images/'));
});

gulp.task('watch-files', () => {
  gulp.watch('src/templates/**/*.pug', gulp.series('pug-to-html'));
  gulp.watch('src/styles.less', gulp.series('less-to-css'));
  gulp.watch('src/images/**/**.*', gulp.series('copy-images'));
});
