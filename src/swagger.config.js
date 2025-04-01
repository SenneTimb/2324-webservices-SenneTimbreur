module.exports = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Chiro Waarschoot API with Swagger',
      version: '0.1.0',
      description:
        'Simpele CRUD API die als project voor het vak webservices dient',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'ChiroWaarschootAPI',
        email: 'senne.timbreur@student.hogent.be',
      },
    },
    servers: [
      {
        url: 'https://webservices-sennetimbreur.onrender.com',
      },
    ],
    components:{
      securitySchemes:{
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',  
        }, 
      },
    }
    ,
    security: {
      bearerAuth: [],  
    },
  },
  apis: ['./src/rest/*.js'],
 
};