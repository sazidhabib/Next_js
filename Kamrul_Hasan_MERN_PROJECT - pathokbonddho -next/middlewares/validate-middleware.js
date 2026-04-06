const validate = (schema) => async (req, res, next) => {
    try {
        // Parse and replace req.body with the validated data
        req.body = await schema.parseAsync(req.body);
        next();
    } catch (error) {
        console.log("Validation error:", error);

        if (error.errors && Array.isArray(error.errors)) {
            const message = error.errors[0].message;
            res.status(400).json({ success: false, message });
        } else {
            res.status(500).json({ success: false, message: "Something went wrong during validation." });
        }
    }
};

module.exports = validate;
