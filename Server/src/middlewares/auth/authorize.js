const CustomError = require('../../utils/CustomError')

const authorization = (...roles) => {
    return (req, res, next) => {
        
        if (!roles.includes(req.user.role)) {
            return next(
                new CustomError('You do not have permission to to this', 403)
            );
        }

        next();
    };
};

module.exports = authorization