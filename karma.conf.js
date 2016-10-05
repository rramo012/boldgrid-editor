module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    reporters: ['spec'],
    browsers: ['PhantomJS'],
    files: [
      'https://code.jquery.com/jquery-1.12.4.min.js',
      'assets/js/builder/controls.js',
      'assets/js/builder/util.js',
      'tests/**/*.js'
    ]
  });
};