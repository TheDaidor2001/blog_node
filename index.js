const { conection } = require('./database/connection')
const express = require('express')
const cors = require('cors')


//Conectar a la base de Datos
conection()

//crear servidor de Node
const app = express()

//configurar CORS
app.use(cors())

//Convertir body a Objeto JS
app.use(express.json()) //recibir datos con contentType Application/JSON
app.use(express.urlencoded({ extended: true })) //recibir datos con contentType Application/x-www-form-urlencoded

//Rutas reales
const routesArticle = require('./routes/article')
app.use('/api', routesArticle)

//crear rutas pruebas
app.get('/', (req, res) => {
    return res.status(200).json({
        msg: 'Hola guapo'
    })
})


//Definir puerto y crear 
const port = process.env.PORT || 3000

// arrancar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`)
})