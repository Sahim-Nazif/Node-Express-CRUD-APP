const express=require('express')
const router = express.Router()
const {register_user, user_login}=require('../controllers/userController')


router.get('/', (req,res)=>{

    res.render('home')
})


router.post('/register', register_user)
router.post('/login', user_login)

module.exports = router