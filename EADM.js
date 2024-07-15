const express = require('express')
const { engine } = require('express-handlebars')

const app = express()
const citat = require('./lib/citat')
const handlers = require('./lib/handlers')
// configure Handlebars view engine
app.engine('handlebars', engine({defaultLayout: 'main',}))
app.set('view engine', 'handlebars')

app.use(express.static(__dirname + '/public'))

const port = process.env.PORT || 3000

// route to pages
app.get('/', handlers.home)
app.get('/about', handlers.about)
// custom 404 page
app.use(handlers.notFound)
// custom 500 page
app.use(handlers.serverError)

if(require.main === module) {
    app.listen(port, () => {
    console.log( `Express started on
   http://localhost:${port}` +
    '; press Ctrl-C to terminate.' )
    })
   } else {
    module.exports = app
   }