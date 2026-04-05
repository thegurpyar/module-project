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
        url: 'https://07fc-2409-40d1-467-60fb-5c26-7ab1-7057-bba2.ngrok-free.app', // URL for the API server
      },
    ],
  },
  apis: ['./src/modules/**/*.route.ts'], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

export default router;
