const validator = require("validator");

const validateArticles = (params) => {
  
    let validar_titulo =
      !validator.isEmpty(params.titulo) &&
      validator.isLength(params.titulo, { min: 5, max: undefined });

    let validar_contenido = !validator.isEmpty(params.contenido);

    if (!validar_titulo || !validar_contenido)
      throw new Error("No se a validado la información");
};

module.exports = { 
    validateArticles 
};