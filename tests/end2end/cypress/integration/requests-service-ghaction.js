describe('Request service', function () {
    it('Lizmap GetProjectConfig', function () {
        cy.request('/index.php/lizmap/service/getProjectConfig?repository=testsrepository&project=selection')
            .then((resp) => {
                expect(resp.status).to.eq(200)
                expect(resp.headers['content-type']).to.eq('application/json')
            })
    })

    it('Lizmap GetProj4', function () {
        cy.request({
            url: '/index.php/lizmap/service/?repository=testsrepository&project=selection',
            qs: {
                'SERVICE': 'WMS',
                'VERSION': '1.3.0',
                'REQUEST': 'GetProj4',
                'AUTHID': 'EPSG:2154',
            },
            failOnStatusCode: false,
        }).then((resp) => {
            expect(resp.status).to.eq(200)
            expect(resp.headers['content-type']).to.contain('text/plain')
            expect(resp.body).to.contain('+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs')
        })
    })

    it('WMS GetCapabilities', function () {
        cy.request('/index.php/lizmap/service/?repository=testsrepository&project=selection&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities')
            .then((resp) => {
                expect(resp.status).to.eq(200)
                expect(resp.headers['content-type']).to.eq('text/xml; charset=utf-8')
                expect(resp.body).to.contain('WMS_Capabilities')
            })
    })

    it('WMTS GetCapabilities', function () {
        cy.request('/index.php/lizmap/service/?repository=testsrepository&project=selection&SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetCapabilities')
            .then((resp) => {
                expect(resp.status).to.eq(200)
                expect(resp.headers['content-type']).to.eq('text/xml; charset=utf-8')
            })
    })

    it('WFS GetCapabilities', function () {
        cy.request('/index.php/lizmap/service/?repository=testsrepository&project=selection&SERVICE=WFS&VERSION=1.0.0&REQUEST=GetCapabilities')
            .then((resp) => {
                expect(resp.status).to.eq(200)
                expect(resp.headers['content-type']).to.eq('text/xml; charset=utf-8')
                expect(resp.body).to.contain('WFS_Capabilities')
            })
    })

    it('WFS GetFeature', function () {
        cy.request({
            method: 'POST',
            url: '/index.php/lizmap/service/?repository=testsrepository&project=selection',
            qs: {
                'SERVICE': 'WFS',
                'VERSION': '1.0.0',
                'REQUEST': 'GetFeature',
                'TYPENAME': 'selection',
                'OUTPUTFORMAT': 'GeoJSON',
            },
        }).then((resp) => {
            expect(resp.status).to.eq(200)
            expect(resp.headers['content-type']).to.contain('application/vnd.geo+json')
            expect(resp.body).to.have.property('type', 'FeatureCollection')
        })
    })

    it('Project parameter is mandatory', function () {
        cy.request({
            url: '/index.php/lizmap/service/?repository=testsrepository&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities',
            failOnStatusCode: false,
        }).then((resp) => {
            expect(resp.status).to.eq(404)
            expect(resp.headers['content-type']).to.contain('text/xml')
            expect(resp.body).to.contain('ServiceException')
        })
    })

    it('Repository parameter is mandatory', function () {
        cy.request({
            url: '/index.php/lizmap/service/?project=selection&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities',
            failOnStatusCode: false,
        }).then((resp) => {
            expect(resp.status).to.eq(404)
            expect(resp.headers['content-type']).to.contain('text/xml')
            expect(resp.body).to.contain('ServiceException')
        })
    })

    it('Service unknown or unsupported', function () {
        cy.request({
            url: '/index.php/lizmap/service/?repository=testsrepository&project=selection&SERVICE=OWS&VERSION=1.3.0&REQUEST=GetCapabilities',
            failOnStatusCode: false,
        }).then((resp) => {
            expect(resp.status).to.eq(501)
            expect(resp.headers['content-type']).to.contain('text/xml')
            expect(resp.body).to.contain('ServiceException')
        })
    })

    it('Request unsupported', function () {
        cy.request({
            url: '/index.php/lizmap/service/?repository=testsrepository&project=selection&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetUnsupported',
            failOnStatusCode: false,
        }).then((resp) => {
            expect(resp.status).to.eq(501)
            expect(resp.headers['content-type']).to.contain('text/xml')
            expect(resp.body).to.contain('ServiceException')
        })
    })

    it('Request undefined', function () {
        cy.request({
            url: '/index.php/lizmap/service/?repository=testsrepository&project=selection&SERVICE=WMS&VERSION=1.3.0',
            failOnStatusCode: false,
        }).then((resp) => {
            expect(resp.status).to.eq(501)
            expect(resp.headers['content-type']).to.contain('text/xml')
            expect(resp.body).to.contain('ServiceException')
        })
    })

    it('Version parameter is mandatory except for GetCapabilities request', function () {
        cy.request({
            method: 'POST',
            url: '/index.php/lizmap/service/?repository=testsrepository&project=selection',
            qs: {
                'SERVICE': 'WFS',
                'REQUEST': 'GetFeature',
                'TYPENAME': 'selection',
                'OUTPUTFORMAT': 'GeoJSON',
            },
            failOnStatusCode: false,
        }).then((resp) => {
            expect(resp.status).to.eq(501)
            expect(resp.headers['content-type']).to.contain('text/xml')
            expect(resp.body).to.contain('ServiceException')
        })

        cy.request({
            url: '/index.php/lizmap/service/?repository=testsrepository&project=selection',
            qs: {
                'SERVICE': 'WFS',
                'REQUEST': 'GetCapabilities',
            },
        }).then((resp) => {
            expect(resp.status).to.eq(200)
            expect(resp.headers['content-type']).to.eq('text/xml; charset=utf-8')
            expect(resp.body).to.contain('WFS_Capabilities')
        })
    })
})
