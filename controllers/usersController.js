const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const storage = require('../utils/cloud_storage');

module.exports={
    
    register(req, res){
        const user = req.body; //capturo los datos que me envia el cliente
        User.create(user, (err,data)=>{

            if(err){
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario',
                    error: err
                });
            }
            return res.status(201).json({
                success: true,
                message: 'El registro se realizo correctamente',
                data: data //el id del nuevo usuario que se registro
            });
        });

    },

    //**Cambios para el registro de un cliente con imagen */

    async registerWithImage(req, res){
        const user = JSON.parse(req.body.user); //capturo los datos que me envia el cliente

        const files = req.files;

        if(files.lenght > 0){
            const path = `image_${Date.now()}`; //para dar nombre a las imagenes que carguemos 
            const url = await storage(files[0],path);

            if(url != undefined && url != null){
                user.image = url;
            }
        }

        User.create(user, (err,data)=>{

            if(err){
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario',
                    error: err
                });
            }

            //Para retornar el usuario y logearse en cuanto se crea
            user.id = data;

            return res.status(201).json({
                success: true,
                message: 'El registro se realizo correctamente',
                data: user //retornamos todo el usuario
            });
        });

    },

    login(req,res){
        const email = req.body.email;
        const password = req.body.password;

        User.findByEmail(email, async(err,myUser)=>{

            if(err){
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error en la busqueda del usuario',
                    error: err
                });
            }
            if(!myUser){
                return res.status(401).json({//El cliente no tiene autorizacion para realizar esta peticion(401)
                    success: false,
                    message: 'El email no fue encontrado',
                    error: err
                });
            }

            const isPasswordValid = await bcrypt.compare(password, myUser.password);
            if(isPasswordValid){
                const token = jwt.sign({id: myUser.id, email: myUser.email}, keys.secretOrKey, {});
                const data = {
                    id: `${myUser.id}`,
                    name: myUser.name,
                    lastname:  myUser.lastname,
                    email: myUser.email,
                    phone: myUser.phone,
                    image: myUser.image,
                    session_token:  `JWT ${token}`
                }
                return res.status(201).json({
                    success: true,
                    message: 'Usuario encontrado',
                    data: data 
                });
            }else{
                return res.status(401),json({
                    success: false,
                    message: 'El password es incorrecto'
                });
            }

        });
    }
}