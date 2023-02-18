/*import { Router } from 'express';
import { User } from "../models/UserModel.js";
import { auth } from "../middleware/auth.js";

const userRouter = Router();


userRouter.get("/auth", auth, async(req, res) => {
    try {
        const user = await User.findByToken(req.token);
        res.status(200).json({
            _id:user.id,
            isAdmin: user.role !== 0 ? false : true,
            isAuth : true,
            email: user.email,
            fname: user.fname,
            lname: user.lname,
            role: user.role,
            image: user.image,
        });
    } catch (error){
        res.status(401).json({
            isAuth: false,
            error: "Authentication failed",
        });
    }
});

userRouter.post("/register", async (req, res) => {
    try {
        const existingUser = await User.findOne({email: req.body.email});
        if (existingUser){
            return res.status(400).json({
                success: false,
                error: "Email already exists",
            });
        }
        //Create New User
        const user = await User.create(req.body);
        return res.status(200).json({
            success: true,
            user: user
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

userRouter.post("/login", async (req, res) => {
    try {
        const user = await User.findByEmail(req.body.email);
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "Authentication failed, email not found"
            });
        }
        const isMatch = await user.comparePassword(req.body.password);
        if (!isMatch) {
            return res.json({ loginSuccess: false, message: "Wrong password" });
        }
        user.generateToken();
        await user.save();
        res.cookie("w_authExp", user.tokenExp);
        res.cookie("w_auth", user.token);
        res.status(200).json({ loginSuccess: true, userId: user.id });
    } catch (error) {
        res.status(400).send({success: false, error: "Login failed"});
    }
});

userRouter.delete('/users/:id', auth, async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id)
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' })
      }
      return res.status(200).json({ message: 'User deleted' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Server error' })
    }
});

userRouter.get("/logout", auth, async (req, res) => {
    try {
        req.user.token = "";
        req.user.tokenExp = "";
        await req.user.save();
        return res.status(200).send({
            success: true
        });
    } catch (error) {
        return res.json({ success: false, error:"Logout Failed" });
    }
});

export {
    userRouter
}*/