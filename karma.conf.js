module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    reporters: ['spec'],
    browsers: ['PhantomJS'],
    files: [
      'bower_components/jquery/dist/jquery.js',
      'assets/js/builder/controls.js',
      'assets/js/builder/util.js',
      'tests/**/*.js'
    ]
  });
};