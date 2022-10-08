var express = require('express');
var router = express.Router();
const workerHelpers = require('../helpers/worker-helpers');
const userHelpers=require('../helpers/user-helpers');
const session = require('express-session');

router.get('/', function(req, res){
    res.render('worker/signup')
})



module.exports =router;