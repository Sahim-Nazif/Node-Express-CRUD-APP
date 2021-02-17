const express=require('express')
const router = express.Router()
const {register_user, user_login,update_user,profile_update_success,delete_user, isAuth,user_signout
}=require('../controllers/userController')



router.get('/', (req,res)=>{

    res.render('home')
})
router.get('/register', (req, res)=>{

    res.render('register');
});

router.get('/signout', user_signout)
router.get('/delete/:id', delete_user)
router.get('/update',isAuth, profile_update_success)
router.post('/login', user_login)
router.post('/register', register_user)
router.post('/update/:id', update_user)


module.exports = router