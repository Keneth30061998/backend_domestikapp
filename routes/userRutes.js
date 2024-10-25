const usersController = require('../controllers/usersController');

module.exports = (app)=>{

    //GET       -> obtener datos
    //POST      -> Almacenar datos
    //PUT       -> Actualizar datos 
    //DELETE    -> ELiminar datos

    app.post('/api/users/create', usersController.register);
    app.post('/api/users/login', usersController.login);

}