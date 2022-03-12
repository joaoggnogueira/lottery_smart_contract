const Routes = require("next-routes")
const routes = Routes()

routes.add("/campaigns/new", "/campaigns/new").add("/campaigns/:address", "/campaigns/show")

module.exports = routes
