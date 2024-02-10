import userModel from "../Models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

// function to generating a token
const createToken = (_id: any) => {
    const jwtkey = process.env.JWT_SECRET_KEY || "undifined";

    return jwt.sign({_id}, jwtkey, {expiresIn:"3d"});
}

const registerUser = async (req: any, res: any) => {

    try {
        const {name, email, password} = req.body;

        // find the user if already exists || await = waiting the result before reading other lines of code.
        let user = await userModel.findOne({email});
        // if it exists => Error 400 (Bad request)
        if (user) return res.status(400).json("A user with the given email already exists!");

        // if name, email or password is empty => Error 400 (Bad request)
        if (!name || !email || !password) return res.status(400).json("All fields are required!");

        // email validation
        if (!validator.isEmail(email)) return res.status(400).json("The email is not valid!");

        // password validation
        if (!validator.isStrongPassword(password)) return res.status(400).json("The password must be strong!");

        //! ------------- User registration ------------------

        user = new userModel({name, email, password});

        // Hashing password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        await user.save();

        const token = createToken(user.id);

        res.status(200).json({_id: user._id, name, email, token});
    } catch (error) {
        console.log(error);
        // if there is a problem => Error 500 (Server side error)
        res.status(500).json(error);
    }
}

const visitorRegister = async (req: any, res: any) => {

    console.log("test before try")
    try {
        const {name} = req.body;

        // if name, email or password is empty => Error 400 (Bad request)
        if (!name) return res.status(400).json("All fields are required!");

        console.log("test before save")
        const user = new userModel({name});

        await user.save();

        console.log("test after save")
        const token = createToken(user.id);
        console.log("test before 200")
        res.status(200).json({_id: user._id, name, token});
        console.log("test after 200")
    } catch (error) {
        console.log(error);
        // if there is a problem => Error 500 (Server side error)
        res.status(500).json(error);
    }
}


const loginUser = async (req:any, res:any) => {

    try {
        const {email, password} = req.body;

        let user = await userModel.findOne({email});
    
        if (!user) return res.status(400).json("Invalid email or password");
    
        const isValidPassword = await bcrypt.compare(password, user.password);
    
        if (!isValidPassword) return res.status(400).json("Invalid password");

        const token = createToken(user.id);

        res.status(200).json({_id: user._id, name: user.name, email, token});
    } catch (error) {
        console.log(error);
        // if there is a problem => Error 500 (Server side error)
        res.status(500).json(error);
    }
}

const findUser = async(req:any, res: any) => {
    const userId = req.params.userId;

    try {
       const user = await userModel.findById(userId);
       
       res.status(200).json(user);
    } catch (error) {
        console.log(error);
        // if there is a problem => Error 500 (Server side error)
        res.status(500).json(error);
    }
}

const getUsers = async(req:any, res: any) => {
    try {
       const users = await userModel.find();
       
       res.status(200).json(users);
    } catch (error) {
        console.log(error);
        // if there is a problem => Error 500 (Server side error)
        res.status(500).json(error);
    }
}

module.exports = { registerUser, loginUser, findUser, getUsers, visitorRegister};