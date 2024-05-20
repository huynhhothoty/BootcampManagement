const User = require('../models/userModel');
const CustomError = require('../utils/CustomError');
const jwt = require('jsonwebtoken');
const Email = require('../utils/email');
const crypto = require('crypto');
const ApiFeatures = require('../utils/ApiFeature');

const getAllUser = async (req, res, next) => {
    try {
        const apiFeat = new ApiFeatures(
            User.find({ isActive: true }).select('-password -__v').lean(),
            req.query
        );
        const apiFeat2 = new ApiFeatures(
            User.find({ isActive: true }).select('-password -__v').lean(),
            req.query
        );
        apiFeat.filter().sorting().pagination();
        apiFeat2.filter();

        const docs = await apiFeat.myQuery;
        const docsOnlyFilter = await apiFeat2.myQuery;

        res.status(200).send({
            status: 'ok',
            total: docsOnlyFilter.length,
            data: docs,
        });
    } catch (error) {
        return next(error);
    }
};

const register = async (req, res, next) => {
    try {
        const { name, email, major } = req.body;

        if (!name || !email || !major)
            return next(new CustomError('Please fill name, email and major', 400));

        const checkUser = await User.find({ email }).lean();
        if (checkUser) return next(new CustomError('This email is already exist', 400));

        const newPassword = crypto.randomBytes(4).toString('hex');

        const newUser = new User({
            name: name,
            email: email,
            password: newPassword,
            major: major,
        });
        await newUser.save();

        try {
            const mail = new Email(newUser);
            await mail.sendWelcomeMail(newPassword);

            res.status(200).send({
                status: 'ok',
                message: 'User has been created, please check your mail',
                newUser,
            });
        } catch (error) {
            return next(new CustomError('Error when sending email, try again'));
        }
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
            return next(new CustomError('Your password you enter is incorrect', 400));
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
        const { userId } = req.body;
        if (!userId) return next(new CustomError('Please enter userId', 400));
        const thisUser = await User.findById(userId);
        if (!thisUser) return next(new CustomError('No user with this id', 404));

        // gen random password
        const newPassword = crypto.randomBytes(4).toString('hex');

        // change password
        thisUser.password = newPassword;
        await thisUser.save({ validateBeforeSave: false });

        try {
            const mail = new Email(thisUser);
            await mail.sendNewPasswordMail(newPassword);

            res.status(200).send({
                status: 'ok',
                message: 'change password successfully, please check mail for more info',
            });
        } catch (error) {
            return next(new CustomError('Error when sending email, try again'));
        }
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
