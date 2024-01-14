const { defineConfig } = require('cypress')

module.exports = defineConfig({
    defaultCommandTimeout: 15000,
    env: {
        BASE_URL_API: 'https://en.wikipedia.org/w/api.php',
    },
    e2e: {
        specPattern: 'cypress/e2e/**',
        baseUrl: 'https://www.wikipedia.org',
    },
    viewportHeight: 1080,
    viewportWidth: 1920,
    browser: 'chrome',
    video: false,
    numTestsKeptInMemory: 10,
})
