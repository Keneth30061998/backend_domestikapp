const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const Keys = require('./keys');
const User = require('../models/user');

/**Variables
 * 
 * let cuando van a cambiar sus valores
 * const cuando los valores no cambian
 * 
 */

module.exports = (passport)=>{
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('JWT');
    opts.secretOrKey = Keys.secretOrKey;

    passport.use(new JwtStrategy(opts , (jwt_payload, done)=>{

        User.findById(jwt_payload.id, (err, user)=>{

            if(err){
                return done(err,false)
            }
            if(user){
                return done(null, user);
            }else{
                return(null, false);
            }

        })

    }));
}