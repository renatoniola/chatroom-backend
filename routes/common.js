const router = require('express').Router()
const {authenticate} = require('../middleware/authenticate');

router.get('/', authenticate,(req, res, next) => {
    
    res.send('Ok!!')
  })
  
  
module.exports = router