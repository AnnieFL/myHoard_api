const jwt = require('jsonwebtoken')
require('dotenv').config()

const isAuth  = (req, res, next) => {
    
    // verifica se token existe
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({msg: {pt: "Sem token de autorização", en: "Missing authorization token", go: "No auth? No pass!!!"}}); 
    }

    // validar o token
    const tokenValidado = jwt.verify(token, process.env.JWT_SECRET);

    req.user = tokenValidado;
    next();
}

module.exports = { isAuth };