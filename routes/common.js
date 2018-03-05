const router = require('express').Router()

router.get('/', (req, res, next) => {
    
    res.send('Ok!!')
  })
  
  
module.exports = router