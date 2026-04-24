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
      },
      schemas: {
        Property: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '64a1b2c3d4e5f6789012345'
            },
            title: {
              type: 'string',
              example: 'Beautiful 3BHK Apartment in Delhi'
            },
            slug: {
              type: 'string',
              example: 'beautiful-3bhk-apartment-in-delhi'
            },
            purpose: {
              type: 'string',
              enum: ['rent', 'sale'],
              example: 'rent'
            },
            category: {
              type: 'string',
              enum: ['flat', 'apartment', 'house', 'villa', 'studio', 'pg', 'shop', 'office', 'plot', 'warehouse'],
              example: 'apartment'
            },
            price: {
              type: 'number',
              example: 25000
            },
            priceType: {
              type: 'string',
              enum: ['monthly', 'yearly', 'total'],
              example: 'monthly'
            },
            bhk: {
              type: 'number',
              example: 3
            },
            bathrooms: {
              type: 'number',
              example: 2
            },
            totalArea: {
              type: 'number',
              example: 1200
            },
            areaUnit: {
              type: 'string',
              enum: ['sqft', 'sqm', 'marla', 'kanal', 'acre'],
              example: 'sqft'
            },
            city: {
              type: 'string',
              example: 'Delhi'
            },
            sector: {
              type: 'string',
              example: 'Sector 15'
            },
            locality: {
              type: 'string',
              example: 'Rohini'
            },
            landmark: {
              type: 'string',
              example: 'Near Metro Station'
            },
            fullAddress: {
              type: 'string',
              example: '123 Main Street, Rohini, Delhi'
            },
            coordinates: {
              type: 'object',
              properties: {
                lat: {
                  type: 'number',
                  example: 28.7041
                },
                lng: {
                  type: 'number',
                  example: 77.1025
                }
              }
            },
            furnishing: {
              type: 'string',
              enum: ['unfurnished', 'semi-furnished', 'fully-furnished'],
              example: 'semi-furnished'
            },
            parking: {
              type: 'string',
              enum: ['none', 'bike', 'car', 'both'],
              example: 'car'
            },
            age: {
              type: 'number',
              example: 2
            },
            amenities: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['lift', 'gym', 'power_backup', 'swimming_pool', 'security', 'clubhouse', 'park', 'near_market']
              },
              example: ['lift', 'gym', 'security']
            },
            description: {
              type: 'string',
              example: 'Spacious 3BHK apartment with modern amenities'
            },
            images: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  url: {
                    type: 'string',
                    example: 'https://example.com/image1.jpg'
                  }
                }
              }
            },
            userId: {
              type: 'string',
              example: '64a1b2c3d4e5f6789012345'
            },
            status: {
              type: 'string',
              enum: ['available', 'sold', 'pending'],
              example: 'pending'
            },
            featured: {
              type: 'boolean',
              example: false
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-07-01T10:30:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-07-01T10:30:00.000Z'
            }
          }
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
