const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const validator = require('validator');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please tell your name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email'],
    },
    password: {
        type: String,
        required: [true, 'Please apply a password'],
    },
    role: {
        type: String,
        enum: {
            values: ['teacher', 'admin'],
            message: 'Roles are only: teacher, leader, admin',
        },
        default: 'teacher',
    },
    major: {
        type: mongoose.Schema.ObjectId,
        ref: 'Major',
    },
    passwordResetToken: {
        type: String,
    },
    resetTokenExpire: {
        type: Date,
    },
    passwordChangedAt: {
        type: Date,
    },
});
//
UserSchema.pre(/^find/, function () {
    this.select('name email role');
    this.populate('major');
});
// hash password before save to db
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);

    this.passwordChangedAt = Date.now() - 1000;

    next();
});

// method to check if password change after jwt generate
UserSchema.methods.changePasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );

        // false = not change = the last time password change is before jwt generate
        return JWTTimestamp < changedTimestamp;
    }

    // False means NOT changed
    return false;
};

// method use to compare password user type and password in db, because password in db has been hash before that
UserSchema.methods.comparePassword = function (typePass, dbPass) {
    return bcrypt.compareSync(typePass, dbPass);
};

// generate reset token use for reset password if user forget it
UserSchema.methods.createResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.resetTokenExpire = Date.now() + 5 * 60 * 1000;

    return resetToken;
};

//
const User = mongoose.model('User', UserSchema);
module.exports = User;
