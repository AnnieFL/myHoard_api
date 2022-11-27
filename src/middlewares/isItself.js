const isItself  = (req, res, next) => {
    const token = req.user;
    const email = req.params.email.toLowerCase();

    if (req.user.permissions.includes('ADMIN')) {

        req.admin = true;
        return next();
    }

    if (token.email != email) {
        return res.status(401).json({msg: "Not Allowed"}); 
    }
    next();
}

module.exports = { isItself };