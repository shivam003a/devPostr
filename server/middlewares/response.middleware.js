export const responseMiddleware = (req, res, next) => {
    res.success = (message = 'OK', data = null, status = 200) => {
        return res.status(status).json({
            success: true,
            data,
            message,
        });
    };

    res.error = (message = 'Internal Server Error', data = null, status = 500) => {
        return res.status(status).json({
            success: false,
            data,
            message,
        });
    };

    next();
};
