const { UserModel } = require('./../models/users.model')
const authenticate = (req, res, next)=>
{
    let token = req.header('x-auth');
    UserModel.findByToken(token).then(user=>{
        if(!user){
            return Promise.reject();
        }
        req.user = user;
        req.token = token;
        
        next();
    }).catch(e=>{
        res.status(401).send(e);
    });
 }

 module.exports = {
    authenticate
 }