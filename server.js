const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const logger = require('morgan');
const cors = require('cors');

/**Importar Rutas */
const usersRoutes = require('./routes/userRutes');

const port = process.env.PORT || 3000;

//**Bloque de codigo necesario para poder debugear */
app.use(logger('dev'));
app.use(express.json());//Nos permite mostrar error en formato json
app.use(express.urlencoded({
    extended: true
}));
app.use(cors());

app.disable('x-powered-by'); //Practica de seguridad

app.set('port',port);

server.listen(3000,'192.168.100.2' || 'localhost', function(){
    console.log('Aplicacion de node JS '+port+' iniciando...')
});

//**Rutas */
app.get('/',(req, res)=>{
    res.send('Ruta raiz del backend');
});
app.get('/test',(req,res)=>{
    res.send('Ruta test'); //Ruta que permite ver el funcionamiento
});

/**Llamado de Rutas*/
usersRoutes(app);



//**Manejo de error (Error Handler) */
app.use((err,req,res,next)=>{
    console.log(err);
    res.status(err.status || 500).send(err.stack);
});
/*
    TIPOS DE ERRORES
    200 - Respuesta exitosa
    400 - URL no existe
    500 - Error interno del dervidor
*/