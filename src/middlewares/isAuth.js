const jwt = require('jsonwebtoken')

const isAuth = (req, res, next) => {

    // verifica se token existe
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ msg: "Missing authorization token" });
    }

    // validar o token
    const tokenValidado = jwt.verify(token, process.env.JWT_SECRET);

    req.user = tokenValidado;
    if (req.user.permissions.includes("ADMIN")) {
        req.admin = true;
    }

    next();
}

module.exports = { isAuth };