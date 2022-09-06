import gulp from "gulp";
import { deleteAsync } from "del";
import dartSass from "sass";
import gulpSass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import ts from "gulp-typescript";
import uglify from "gulp-uglify";
import htmlMin from "gulp-htmlmin";
import connect from "gulp-connect";
import replace from "gulp-replace";
import concat from "gulp-concat";
import { icons } from "./src/icons.js";

const sass = gulpSass(dartSass);

let isDev = false;

gulp.task("clean", function () {
  return deleteAsync(["./dist/*/"]);
});

gulp.task("styles", function () {
  return gulp
    .src("./src/styles/*.scss")
    .pipe(
      sass(isDev ? {} : { outputStyle: "compressed" }).on(
        "error",
        sass.logError
      )
    )
    .pipe(autoprefixer())
    .pipe(concat("index.css"))
    .pipe(gulp.dest("./dist/styles"))
    .pipe(connect.reload());
});

gulp.task("html", function () {
  const s = gulp.src("./src/index.html").pipe(
    replace(/<!-- icon=(.+) -->/g, (match, p1) => {
      const item = icons[p1];
      return item
        ? `<a href="${item.link}" title="${item.title}" target="_blank">${item.icon}</a>`
        : match;
    })
  );
  return (isDev ? s : s.pipe(htmlMin()))
    .pipe(gulp.dest("./dist"))
    .pipe(connect.reload());
});

gulp.task("ts", function () {
  const s = gulp.src("./src/*.ts").pipe(ts());
  return (isDev ? s : s.pipe(uglify()))
    .pipe(concat("index.js"))
    .pipe(gulp.dest("./dist"))
    .pipe(connect.reload());
});

gulp.task("assets", function () {
  return gulp.src(["./src/assets/**/*"]).pipe(gulp.dest("./dist/assets"));
});

gulp.task("robots", function () {
  return gulp.src(["./robots.txt"]).pipe(gulp.dest("./dist")).pipe(connect.reload());
});

gulp.task("build", gulp.series("clean", "assets", "styles", "ts", "html", "robots"));
gulp.task("default", gulp.series("build"));

gulp.task("setDev", function (cb) {
  isDev = true;
  cb();
});

gulp.task(
  "watch",
  gulp.series("setDev", function (cb) {
    gulp.watch("./src/index.html", gulp.series("html"));
    gulp.watch("./src/styles/**/*.scss", gulp.series("styles"));
    gulp.watch("./src/**/*.ts", gulp.series("ts"));
    connect.server(
      {
        root: "dist",
        livereload: true,
        port: 8080,
      },
      function () {
        this.server.on("close", cb);
      }
    );
    cb();
  })
);

gulp.task("dev", gulp.series("setDev", "build", "watch"));
