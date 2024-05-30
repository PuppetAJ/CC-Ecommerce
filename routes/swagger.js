const swaggerUi = require('swagger-ui-express');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const swaggerRouter = require('express').Router();

const swaggerDocument = yaml.load(
  fs.readFileSync(
    path.resolve(__dirname, '../api/CC Ecommerce App.yaml'),
    'utf8'
  )
);

swaggerRouter.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = swaggerRouter;
