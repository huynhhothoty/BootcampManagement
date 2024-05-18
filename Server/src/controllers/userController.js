const User = require('../models/userModel');
const CustomError = require('../utils/CustomError');
const jwt = require('jsonwebtoken');
const Email = require('../utils/email');
const crypto = require('crypto');

const getAllUser = async (req, res, next) => {
    try {
        const userList = await User.find({ isActive: true });
        res.status(200).send({
            status: 'ok',
            data: userList,
        });
    } catch (error) {
        return next(error);
    }
};

const register = async (req, res, next) => {
    try {
        const data = req.body;
        const newUser = new User({
            name: data.name,
            email: data.email,
            password: data.password,
        });
        await newUser.save();

        res.status(201).send({
            status: 'ok',
            data: newUser,
        });
    } catch (error) {
        next(error);
    }
};

const createToken = (id) => {
    const jwtToken = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES,
    });
    return jwtToken;
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // check are they null
        if (!email || !password) {
            return next(new CustomError('Please fill all email and password', 400));
        }

        // check email and password if correct
        const loginUser = await User.findOne({ email });
        if (!loginUser || !loginUser.comparePassword(password, loginUser.password)) {
            return next(new CustomError('Email or Password is incorrect', 401));
        }

        let token = createToken(loginUser._id);

        res.status(200).send({
            status: 'ok',
            accessToken: token,
            loginUser: {
                id: loginUser._id,
                name: loginUser.name,
                role: loginUser.role,
                email: loginUser.email,
                major: loginUser.major,
            },
        });
    } catch (error) {
        return next(error);
    }
};

const forgetPassoword = async (req, res, next) => {
    try {
        // get user base on email

        let { email } = req.body;
        if (!email) {
            return next(new CustomError('Please provide your email', 400));
        }
        const thisUser = await User.findOne({ email: req.body.email });
        if (!thisUser) {
            return next(new CustomError('There is no account with this email', 404));
        }

        const resetToken = thisUser.createResetPasswordToken();
        await thisUser.save({ validateBeforeSave: false });

        try {
            const emailInstance = new Email(thisUser);
            await emailInstance.sendResetPasswordMail(resetToken);

            res.status(200).send({
                status: 'ok',
                message:
                    'Please access link is sent via your email by PATCH request to reset password',
                userId: thisUser._id,
            });
        } catch (error) {
            thisUser.passwordResetToken = undefined;
            thisUser.resetTokenExpire = undefined;
            await thisUser.save({ validateBeforeSave: false });
            console.log(error);
            return next(
                new CustomError('Error occurs when sending email, please try again', 500)
            );
        }
    } catch (error) {
        return next(error);
    }
};

const resetPassword = async (req, res, next) => {
    try {
        // get user base on token
        const hashToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');
        const thisUser = await User.findOne({ passwordResetToken: hashToken });

        // if token is not expire + this user is exist, set the new password for this user
        if (!thisUser || thisUser.resetTokenExpire < Date.now()) {
            return next(new CustomError('This reset token is invalid or expired', 400));
        }

        let newPassword = req.body.password;
        if (!newPassword) {
            return next(new CustomError('Please provide your new password'));
        }
        thisUser.passwordResetToken = undefined;
        thisUser.resetTokenExpire = undefined;
        thisUser.password = newPassword;

        await thisUser.save({ validateBeforeSave: false });

        res.status(200).send({
            status: 'ok',
            message: 'Your new password is applied',
        });
        //
    } catch (error) {
        return next(error);
    }
};

const updatePassword = async (req, res, next) => {
    try {
        // get user
        const thisUser = req.user;

        // check typed password is correct
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword)
            return next(
                new CustomError('Please enter your password and new password', 400)
            );
        if (!thisUser.comparePassword(oldPassword, thisUser.password)) {
            return next(new CustomError('Your password you enter is incorrect', 401));
        }

        // change password
        thisUser.password = newPassword;
        await thisUser.save({ validateBeforeSave: false });

        res.status(200).send({
            status: 'ok',
            message: 'change password successfully',
        });

        //
    } catch (error) {
        return next(error);
    }
};

const updatePasswordByAdmin = async (req, res, next) => {
    try {
        const { newPassword, userId } = req.body;
        if (!newPassword)
            return next(new CustomError('Please enter new password and userId', 400));
        const thisUser = await User.findById(userId);
        if (!thisUser) return next(new CustomError('No user with this id', 404));

        // change password
        thisUser.password = newPassword;
        await thisUser.save({ validateBeforeSave: false });

        res.status(200).send({
            status: 'ok',
            message: 'change password successfully',
        });
    } catch (error) {
        return next(error);
    }
};

const filterObject = (obj, ...allowField) => {
    const newObject = {};
    Object.keys(obj).forEach((ele) => {
        if (allowField.includes(ele)) newObject[ele] = obj[ele];
    });
    return newObject;
};

const updateInfo = async (req, res, next) => {
    try {
        if (req.body.password)
            return next(new CustomError('You can not update password here', 400));

        const filterBody = filterObject(req.body, 'name', 'email');

        const updateUser = await User.findByIdAndUpdate(req.user._id, filterBody, {
            new: true,
            runValidators: true,
        });

        res.status(200).send({
            status: 'ok',
            data: updateUser,
        });
    } catch (error) {
        return next(error);
    }
};

const getOneUser = async (req, res, next) => {
    try {
        const loginUser = await User.findById(req.params.id).populate('major');
        if (!loginUser) {
            return next(new CustomError('No document with this Id', 404));
        }
        res.status(200).send({
            status: 'ok',
            data: {
                id: loginUser.id,
                name: loginUser.name,
                role: loginUser.role,
                major: loginUser.major,
                email: loginUser.email,
            },
        });
    } catch (error) {
        return next(new CustomError(error));
    }
};

//
module.exports = {
    register,
    login,
    forgetPassoword,
    resetPassword,
    updatePassword,
    updateInfo,
    getAllUser,
    getOneUser,
    updatePasswordByAdmin,
};
