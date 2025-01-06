const User = require("./userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const Order = require("./orderModel");

// function to generate token
async function generateToken(userId) {
  const token = await jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
}
// signup function
exports.signup = async (req, res) => {
  try{
    const checkIfEmailExists = await User.findOne({ email: req.body.email });
    const checkIfPhoneExists = await User.findOne({ phone: req.body.phone });
    if (!checkIfEmailExists && !checkIfPhoneExists) {


      if(req.body.password === req.body.confirmPassword){
        const contactNo = Number(req.body.contactNo);
        const encryptedPassword = await bcrypt.hash(req.body.password, 12);
        const createUser = await User.create({
          name: req.body.name,
          email: req.body.email,
          phone: contactNo,
          password: encryptedPassword,
        });

        const token = await generateToken(await createUser.id);
        res.cookie("jwt", token, {
          expires: new Date(
              Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
          ),
          secure: true,
          httpOnly: true,
        });
        return res.json({ message: "User successfully registered!"});
      } else {
        return res.json({
          message: "Password doesnt match",
        })
      }

    }
    if (checkIfEmailExists || checkIfPhoneExists) {
      return res.json({ message: "Email or Phone No. already exists" });
    }
    res.json({ message: "its working" });
  } catch(err){
    res.json({message:"something went wrong"});
  }
};

// login function
exports.login = async (req, res) => {
  // check if email and password both are provided
 try{
   if (!req.body.email || !req.body.password) {
     return res.json({ message: "login failed" });
   }
   //check if user Exists
   const user = await User.findOne({ email: req.body.email }).select(
       "+password"
   );
   if (!user) {
     return res.status(401).json({ message: "login failed" });
   }
   // generate and send token if password matches
   if (user) {
     const doesMatch = await bcrypt.compare(req.body.password, user.password); //compare passwords
     if (doesMatch) {
       const token = await generateToken(user.id); //generate token
       // return res.status(200).json({message: "Login successfully",token:token});

       res.cookie("jwt", token, {
         expires: new Date(
             Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
         ),
         secure: true,
         httpOnly: true,
       });
       return res.json({ message: "login successfull" });
     }
   }
 } catch (err){
   res.json({ message: "something went wrong" });
 }
};

exports.validateToken = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      let token;
      token = req.cookies.jwt;
      // console.log(token)
      const decoded = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET
      );
      console.log(decoded);
      const freshUser = await User.findById(decoded.id);
      if (!freshUser) {
        return res.json({
          message: "User belonging to this token doesn't exists",
        });
      }
      if (freshUser) {
        next();
      }
    }
  } catch (err) {
    if (err.message === "jwt expired") {
      return res.json({
        message: "your login expired kindly relogin!",
      });
    }
    console.log(err.message);
  }
};

exports.getAllOrders = async (req,res)=>{

  try{
    const tokenDetails = await jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
    const orders = await Order.find({userId: tokenDetails.id})
    res.json({orders});

  }catch(err){
    res.json({message:"Something went wrong"});
  }

}
exports.createOrder = async (req,res)=>{
 try{
   const token = req.cookies.jwt ;
   const tokenDetails = await jwt.verify(token, process.env.JWT_SECRET);

   const ifExists = await User.findById(tokenDetails.id);
   if(ifExists){
     const newOrder = await Order.create({
       userId: tokenDetails.id,
       customerName: req.body.customerName,
       contactNo: req.body.contactNo,
       deliveryAddress: req.body.customerAddress,
       couponApplied: req.body.couponApplied,
       itemsOrdered: req.body.itemsOrder,
       subTotal: req.body.subTotal,
       grandTotal: req.body.grandTotal,

     })
     console.log(newOrder);
     if(newOrder) {
       res.json({message:"success"});
     }

   }


 } catch(err){
   res.json({message:"something went wrong"});
 }
}

exports.getUserDetails = async (req,res)=>{
  try{
    const token = req.cookies.jwt ;
    const tokenDetails = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(tokenDetails.id);
    if(await user){
      const data = {
        name: user.name,
        email: user.email,
        contactNo: user.phone ,
        addresses: user.addresses,
        selectedAddress: user.selectedAddress,
        cartItems: user.cartItems
      }
      return res.json(data);
      // console.log(data);
    }
    return  res.json({message:"failed"});
  } catch (err){
    res.json({message:"something went wrong"});
  }
}

exports.updateAddress = async (req,res)=>{
try{
  const token = req.cookies.jwt ;
  const user = await jwt.verify(token, process.env.JWT_SECRET);
  console.log(user.id);
  const updateUser = await User.findByIdAndUpdate({_id : user.id}, {
    addresses: req.body
  });
  console.log(req.body);
  res.json({message:"success"});
} catch (err){
  res.json({message:"something went wrong"});
}
}


exports.setSelectedAddress = async (req,res)=>{
try{
  const token = req.cookies.jwt ;
  const tokenInfo = await jwt.verify(token, process.env.JWT_SECRET);
  const updateUser = await User.findByIdAndUpdate({_id : tokenInfo.id}, {
    selectedAddress: req.body
  });
  console.log(await updateUser)
  res.json({message:"success"});
} catch(err){
  res.json({message:"something went wrong"});
}
}
