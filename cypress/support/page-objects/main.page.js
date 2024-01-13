import { SearchPage } from './search.page'

export class MainPage {
    inputKeyword(keyword) {
        cy.get('#searchInput').type(keyword)
        return this
    }

    inputKeywordAndSearch(keyword) {
        cy.get('#searchInput').type(keyword)
        cy.get('button').contains('Search').click()
        return new SearchPage()
    }

    verifySearchResultIsDisplayed() {
        cy.get('[aria-label="Search results"]')
            .find('li')
            .as('searchResults')
            .should('have.length.greaterThan', 1)
        return this
    }

    searchPageContainsKeywoard(keyword) {
        cy.get('@searchResults')
            .find('span')
            .contains('Search for pages containing')
            .find('Strong')
            .contains(keyword)
            .click()
        return new SearchPage()
    }
}
