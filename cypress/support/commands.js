const decorator = '----------------'

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
})

Cypress.Commands.add('logStep', (s) => {
    Cypress.log({
        name: 'setSessionStorage',
        displayName: `${decorator} STEP:`,
        message: s,
    })
})

Cypress.Commands.add('logVerify', (s) => {
    Cypress.log({
        name: 'setSessionStorage',
        displayName: `${decorator} VERIFY:`,
        message: s,
    })
})

Cypress.Commands.add('logPrecondition', (s) => {
    Cypress.log({
        name: 'setSessionStorage',
        displayName: `${decorator} PRECONDITION:`,
        message: s,
    })
})
