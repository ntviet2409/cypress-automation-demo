export class SearchPage {
    searchPageContainsKeywoard(keyword) {
        cy.get('@searchResults')
            .find('span')
            .contains('Search for pages containing')
            .find('Strong')
            .contains(keyword)
            .click()
        return new SearchPage()
    }

    verifySearchResultContainsTitles(keyword) {
        cy.get('.mw-search-result .searchresult')
            .should('be.visible')
            .each(($el) => {
                cy.wrap($el)
                    .invoke('text')
                    .then((searchResultText) => {
                        let arrKeyword = keyword.toLowerCase().split(' ')
                        let matchedResult = false
                        for (let keyword of arrKeyword) {
                            if (
                                searchResultText.toLowerCase().includes(keyword)
                            ) {
                                matchedResult = true
                                break
                            }
                        }
                        cy.logVerify(
                            `Verify search result text contains any word in keyword:
                            - Result Text: ${searchResultText.toLowerCase()}
                            - Keywords: ${arrKeyword}`
                        )
                        expect(matchedResult).to.be.true
                    })
            })
        return this
    }

    verifyNoResultDescriptionIsDisplayed(description) {
        cy.get('.mw-search-nonefound')
            .should('be.visible')
            .should('contain.text', description)
        return this
    }
}
