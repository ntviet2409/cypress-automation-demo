/// <reference types="cypress" />
import { SearchPage } from '../support/page-objects/search.page'

describe('Match Listing View', () => {
    let matchedKeywords, unmatchedKeywords, negativeOffsetKeyword
    let searchPage = new SearchPage()

    before(() => {
        cy.logPrecondition('Load search keywords and contents')
        cy.fixture('data').then((data) => {
            matchedKeywords = data.keywords.matchedResults
            unmatchedKeywords = data.keywords.unmatchedResults
            negativeOffsetKeyword =
                data.keywords.unmatchedResultsWithNegativeOffset
        })
    })

    it('API-01: Verify search result can be queried by GET request with valid srsearch and sroffset params', () => {
        matchedKeywords.forEach((keyword) => {
            searchPage.querySearchByParamsAndVerifyMatchedResults(
                keyword.name,
                keyword.offset
            )
        })
    })

    it('API-02: Verify that the search returns valid results containing valid searching context', () => {
        unmatchedKeywords.forEach((keyword) => {
            searchPage.querySearchByParamsAndVerifyUnmatchedResults(
                keyword.name,
                keyword.offset
            )
        })
    })

    it('API-03: Verify that the search returns warnings when negative sroffset param is provided', () => {
        searchPage.querySearchByParamsWithNegativeOffsetAndVerifyWarningMessage(
            negativeOffsetKeyword.name,
            negativeOffsetKeyword.offset
        )
    })

    it('API-04: Verify that the search returns error when missing srsearch', () => {
        searchPage.querySearchByParamsWithMissingSrsearchAndVerifyErrorMessage(
            negativeOffsetKeyword.offset
        )
    })

    it('API-05: Verify that the search returns valid result when missing sroffset', () => {
        matchedKeywords.forEach((keyword) => {
            searchPage.querySearchByParamsWithMissingOffsetAndVerifyResponse(
                keyword.name
            )
        })
    })
})
