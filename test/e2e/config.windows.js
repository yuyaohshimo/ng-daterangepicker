exports.config = {
  seleniumServerJar: '../../node_modules/gulp-protractor/node_modules/protractor/selenium/selenium-server-standalone-2.45.0.jar',

  seleniumArgs: ['-Dwebdriver.ie.driver=./node_modules/gulp-protractor/node_modules/protractor/selenium/IEDriverServer.exe'],

  multiCapabilities: [
    {
      'platform': 'WINDOWS',
      'browserName': 'chrome',
      'name': 'ng-daterangepicker E2E Tests on chrome in WINDOWS',
      'tunnel-identifier' : process.env.TRAVIS_JOB_NUMBER
    },
    {
      'os': 'Windows 7',
      'platform': 'WINDOWS',
      'browserName': 'internet explorer',
      'version': '11',
      'name': 'ng-daterangepicker E2E Tests on ie in WINDOWS',
      'tunnel-identifier' : process.env.TRAVIS_JOB_NUMBER
    }
  ],

  exclude: ['./spec/use-browser-default.js'],

  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,

  framework: 'jasmine',

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  }
};
