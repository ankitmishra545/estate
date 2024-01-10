import bcryptjs from "bcryptjs";
import { errorHandler } from "../utilis/error.js"
import User from '../models/user.model.js'
import Listing from "../models/listing.model.js";

export const test = (req,res) => {
    res.json({message: "Api route is working!"})
}

export const updateUser = async(req, res, next) => {
    if(req.user.id !== req.params.id) return next(errorHandler(403,'You can only update your own account!'));
    try {
        if(req.body.password){

            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        const updatedUserInfo = await User.findByIdAndUpdate(req.params.id, {
            $set:{
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar
            }
        }, {new: true}) 

        const {password, ...rest} = updatedUserInfo._doc;

        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
}

export const deleteUser = async(req, res, next) => {
    if(req.user.id !== req.params.id) return next(errorHandler(401, 'You can delete your own account only!'));
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token')
        res.status(200).json('User has been deleted!');
    } catch (error) {
        next(error)
    }
}

export const getUserListings = async(req, res, next) => {
    if(req.user.id === req.params.id){
        try {
            const listings = await Listing.find({userRef: req.params.id});
            res.status(200).json(listings);
        } catch (error) {
            next(error);
        }
    }else{
        next(errorHandler(401, 'You can only view your own listings!'));
    }
};