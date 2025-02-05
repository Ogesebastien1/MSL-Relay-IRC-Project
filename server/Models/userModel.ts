import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {type: String, required: true, minlength: 3, maxlength: 30},
        email: {type: String, required: false, minlength: 3, maxlength: 200, unique: true},
        password: {type: String, required: false, minlength: 12, maxlength: 1024}
    },
    {
        timestamps: true,
    }
);

const userModel = mongoose.model("User", userSchema);

export default userModel;