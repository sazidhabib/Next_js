const errorMiddleware = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "INTERNAL SERVER ERROR";
    const extraDetails = err.extraDetails || "Error From Backend Server";
    res.status(status).json({
        message,
        extraDetails
    });
    next();

};



module.exports = errorMiddleware;