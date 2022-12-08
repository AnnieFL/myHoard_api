const isAllowed = (permission) => {
    return function (req, res, next) {
        if (req.user.permissions.includes('ADMIN')) {
            req.admin = true;
            return next();
        }

        if (req.user.permissions.includes(permission)) {
            return next();
        }
        return res.status(403).json({ msg: "Not allowed" });
    }
}

module.exports = { isAllowed }