const express=require('express')
const app=express()
const mongoose=require('mongoose')
const dotenv=require('dotenv')
const morgan=require('morgan')
const compress=require('compression')
const bodyParser=require('body-parser')
const userRoutes=require('./app/routes/Routes')







//middlewares

dotenv.config();


app.use(express.urlencoded({extended:true}))
app.use(express.json())
if (process.env.NODE_ENV==='development') {
    app.use(morgan('dev'))
    console.log('the app is in development phase')

} else if (process.env.NODE_ENV==='production') {

    app.use(compress());
    console.log('the app is in production phase ')
}

//db connection
mongoose
    .connect(process.env.MONGO_URI,{
        useNewUrlParser:true, 
        useUnifiedTopology:true,
        useCreateIndex: true, 
      
        })
        .then(()=> console.log('Mongo-DB Connected...'))
        .catch(err => console.log(err));
//static file access point
app.use(express.static('public/css'));

app.use('/user',userRoutes)


app.listen(process.env.PORT , ()=>{

    console.log(`The app is running in ${process.env.NODE_ENV} mode on port ${process.env.PORT }`)

})