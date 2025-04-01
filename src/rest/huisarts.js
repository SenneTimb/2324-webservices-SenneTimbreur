const Router = require('@koa/router');
const huisartsService = require('../service/huisarts');
const Joi = require('joi');
const validate = require('../core/validatie');
const { requireAuthentication } = require('../core/auth');
const { log } = require('winston');

/**
 * @swagger
 * tags:
 *   name: Huisarts
 *   description: Stelt een huisarts voor waar we dan eventueel contact mee kunnen opnemen.
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     Huisarts:
 *       allOf:
 *         - $ref: "#/components/schemas/Base"
 *         - type: object
 *           required:
 *             - id
 *             - voornaam
 *             - naam
 *             - telefoonnummer
 *           properties:
 *             voornaam:
 *               type: string
 *             naam:
 *               type: string
 *             telefoonnummer:
 *               type: integer
 *           example:
 *             $ref: "#/components/examples/Huisarts"
 *     HuisartsenList:
 *       allOf:
 *         - $ref: "#/components/schemas/ListResponse"
 *         - type: object
 *           required:
 *             - items
 *           properties:
 *             items:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Huisarts"
 */

/**
 * @swagger
 * components:
 *    examples:
 *     Huisarts:
 *       id: 11
 *       voornaam: Tom
 *       naam: Smolders
 *       telefoonnummer: 093773947
 *    requestBodies:
 *     Huisarts:
 *       description: Huisarts informatie die opgeslagen moet worden
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
 *             telefoonnummer:
 *               type: integer
 *             required:
 *               - naam
 *               - voornaam
 *               - telefoonnummer
 */


/**
 * @swagger
 * /api/huisartsen:
 *   get:
 *     summary: Geef alle huisartsen
 *     tags:
 *      - Huisarts
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lijst van huisartsen
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/HuisartsenList"
 */
const getAllHuisartsen = async (ctx) => {
  ctx.body = await huisartsService.getAll();
  ctx.status = 200;
};
getAllHuisartsen.validationScheme = null;


/**
 * @swagger
 * /api/huisartsen/{id}:
 *   get:
 *     summary: Geef een huisarts terug
 *     tags:
 *      - Huisarts
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       200:
 *         description: De opgrevragen huisarts
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Huisarts"
 *       403:
 *         description: Je kan deze info enkel ophalen als je een admin bent
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/403Forbidden'
 *       404:
 *         description: Geen huisarts met dit id aanwezig
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/404NotFound'
 */

const findHuisartsById = async (ctx) => {
  ctx.body = await huisartsService.getById(Number(ctx.params.id));
};
findHuisartsById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
}


/**
 * @swagger
 * /api/huisartsen:
 *   post:
 *     summary: Maak een nieuwe huisarts
 *     tags:
 *      - Huisarts
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       $ref: "#/components/requestBodies/Huisarts"
 *     responses:
 *       201:
 *         description: De aangemaakte huisarts
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Huisarts"
 *       400:
 *         description: Data komt niet overeen met het gevraagde
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/400BadRequest'
 */
const create = async (ctx) =>{
  ctx.body = await huisartsService.create({
    ...ctx.request.body,
  })
  ctx.status = 201;
}
create.validationScheme = {
  body:{
    naam: Joi.string().max(255),
    voornaam: Joi.string().max(255),
    telefoonnummer : Joi.string().pattern(/^0\d\/\d{2}\.\d{2}\.\d{2}.\d{1,2}$/)
  }
}

/**
 * @swagger
 * /api/huisarts/{id}:
 *   delete:
 *     summary: Verwijder een huisarts
 *     tags:
 *      - Huisarts
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       204:
 *         description: Geen antwoord, de verwijdering is gelukt
 *       404:
 *         description: Geen huisarts met dit id aanwezig
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/404NotFound'
 */


const deleteHuisartsById = async (ctx) => {
  await huisartsService.deleteById(ctx.params.id);
  ctx.status = 204;
};
deleteHuisartsById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
}

/**
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: '/huisartsen',
  });
  router.delete(
    '/:id',
    validate(deleteHuisartsById.validationScheme),
    deleteHuisartsById,
  );

  router.get(
    '/:id',
    validate(findHuisartsById.validationScheme),
    findHuisartsById
  );

  router.get(
    '/',
    validate(getAllHuisartsen.validationScheme),
    getAllHuisartsen
  );
  router.post(
    '/',
    validate(create.validationScheme),
    create
  );

  app.use(router.routes())
     .use(router.allowedMethods());
};