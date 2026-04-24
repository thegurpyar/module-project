import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

const router = express.Router();

// Swagger definition
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0', // Specify the version of Swagger
    info: {
      title: 'Property Rental API', // Title of the API
      version: '1.0.0', // Version of the API
      description: 'API documentation for Property Rental', // Description of the API
    },
    servers: [
      {
        url: 'https://74aa-2409-40d1-467-60fb-63c3-447f-e3ed-dffe.ngrok-free.app/', // URL for the API server
      },
      {
        url: 'http://localhost:5000', // URL for the API server
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token here'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/modules/**/*.route.ts'], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
  explorer: true,
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
    docExpansion: 'none'
  }
}));

export default router;
