const Router = require('@koa/router');
const installLidRouter = require('./lid');
const installHealthRouter = require("./health")
const installOuderRouter = require("./ouder")
const installLeidingRouter = require("./leiding")
const installHuisartsRouter = require("./huisarts")

/**
 * @swagger
 * components:
 *   schemas:
 *     Base:
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: integer
 *           format: "int32"
 *       example:
 *         id: 123
 *     ListResponse:
 *       required:
 *         - count
 *       properties:
 *         count:
 *           type: integer
 *           description: Number of items returned
 *           example: 1
 */

/**
 * @swagger
 * components:
 *   parameters:
 *     idParam:
 *       in: path
 *       name: id
 *       description: Id of the item to fetch/update/delete
 *       required: true
 *       schema:
 *         type: integer
 *         format: "int32"
 *     afdelingParam:
 *          in: path
 *          name: afdeling
 *          description: Afdeling van een lid
 *          required: true
 *          schema:
 *            type: string
 */

/**
 * @swagger
 * components:
 *   responses:
 *     404NotFound:
 *       title: 404NotFound
 *       description: The request resource kan niet gevonden worden
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - details
 *             properties:
 *               code:
 *                 type: string
 *               details:
 *                 type: string
 *                 description: Extra information over de specifieke not found error
 *               stack:
 *                 type: string
 *                 description: Stack trace (only available if set in configuration)
 *             example:
 *               code: "NOT_FOUND"
 *               details: "Leiding met dit id bestaat niet."
 */

/**
 * @swagger
 * components:
 *   responses:
 *     400BadRequest:
 *       title: 400BadRequest
 *       description: Je hebt verkeerde data doorgegeven
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - details
 *             properties:
 *               code:
 *                 type: string
 *               details:
 *                 type: string
 *                 description: Extra information over de bad request error 
 *               stack:
 *                 type: string
 *                 description: Stack trace (only available if set in configuration)
 *             example:
 *               code: "VALIDATION_FAILED"
 *               details: "Geboortedatum moet voor vandaag liggen."
 */

/**
 * @swagger
 * components:
 *   responses:
 *     403Forbidden:
 *       title: 403Forbidden
 *       description: Je hebt geen toegang tot deze resource
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - details
 *             properties:
 *               code:
 *                 type: string
 *               details:
 *                 type: string
 *                 description: Extra info over de specifieke forbidden error
 *               stack:
 *                 type: string
 *                 description: Stack trace (only available if set in configuration)
 *             example:
 *               code: "FORBIDDEN"
 *               details: "Je hebt geen toegang tot deze bron"
 */



/**
 * Install all routes in the given Koa application.
 *
 * @param {Koa} app - The Koa application.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: '/api',
  });
  
  installLidRouter(router)
  installHealthRouter(router);
  installOuderRouter(router);
  installLeidingRouter(router);
  installHuisartsRouter(router);
  
  app.use(router.routes())
     .use(router.allowedMethods());
};
