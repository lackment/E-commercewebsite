var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var ejs = require("ejs")

var index = require('./routes/index')
var users = require('./routes/users')
var goods = require("./routes/goods")

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.engine(".html", ejs.__express)
app.set('view engine', 'html')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))


//登录拦截
app.use(function(req, res, next) {
    if (req.cookies.userId) {
        next()
    } else {
        console.log("url:" + req.originalUrl)
        if (req.originalUrl == '/users/login' || req.originalUrl == '/users/logout' || req.originalUrl.indexOf('/goods/list') > -1) {
            next()
        } else {
            res.json({
                status: '10001',
                msg: '当前未登录',
                result: ''
            })
        }
    }
})




app.use('/', index)
app.use('/users', users)
app.use('/goods', goods)









module.exports = app