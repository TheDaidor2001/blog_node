const express = require('express')
const multer = require('multer')
const router = express.Router()
const {test, crear, getArticles, getArticle, deleteArticle, editArticle, upload, imagen, buscador} = require('../controllers/Article')



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './imagenes/articulos')
    },

    filename: (req, file, cb) => {
        cb(null, `articulo-${Date.now()}${file.originalname}`)
    }
})

const subidas = multer({storage: storage})


//Ruta de prueba
router.get('/test', test)

//rutas reales
router.post('/crear', crear)
router.get('/articulos/:ultimos?', getArticles)
router.get('/articulo/:id', getArticle)
router.delete('/articulo/:id', deleteArticle)
router.put('/articulo/:id', editArticle)
router.post('/subir-imagen/:id', [subidas.single('file0')], upload)
router.get('/imagen/:fichero', imagen)
router.get('/buscar/:busqueda', buscador)

module.exports = router
