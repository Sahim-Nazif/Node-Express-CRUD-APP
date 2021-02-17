const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt=require('jsonwebtoken')


const register_user= (req, res)=>{
    const {firstName, lastName, email, password, confirmPassword}=req.body;
    let errors=[];
    //check if passwords don't match
    if(password !==confirmPassword){
        errors.push({msg: 'Password do not match !'});
    } 
    if (password.length<6){
        errors.push({msg: 'Password should be at least 6 characters!'});
    }
    //checking if any of the above conditions are true, we will re-render the sign up page
    if (errors.length>0){
        res.render('register', {
            errors,
            firstName,
            lastName,
            email,
            password,
            confirmPassword
        });
        }
        //now if Valdiation passes
        else{
            User.findOne({email})
                .then(user=>{
                    if (user){
                        //checking if user exists(means emails is registered)
                        req.flash('error_msg', 'This email is already registered')
                        //errors.push({msg:'Email is already registered !'})
                        res.render('register', {
                            firstName,
                            lastName,
                            email,
                            password,
                            confirmPassword
                        });
                    }
                    else{
                        const newUser= new User({
                            firstName,
                            lastName,
                            email,
                            password
                        });
                        //password hashing
                        bcrypt.genSalt(10,(err, salt)=>{
                            bcrypt.hash(newUser.password, salt,
                                (err, hash)=>{
                                    if (err) throw err;
                                    newUser.password=hash;
                                    //saving user to DB
                                    newUser.save()
                                        .then(user=>{
                                            req.flash('success_msg','You are now registered & can login')
                                            res.redirect('/')
                                          
                                        })
                                        .catch(err=>{
                                            console.log(err)
                                        });
                                })
                        })
                    }
                })
    }
};


const user_login= async(req, res)=>{


    try {
    
        const {email, password}= req.body
    
        if (!email || !password) {

            req.flash('error_msg', 'Required fields are missing !')
            res.redirect('/')
                  
        }
      
        const user= await User.findOne({email})
        if (!user ){
           
            req.flash('error_msg', 'User not found. Do you want to register instead?')
             res.redirect('/')
        }
        if (user && await bcrypt.compare(password,user.password)) {
             const userResponse={
                 _id:user._id,
                 email:user.email,
                 firstName:user.firstName,
                 lastName:user.lastName
             }
             const token=jwt.sign({_id:userResponse._id}, process.env.JWT_SECRET)
             // persist the token as 't' in cookie with expirty
             res.cookie('t', token, {expire: new Date() + 9999})
         
             //return response with user and token to front-end client
             const {_id, firstName, lastName, email,}=userResponse
         
             return res.render('profile',{token, userResponse:{_id, firstName,lastName, email}})
            //res.render('profile', {userResponse})
          
        } 
        else{
            req.flash('error_msg','Email or Password does not match')
         
        }
    } catch (error) {
        throw Error(`Error while  Authenticating a User ${error}`)
    }
}
//delete user
const delete_user=(req, res)=>{

    const id= req.params.id;
    User.findByIdAndDelete(id)
        .then((result)=>{
            req.flash('success_msg','You deleted your account successfuly')
            res.redirect('/');
           
           
        })
        .catch(err=>{
            console.log(err);
            
        })

}

const profile_update_success=(req, res)=>{

     res.render('success')
}


const update_user=async(req, res)=>{

    
        await User.findByIdAndUpdate({_id:req.params.id}, req.body,(err, docs)=>{

        if (err) {
            req.flash('error_msg', 'Could not fetch')
        }
        else{
     
           req.flash('success_msg', 'Profile update successfuly')
            res.redirect('/update')
        }

})
}

const isAuth=(req, res, next)=>{

    try {
        const user=req.profile && req. auth && req.profile._id== req.auth._id
        if (!user){
         
           req.flash('error_msg', 'Access denied')
        
        }
      
    } catch (error) {
        res.status(400).json({message:error})
    }
   
   // res.json(user)
   next()
    
}

// const isAuth=(req, res, next)=>{

//     const bearerToken=req.header('user')

//     if (typeof bearerToken!== undefined) {
//         req.token = bearerToken;
//         next();
//     } else{
//         req.flash('error_msg','You are not allowed')
//     }

// }
    

//user logout
const user_signout=(req, res)=>{

    res.clearCookie('t','connect.sid')
    res.redirect('/')
    
}

module.exports = {
    register_user,
    user_login,
    update_user,
    profile_update_success,
    delete_user,
    isAuth,
    user_signout
}