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

//user login
const user_login=(req, res)=>{


    
}
module.exports = {


    register_user
}