var gulp = require('gulp'),
  //autoprefixer = require('gulp-autoprefixer'),
  minifycss = require('gulp-minify-css'),
  // jshint = require('gulp-jshint'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  notify = require('gulp-notify');
  clean = require('gulp-clean');

//版本控制
rev = require('gulp-rev');
revCollector = require('gulp-rev-collector');

//css压缩

gulp.task('styles', ['cleancss'], function() {
 
  return gulp.src('src/css/*.css')
    .pipe(concat('main.css'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(minifycss())
    .pipe(rev())
    .pipe(gulp.dest('release/css'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('rev/css'))
    .pipe(notify({
      message: 'css编译压缩拷贝完成!'
    }));
});
// js脚本
gulp.task('scripts', ['cleanjs'], function() {
  return gulp.src('src/js/*.js')
    // .pipe(jshint('.jshintrc'))
    // .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(rename({
      suffix: '.min'
    }))
    //压缩js代码，正式发布的时候启用。。
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('release/js'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('rev/js'))
    .pipe(notify({
      message: '脚本编译拷贝完成!'
    }));
});

//html模版文件原样拷过去
gulp.task('tpl', function() {
  return gulp.src('src/tpl/*.html')
    .pipe(gulp.dest('../server/static/tpl'))
    .pipe(notify({
      message: 'tpl模版已拷贝完成!'
    }));
});

//img文件原样拷过去
gulp.task('img', function() {
  return gulp.src('src/img/*')
    .pipe(gulp.dest('release/img'))
    .pipe(notify({
      message: 'img已拷贝完成!'
    }));
});

//rev版本好控制
gulp.task('rev', function() {
  return gulp.src(['rev/**/*.json', 'src/index.html'])
    .pipe(revCollector({
      replaceReved: true
    }))
    .pipe(rename({
      basename:'index',
      extname:'.tpl'
    }))
    .pipe(gulp.dest('../server/views'))
    .pipe(notify({
      message: '版本号修改完成!'
    }));
});
// 清空目的样式、js
gulp.task('cleancss', function() {
  return gulp.src(['release/css/*.css'], {read: false})
    .pipe(clean({force: true}));
});
// 清空目的样式、js
gulp.task('cleanjs', function() {
  return gulp.src(['release/js/*.js'], {read: false})
    .pipe(clean({force: true}));
});
//清除所有
gulp.task('cleanall', function() {
  return gulp.src(['release/css/*.css','release/js/*.js'], {read: false})
    .pipe(clean({force: true}));
});
//监控文件是否改变
gulp.task('watch', function() {

  // 看守所有.css档
  gulp.watch('src/css/*.css', ['styles']);

  // 看守所有.js档
  gulp.watch('src/js/*.js', ['scripts']);

  //看守tpl/文件变化
  gulp.watch('src/tpl/*.html', ['tpl']);

  //看守index文件变化
  gulp.watch('src/index.html', ['rev']);

  //看守index文件变化
  gulp.watch('src/img/*', ['img']);
  //看守生成后的文件,执行版本修改
  gulp.watch('release/js/*.js', ['rev']);
  //看守生成后的文件,执行版本修改
  gulp.watch('release/css/*.css', ['rev']);

   
});

//默认执行
gulp.task('default', ['cleanall'],function() {
  gulp.start('styles', 'scripts', 'tpl', 'index', 'img','rev');
});