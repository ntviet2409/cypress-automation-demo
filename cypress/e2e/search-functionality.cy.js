/// <reference types="cypress" />

import { MainPage } from '../support/page-objects/main.page'

describe('Match Listing View', () => {
    let normalKeywords, specialKeywords, searchPage, message
    const mainPage = new MainPage()

    before(() => {
        cy.logPrecondition('Load search keywords and contents')
        cy.fixture('data').then((data) => {
            normalKeywords = data.keywords.validKeywords
            specialKeywords = data.keywords.specialKeywords
        })

        cy.fixture('contents').then((data) => {
            message = data.messages.notFoundKeyword.en
        })
    })

    beforeEach(() => {
        cy.logStep('Open Wikipedia - main page')
        cy.visit('/wiki/Main_Page')
    })

    it('TC-01: Verify search result matched with existing keyword contexts', () => {
        cy.logStep(`Data Driven with ${normalKeywords.length} dataset`)
        normalKeywords.forEach((keyword) => {
            mainPage
                .inputKeyword(keyword)
                .verifySearchResultIsDisplayed(keyword)
            searchPage = mainPage.searchPageContainsKeywoard(keyword)
            searchPage.verifySearchResultContainsTitles(keyword)
        })
    })

    it('TC-02: Verify no result is found due to unavailable keyword contexts', () => {
        cy.logStep(`Data Driven with ${specialKeywords.length} dataset`)
        specialKeywords.forEach((keyword) => {
            searchPage = mainPage.inputKeywordAndSearch(keyword)
            searchPage.verifyNoResultDescriptionIsDisplayed(message)
        })
    })
})
