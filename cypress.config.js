const { defineConfig } = require('cypress')

module.exports = defineConfig({
    defaultCommandTimeout: 15000,
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
