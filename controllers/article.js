const fs = require('node:fs')
const Article = require("../models/Article");
const { validateArticles } = require("../helpers/validate");
const path = require('node:path');

const test = (req, res) => {
  return res.status(200).json({
    msg: "Hola guapo test",
  });
};

const crear = (req, res) => {
  //recoger la informacion de la peticion
  let params = req.body;

  //validar datos
  try {
    validateArticles(params);
  } catch (error) {
    return res.status(400).json({
      status: "error",
      msg: error.message || "Error inesperado",
    });
  }

  //crear Objeto a guardar
  const article = new Article(params);

  //asignar valores al objeto basado en el modelo
  // article.titulo = params.titulo etc...

  //guardar el articulo en la base de datos
  article
    .save()
    .then((savedArticle) => {
      return res.status(200).json({
        status: "success",
        article: savedArticle,
        msg: "Artículo guardado correctamente",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        status: "error",
        msg: "No se ha guardado el articulo",
      });
    });
};

const getArticles = (req, res) => {
  let consulta = Article.find({});

  if (req.params.ultimos && req.params.ultimos !== undefined) {
    consulta.limit(3);
  }

  consulta
    .sort({ fecha: -1 })
    .then((articulos) => {
      if (!articulos) {
        return res.status(404).json({
          status: "error",
          msg: "No se ha encontrado ningun articulo",
        });
      }

      return res.status(200).json({
        status: "success",
        articulos,
      });
    })
    .catch((error) => {
      return res.status(500).json({
        status: "error",
        msg: "Ha habido un error al listar los artículos, recarga la página",
      });
    });
};

const getArticle = (req, res) => {
  //recoger el ID
  let id = req.params.id;

  //buscar el articulo en la base de datos
  Article.findById(id)
    .then((article) => {
      if (!article) {
        return res.status(404).json({
          status: "error",
          msg: "No se ha encontrado ningun articulo",
        });
      }

      return res.status(200).json({
        status: "success",
        article,
      });
    })
    .catch((error) => {
      return res.status(500).json({
        status: "error",
        msg: "Ha habido un error al listar los artículos, recarga la página",
      });
    });
};

const deleteArticle = (req, res) => {
  let id = req.params.id;

  Article.findByIdAndDelete(id)
    .then((article) => {
      if (!article) {
        return res.status(404).json({
          status: "error",
          msg: "No se ha encontrado ningun articulo",
        });
      }

      return res.status(200).json({
        status: "success",
        msg: "Articulo borrado correctamente",
        article,
      });
    })
    .catch((error) => {
      return res.status(500).json({
        status: "error",
        msg: "Ha habido un error al eliminar, vuelve a intentarlo más tarde",
      });
    });
};

const editArticle = (req, res) => {
  let id = req.params.id;
  let params = req.body;

  //validar datos
  try {
    validateArticles(params);
  } catch (error) {
    return res.status(400).json({
      status: "error",
      msg: error.message || "Error inesperado",
    });
  }

  //Buscar y actualizar el articulo
  Article.findByIdAndUpdate(id, params, { new: true })
    .then((article) => {
      if (!article) {
        return res.status(404).json({
          status: "error",
          msg: "No se ha encontrado ningun articulo",
        });
      }

      return res.status(200).json({
        status: "success",
        msg: "Articulo actualizado correctamente",
        articulo: article,
      });
    })
    .catch((error) => {
      return res.status(500).json({
        status: "error",
        msg: "Ha ocurrido un error",
      });
    });
};

const upload = (req, res) => {
  //recoger ficheros de la imagen
  if(!req.file && !req.files) {
    return res.status(404).json({
        status: "error",
        msg: "No se ha subido ningun archivo"
    })
  }

  //conseguir nombre del archivo
  let archivo = req.file.originalname;

  //extension del archivo
  let extension = archivo.split(".")[1];
  console.log(extension);

  //comprobar extensiones permitidas
  if (
    extension != "jpg" &&
    extension != "png" &&
    extension != "gif" &&
    extension != "jpeg"
  ) 
  {
    //borrar archivo
    fs.unlink(req.file.path, (err) => {
        return res.status(400).json({
        status: "error",
        msg: "Archivo no permitido",
      });
    
    })
  }

  //actualizar el articulo
  let id = req.params.id;


  //Buscar y actualizar el articulo
  Article.findByIdAndUpdate(id, {imagen: req.file.filename}, { new: true })
    .then((article) => {
      if (!article) {
        return res.status(404).json({
          status: "error",
          msg: "No se ha encontrado ningun articulo",
        });
      }

      return res.status(200).json({
        status: "success",
        msg: "Articulo actualizado correctamente",
        articulo: article,
      });
    })
    .catch((error) => {
      return res.status(500).json({
        status: "error",
        msg: "Ha ocurrido un error",
      });
    });
};

const imagen = (req, res) => {
    let fichero = req.params.fichero;
    let ruta = `./imagenes/articulos/${fichero}`;

    fs.stat(ruta, (error, existe) => {
        if(existe) {
            return res.sendFile(path.resolve(ruta))
        }else{
            return res.status(404).json({
                status: "error",
                msg: "La imagen no existe",
            });
        }
    })
}

const buscador = (req,res) => {
    //sacr el string
    let busqueda = req.params.busqueda

    //find OR
    Article.find({ "$or": [
        {"titulo": {"$regex": busqueda, "$options": "i"}},
        {"contenido": {"$regex": busqueda, "$options": "i"}}
    ]})
        .sort({fecha: -1})
        //ejecutar consulta
        .then((articulos) => {
            if(!articulos) {
                return res.status(404).json({
                    status: "error",
                    msg: "No se ha encontrado ningun articulo"
                })
            }

            return res.status(200).json({
                status: "success",
                articulos
            })

        })
        .catch((error) => {
            return res.status(500).json({
                status: "error",
                msg: "Ha ocurrido un error"
            })
        })
}


module.exports = {
  test,
  crear,
  getArticles,
  getArticle,
  deleteArticle,
  editArticle,
  upload,
  imagen,
  buscador
};
