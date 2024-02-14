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
        user.password = password ? await bcrypt.hash(password, salt) : undefined;

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
    try {
        const { name, email } = req.body;
    
        let user = await userModel.findOne({ email });

       
        if (user) {
            return res.status(400).json({ error: "Visitor ID already exists" });
        }

       
        user = new userModel({ name, email });

        await user.save();

        const token = createToken(user.id);
        console.log("token", token)
        res.status(200).json({ _id: user._id, name, email, token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const visitorChangeName = async (req: any, res: any) => {
    try {
        const { name, email } = req.body;
        console.log("name received", name)
        console.log("email received", email)
        let user = await userModel.findOne({ email });

        console.log("name user", user?.name)
        console.log("email user", user?.email)
        if (!user) {
            return res.status(400).json({ error: "Visitor no existant" });
        }

       
        user.name = name;
        await user.save();

        res.status(200).json({ _id: user._id, name, email });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



const loginUser = async (req:any, res:any) => {

    try {
        const {email, password} = req.body;

        let user = await userModel.findOne({email});
    
        if (!user) return res.status(400).json("Invalid email or password");
    
        const isValidPassword = user.password ? await bcrypt.compare(password, user.password) : false;
    
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

module.exports = { registerUser, loginUser, findUser, getUsers, visitorRegister, visitorChangeName};