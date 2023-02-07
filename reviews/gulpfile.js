const gulp = require("gulp");
const inlineCss = require("gulp-inline-css");
const merge = require("merge-stream");

const emailFolders = ["c", "b", "csr"];

gulp.task("inline", function() {
  const tasks = emailFolders.map(folder => {
    return gulp
      .src(`public/mail/${folder}/*.html`)
      .pipe(
        inlineCss({
          applyStyleTags: true,
          applyLinkTags: true,
          removeStyleTags: true,
          removeLinkTags: true
        })
      )
      .pipe(gulp.dest(`public/buildEmail/${folder}`));
  });
  return merge(tasks);
});
