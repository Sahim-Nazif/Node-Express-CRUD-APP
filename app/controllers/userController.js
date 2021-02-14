const User = require('../models/user')
const bcrypt = require('bcrypt')

//registering a user
const register_user = async (req, res) => {

    try {
      
        const { firstName, lastName, email, password, confirmPassword } = req.body;
        const existingUser = await User.findOne({ email })
        if (password !== confirmPassword) {
            res.status(200).json({message:'Passwords do not match !'});
        }
        
        else if(!existingUser) {
            const hashPassword = await bcrypt.hash(password, 10)
            const user = await User.create({

                firstName,
                lastName,
                email,
                password: hashPassword
            })
            //will be returning all fields except for the password
            return res.json({
                _id:user._id,
                firstName:user.firstName,
                lastName:user.lastName,
                email:user.email
            })
        }

        return res.status(400).json({ message: 'Email already exists! do you want to register instead?' })

    } catch (error) {

       
        throw Error(`Error while registering a new user : ${error}`)
    }
}


const user_login= async(req, res)=>{


    try {
    
        const {email, password}= req.body

        if (!email || !password) {

               //return res.render('home',{message:'Required fields missing'} )
            // errors.push({msg:'Required fields missing'})
            req.flash('error_msg', 'Required fields are missing !')
            res.redirect('/')
          
            //return res.status(200).json({message:'Required filed missing'})
           
        }
        const user= await User.findOne({email})
        if (!user){
            //return res.status(200).json({message:'User not found. Do you want to register instead?'})
            req.flash('error_msg', 'User not found. Do you want to register instead?')
            //return res.render('home', {message:'User not found. Do you want to register instead?'} )
            res.redirect('/')
        }
        if (user && await bcrypt.compare(password,user.password)) {
             const userResponse={
                 _id:user._id,
                 email:user.email,
                 firstName:user.firstName,
                 lastName:user.lastName
             }
            
             req.flash('success_msg', 'Welcome to your profile page')
            res.render('profile', {userResponse})
          
        } else{
            req.flash('error_msg','Email or Password does not match')
         
        }
    } catch (error) {
        throw Error(`Error while  Authenticating a User ${error}`)
    }
}




// }
module.exports = {
    register_user,
    user_login
}