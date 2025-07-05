/**
 * @author: srinivasaimandi
 */

const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Users App API",
      version: "1.0.0",
      description: "API documentation for the Users App API",
    },
    servers: [
      {
        url: "http://localhost:9899/api",
      },
      {
        url: "http://raspberrypi.local:9899/api",
      },
      {
        url: "https://express-api-demo-jyxx.onrender.com/api",
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-api-key",
          description: "API key required for all endpoints except /login",
        },
      },
    },
    security: [
      {
        ApiKeyAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
