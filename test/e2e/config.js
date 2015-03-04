exports.config = {
  seleniumServerJar: '../../node_modules/gulp-protractor/node_modules/protractor/selenium/selenium-server-standalone-2.44.0.jar',

  multiCapabilities: [
    {
      'browserName': 'chrome',
      'name': 'ng-daterangepicker E2E Tests in chrome',
      'tunnel-identifier' : process.env.TRAVIS_JOB_NUMBER
    },
    {
      'browserName': 'internet explorer',
      'name': 'ng-daterangepicker E2E Tests in ie',
      'tunnel-identifier' : process.env.TRAVIS_JOB_NUMBER
    }
  ],

  capabilities: {
    
  },

  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,

  framework: 'jasmine',

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  }
};
