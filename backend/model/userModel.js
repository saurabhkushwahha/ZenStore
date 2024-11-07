import mongoose from "mongoose";
import bcrypt from 'bcrypt'
const userSchema=new mongoose.Schema({
   name:{
    type:String,
    required:[true,"Name is required"]
   },

   email:{
    type:String,
    required:[true,"email is required"],
    unique:true
   },

  password:{
    type:String,
    required:[true,"password is required"],
    minlength:[3,'Password must be at least 3 characters long']
  },

  cartItems:[
    {
      quantity:{
        type:Number,
        default:1
      },
      product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product'
      }
    },

  ],
   role:{
    type:String,
    enum:["customer","admin"],
    default:"customer"
   }



},{timestamps:true})

// pre-hook or middleware to hash password before going to database
userSchema.pre("save",async function(next){
  if(!this.isModified("password")) return next()
   try {
      const salt= await bcrypt.genSalt(10)
      this.password=await bcrypt.hash(this.password,salt)
      next()
   } catch (error) {
      next(error)
   }
})

// methods
userSchema.methods.comparePassword= async function (password){
   return await bcrypt.compare(password,this.password)
}

const userModel=mongoose.model('User',userSchema)

export default userModel;