const isItself  = () => {
    return function (req, res, next) {
        const token = req.user;
        const {id} = req.params;
    
    if (req.user.permissions.includes('ADMIN')) {
        
        req.admin = true;
        return next();
    }
    
    if (token.id != id) {
        return res.status(401).json({msg: "Not Allowed"}); 
    }
    next();
}
}

module.exports = { isItself };