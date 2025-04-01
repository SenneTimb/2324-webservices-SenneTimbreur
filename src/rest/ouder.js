const Router = require('@koa/router');
const ouderService = require('../service/ouder');
const Joi = require('joi');
const validate = require('../core/validatie');
const { requireAuthentication } = require('../core/auth');

/**
 * @swagger
 * tags:
 *   name: Ouders
 *   description: Ouders die meerdere leden kunnen hebben. (leden kunnen ook meerdere ouders hebben)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Ouders:
 *       allOf:
 *         - $ref: "#/components/schemas/Base"
 *         - type: object
 *           required:
 *             - id
 *             - voornaam
 *             - naam
 *             - telefoonnummer
 *           properties:
 *              voornaam:
 *               type: string
 *              naam:
 *               type: string
 *              telefoonnummer:
 *                type: integer
 *           example:
 *             $ref: "#/components/examples/Ouders"
 *     OudersList:
 *       allOf:
 *         - $ref: "#/components/schemas/ListResponse"
 *         - type: object
 *           required:
 *             - items
 *           properties:
 *             items:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Ouders"
 */

/**
 * @swagger
 * components:
 *    examples:
 *     Ouders:
 *       id: 8
 *       voornaam: Jens
 *       naam: Vande Moortele
 *       telefoonnumer: 0497574075
 *    requestBodies:
 *     Ouders:
 *       description: Ouders informatie die opgeslagen moet worden
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              voornaam:
 *                 type: string
 *              naam:
 *                 type: string
 *              telefoonnummer:
 *                 type: integer
 *             required:
 *               - naam
 *               - voornaam
 *               - telefoonnummer
 */

/**
 * @swagger
 * /api/ouders:
 *   get:
 *     summary: Geef alle ouders
 *     tags:
 *      - Ouders
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lijst van alle ouders
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/OudersList"
 */

const getAllOuders = async (ctx) => {
  ctx.body = await ouderService.getAll();
  ctx.status = 200;
};
getAllOuders.validationScheme = null ;

/**
 * @swagger
 * /api/ouders:
 *   post:
 *     summary: Maak een nieuwe ouder
 *     tags:
 *      - Ouders
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       $ref: "#/components/requestBodies/Ouders"
 *     responses:
 *       201:
 *         description: De aangemaakte ouder
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Ouder"
 *       400:
 *         description: Data komt niet overeen met het gevraagde
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/400BadRequest'
 */

const create = async (ctx) =>{
  ctx.body = await ouderService.create({
    ...ctx.request.body,
  })
  ctx.status = 201;
}
create.validationScheme = {
  body:{
    naam: Joi.string().max(255),
    voornaam: Joi.string().max(255),
    telefoonnummer: Joi.string().pattern(/^0\d\/\d{2}\.\d{2}\.\d{2}.\d{1,2}$/)
  }
}

/**
 * @swagger
 * /api/ouders/{id}:
 *   delete:
 *     summary: Verwijder een ouder
 *     tags:
 *      - Ouders
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       204:
 *         description: Geen antwoord, de verwijdering is gelukt
 *       404:
 *         description: Geen ouder met dit id aanwezig
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/404NotFound'
 */

const deleteById = async(ctx) =>{
  ctx.body = await ouderService.deleteById(
    Number(ctx.params.id)
  )
  console.log(Number(ctx.params.id));
  ctx.status = 204
}
deleteById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: '/ouders',
  });

  router.get(
    '/',
    requireAuthentication,
    validate(getAllOuders.validationScheme),
    getAllOuders
  );
  router.post(
    '/',
    requireAuthentication,
    validate(create.validationScheme),
    create
  );
  router.delete(
    '/:id',
    requireAuthentication,
    validate(deleteById.validationScheme),
    deleteById
  );

  app.use(router.routes())
     .use(router.allowedMethods());
};