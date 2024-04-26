import express from 'express'
import session from 'express-session'
import path from 'path'
import {fileURLToPath} from 'url'
import multer from 'multer'
import mongoose from 'mongoose'
import {register} from './schema.js'
import bcrypt from 'bcrypt'

const app=express()
const router=express.Router()
        
const __filename=fileURLToPath(import.meta.url)
const __dirname=path.dirname(__filename)
app.use(express.urlencoded({extended:false}))


await mongoose.connect("mongodb+srv://anushksanghvi:Anushk2105@cluster0.uwfzaxf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(() =>{console.log("connected to database successfully")}).catch((error)=> {console.log("error in connecting to database" , error)})

app.use(express.json())

router.get('/',(req,res)=>{                                                           
    res.sendFile(path.join(__dirname,'../../frontend/LandingPage.html'))              //homepage
})

// router.get('/signin' ,(req,res)=>{
//     res.sendFile(path.join(__dirname,'../../frontend/Signin.html'))                  //loginpage
// })
// router.get('/signup',(req,res)=>{                                                     //signuppage
//     res.sendFile(path.join(__dirname,'../../frontend/Signup.html'))
// })

// router.get('/homebuyer',(req,res) =>{                                                 //homepage of buyer
//     res.sendFile(path.join(__dirname,`../../frontend/homepagebuyers.html`))
// })

// router.get('/about',(req,res) =>{                                                     //aboutpage
//     res.sendFile(path.join(__dirname,'../../frontend/About.html'))
// })
 
// router.get('/sell',(req,res) =>{                                                      //homepage of seller
//     res.sendFile(path.join(__dirname,'../../frontend/Sellerlandingpage.html'))
// })


router.post('/submit', async(req,res) =>{                                             //fetch of signup page
    const userData=req.body
    console.log(userData)
    const verifyemail=userData.email

    const existing_user=await register.findOne({email:verifyemail})

    if(existing_user){
        console.log('email already exists')
        res.send("Email already exists, Signin")
        return
    }

    const newuserdata=new register({
        name:userData.name,
        email:userData.email,
        password:userData.password
    })

    await newuserdata.save().then(() => console.log('User registered')).catch(() => console.log("error registering"))

    res.send('Data received and user registered')
})

router.post('/authenticateuser', async(req,res) =>{                                //fetch of signin page
    const authenticate=req.body
    // console.log(authenticate)

    const check_email=authenticate.email
    const verify_password=authenticate.password

    const verify_email = await register.findOne({email:check_email})


    if(!verify_email){
        res.status(400).send("Wrong E-mail or Password")
        return
    }
    else{

   if(verify_password === verify_email.password){
    // res.status=200

    // req.session.email=verify_email
    
    res.status(200).send('Successful User')
    return  
   }
   else{
    console.log("Wrong e-mail or password")
    res.status(400).send("Wrong e-mail or password")
    return 
   }
}
})

// router.post('/ques', async(req,res)=>{
//     const saveques = new ques({
//         email:req.session.email.email,
//         ques:req.body.ques
//     })
//     await saveques.save().then(() => console.log('Question registered')).catch(() => console.log("Not registered Question"))
//     res.send("Ques saved")
// })



export default router
