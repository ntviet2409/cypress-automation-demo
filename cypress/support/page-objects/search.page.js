const ITEMS_PER_PAGE = 10
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

    querySearchByParamsAndVerifyMatchedResults(keyword, offset) {
        cy.request('GET', this.getURI(keyword, offset)).then((response) => {
            this.commonResponseChecks(response)
            expect(response.body).to.have.nested.property(
                'continue.sroffset',
                offset + ITEMS_PER_PAGE
            )
            expect(response.body.query?.search).to.have.length(10)

            let arrKeyword = keyword.toLowerCase().split(' ')
            let arrRestults = response.body.query?.search
            for (let article of arrRestults) {
                let matchedResult = false
                for (let keyword of arrKeyword) {
                    if (
                        article.title?.toLowerCase().includes(keyword) ||
                        article.snippet?.toLowerCase().includes(keyword)
                    ) {
                        matchedResult = true
                        break
                    }
                    console.log(
                        `Keyword ${keyword} is not found in article ${article.title}`
                    )
                    console.log(
                        `Keyword ${keyword} is not found in snippet ${article.snippet}`
                    )
                }
                expect(matchedResult).to.be.true
            }
        })
    }

    querySearchByParamsAndVerifyUnmatchedResults(keyword, offset) {
        cy.request('GET', this.getURI(keyword, offset)).then((response) => {
            this.commonResponseChecks(response)
            expect(response.body.query?.search).to.have.length(0)
        })
    }

    querySearchByParamsWithNegativeOffsetAndVerifyWarningMessage(
        keyword,
        offset
    ) {
        cy.request('GET', this.getURI(keyword, offset)).then((response) => {
            this.commonResponseChecks(response)
            expect(response.body.query?.search).to.have.length(0)
            expect(response.body).to.have.nested.property(
                'warnings.search.warnings',
                'The value "-1" for parameter "sroffset" must be no less than 0.'
            )
        })
    }

    querySearchByParamsWithMissingSrsearchAndVerifyErrorMessage(offset) {
        cy.request('GET', this.getURIWithoutSrsearchParam(offset)).then(
            (response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.have.nested.property(
                    'error.info',
                    'The "srsearch" parameter must be set.'
                )
            }
        )
    }

    querySearchByParamsWithMissingOffsetAndVerifyResponse(keyword) {
        const FALBACK_OFFSET = 10
        cy.request('GET', this.getURIWithoutSroffsetParam(keyword)).then(
            (response) => {
                expect(response.body).to.have.nested.property(
                    'continue.sroffset',
                    FALBACK_OFFSET
                )
                expect(response.body.query?.search).to.have.length(10)

                let arrKeyword = keyword.toLowerCase().split(' ')
                let arrRestults = response.body.query?.search
                for (let article of arrRestults) {
                    let matchedResult = false
                    for (let keyword of arrKeyword) {
                        if (
                            article.title?.toLowerCase().includes(keyword) ||
                            article.snippet?.toLowerCase().includes(keyword)
                        ) {
                            matchedResult = true
                            break
                        }
                        console.log(
                            `Keyword ${keyword} is not found in article ${article.title}`
                        )
                        console.log(
                            `Keyword ${keyword} is not found in snippet ${article.snippet}`
                        )
                    }
                    expect(matchedResult).to.be.true
                }
            }
        )
    }

    getURI(keyword, offset) {
        return `${Cypress.env(
            'BASE_URL_API'
        )}?action=query&format=json&list=search&srsearch=${keyword}&sroffset=${offset}&formatversion=2`
    }

    getURIWithoutSrsearchParam(offset) {
        return `${Cypress.env(
            'BASE_URL_API'
        )}?action=query&format=json&list=search&sroffset=${offset}&formatversion=2`
    }

    getURIWithoutSroffsetParam(keyword) {
        return `${Cypress.env(
            'BASE_URL_API'
        )}?action=query&format=json&list=search&srsearch=${keyword}&formatversion=2`
    }

    commonResponseChecks(response) {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('batchcomplete', true)
    }
}
