const mongoose = require('mongoose')

const conection = async () => {
    try {
        
        await mongoose.connect("mongodb://localhost:27017/mi_blog")
        console.log('Conectado a la Base de Datos');
    } catch (error) {
        console.log(error);
        throw new Error('No se a podido conectar a la base de datos')
    }
}

module.exports = {
    conection
}