/// <reference types="cypress" />

import { MainPage } from '../support/page-objects/main.page'

describe('Match Listing View', () => {
    let matchedKeywords, unmatchedKeywords, searchPage, message
    const mainPage = new MainPage()

    before(() => {
        cy.logPrecondition('Load search keywords and contents')
        cy.fixture('data').then((data) => {
            matchedKeywords = data.keywords.matchedResults
            unmatchedKeywords = data.keywords.unmatchedResults
        })

        cy.fixture('contents').then((data) => {
            message = data.messages.notFoundKeyword.en
        })
    })

    beforeEach(() => {
        cy.logStep('Open Wikipedia - main page')
        cy.visit('/wiki/Main_Page')
    })

    it('UI-02: Verify that the search returns valid results containing  valid searching context', () => {
        cy.logStep(`Data Driven with ${matchedKeywords.length} dataset`)
        matchedKeywords.forEach((keyword) => {
            mainPage
                .inputKeyword(keyword.name)
                .verifySearchResultIsDisplayed(keyword.name)
            searchPage = mainPage.searchPageContainsKeywoard(keyword.name)
            searchPage.verifySearchResultContainsTitles(keyword.name)
        })
    })

    it('UI-03: Verify that the search returns  no results matching the keyword', () => {
        cy.logStep(`Data Driven with ${unmatchedKeywords.length} dataset`)
        unmatchedKeywords.forEach((keyword) => {
            searchPage = mainPage.inputKeywordAndSearch(keyword.name)
            searchPage.verifyNoResultDescriptionIsDisplayed(message)
        })
    })
})
