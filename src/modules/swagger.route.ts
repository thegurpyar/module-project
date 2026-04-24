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
        url: 'https://d4f4-2409-40d1-40b-60bc-78d0-a52c-32d7-6821.ngrok-free.app/', // URL for the API server
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
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Property Rental API Documentation",
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
    docExpansion: 'none',
    tryItOutEnabled: true,
    operationsSorter: 'alpha',
    tagsSorter: 'alpha',
    defaultModelsExpandDepth: 2,
    defaultModelExpandDepth: 2,
  }
}));

export default router;
