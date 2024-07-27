const express = require('express')
const { engine } = require('express-handlebars')
const bodyParser = require('body-parser')
const multiparty = require('multiparty')
//const cookieParser = require('cookie-parser')  
const handlers = require('./lib/handlers')
//const { credentials } = require('./config')
const weatherMiddlware = require('./lib/middleware/weather')
const quoteMiddleware = require('./lib/middleware/quotes')
//const expressSession = require('express-session')
//const flashMiddleware = require('./lib/middleware/flash')


const app = express()


// configure Handlebars view engine
app.engine('handlebars', engine({
    defaultLayout: 'main',
    helpers: {
        section: function(name, options) {
        if(!this._sections) this._sections = {}
        this._sections[name] = options.fn(this)
        return null
        },
        },
    }))
    

    app.set('view engine', 'handlebars')

    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    
    const port = process.env.PORT || 3000
    
    app.use(express.static(__dirname + '/public'))
    
    app.use(weatherMiddlware)
    app.use(quoteMiddleware)
    
    app.get('/', handlers.home)
    app.get('/about', handlers.about)
    // handlers for browser-based form submission
    app.get('/newsletter-signup', handlers.newsletterSignup)
    app.post('/newsletter-signup/process', handlers.newsletterSignupProcess)
    app.get('/newsletter-signup/thank-you', handlers.newsletterSignupThankYou)
    
    // handlers for fetch/JSON form submission
    app.get('/newsletter', handlers.newsletter)
    app.post('/api/newsletter-signup', handlers.api.newsletterSignup)
    
    // vacation photo contest
    app.get('/contest/vacation-photo', handlers.vacationPhotoContest)
    app.get('/contest/vacation-photo-ajax', handlers.vacationPhotoContestAjax)
    app.post('/contest/vacation-photo/:year/:month', (req, res) => {
      const form = new multiparty.Form()
      form.parse(req, (err, fields, files) => {
        if(err) return handlers.vacationPhotoContestProcessError(req, res, err.message)
        console.log('got fields: ', fields)
        console.log('and files: ', files)
        handlers.vacationPhotoContestProcess(req, res, fields, files)
      })
    })
    app.get('/contest/vacation-photo-thank-you', handlers.vacationPhotoContestProcessThankYou)
    app.post('/api/vacation-photo-contest/:year/:month', (req, res) => {
      const form = new multiparty.Form()
      form.parse(req, (err, fields, files) => {
        if(err) return handlers.api.vacationPhotoContestError(req, res, err.message)
        handlers.api.vacationPhotoContest(req, res, fields, files)
      })
    })
    
    app.use(handlers.notFound)
    app.use(handlers.serverError)
    
    if(require.main === module) {
      app.listen(port, () => {
        console.log( `Express started on http://localhost:${port}` +
          '; press Ctrl-C to terminate.' )
      })
    } else {
      module.exports = app
    }