const Router = require('@koa/router');
const Joi = require('joi');
const lidService = require('../service/lid');
const gezinService = require('../service/gezin');
const validate = require('../core/validatie');
const { requireAuthentication, makeRequireRole } = require('../core/auth');


/**
 * @swagger
 * tags:
 *   name: Leden
 *   description: Stellen leden voor die leiding kregen van iemand en meerdere ouders kunnen hebben.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Lid:
 *       allOf:
 *         - $ref: "#/components/schemas/Base"
 *         - type: object
 *           required:
 *             - id
 *             - voornaam
 *             - naam
 *             - afdeling
 *             - geboortedatum
 *             - huisarts
 *             - leiding
 *           properties:
 *              voornaam:
 *               type: string
 *              naam:
 *               type: string
 *              afdeling:
 *               type: string
 *              date:
 *               type: "string"
 *               format: date-time
 *              huisarts:
 *                 $ref : '#/components/schemas/Huisarts'
 *              leiding:
 *                 $ref : '#/components/schemas/Leiding'
 *           example:
 *             $ref: "#/components/examples/Lid"
 *     LedenList:
 *       allOf:
 *         - $ref: "#/components/schemas/ListResponse"
 *         - type: object
 *           required:
 *             - items
 *           properties:
 *             items:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Lid"
 */

/**
 * @swagger
 * components:
 *    examples:
 *     Lid:
 *       id: 5
 *       voornaam: Lars
 *       naam: Vande Moortele
 *       afdeling: speelclub
 *       geboortedatum: 2021-05-28T00:00:00Z
 *       huisarts:
 *        $ref: '#/components/examples/Huisarts'
 *       leiding:
 *        $ref: '#/components/examples/Leiding'
 *    requestBodies:
 *     Lid:
 *       description: Leden informatie die opgeslagen moet worden
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
 *              geboortedatum:
 *                type: integer
 *                format : "date-time"
 *              afdeling:
 *                 type: string
 *              huisarts_id:
 *                type: integer
 *              ouder_id1:
 *                type: integer
 *              ouder_id2:
 *                type: integer
 *              leiding_id:
 *                type: integer
 *             required:
 *               - naam
 *               - voornaam
 *               - geboortedatum
 *               - afdeling
 *               - huisarts_id
 *               - leiding_id
 */


/**
 * @swagger
 * /api/leden:
 *   get:
 *     summary: Geef alle leden
 *     tags:
 *      - Leden
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lijst van alle leden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LedenList"
 */

const getAllLeden = async (ctx) => {
  ctx.body = await lidService.getAll();
  ctx.status = 200;
};
getAllLeden.validationScheme = null;

/**
 * @swagger
 * /api/leden/{id}:
 *   get:
 *     summary: Geef een lid terug
 *     tags:
 *      - Leden
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       200:
 *         description: Het opgevragen lid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Lid"
 *       403:
 *         description: Je kan deze info enkel ophalen als je een admin bent
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/403Forbidden'
 *       404:
 *         description: Geen lid met dit id aanwezig
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/404NotFound'
 */

const getLiDById = async (ctx) => {
  ctx.body = await lidService.getById(Number(ctx.params.id));
  ctx.status = 200;
}
getLiDById.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive()
  })
}

/**
 * @swagger
 * /api/leden/afdeling/{afdeling}:
 *   get:
 *     summary: Geef leden met dezelfde afdeling terug
 *     tags:
 *      - Leden
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/afdelingParam"
 *     responses:
 *       200:
 *         description: De opgevragen leden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Lid"
 *       403:
 *         description: Je kan deze info enkel ophalen als je een admin bent
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/403Forbidden'
 *       404:
 *         description: Geen lid met deze afdeling aanwezig
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/404NotFound'
 */


const getLidByAfdeling = async (ctx) =>{
  ctx.body = await lidService.getByAfdeling(String(ctx.params.afdeling))
}
getLidByAfdeling.validationScheme = {
  params:{
    afdeling: Joi.string().max(255)
  }
}

/**
 * @swagger
 * /api/leden:
 *   post:
 *     summary: Maak een nieuw lid
 *     tags:
 *      - Leden
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       $ref: "#/components/requestBodies/Lid"
 *     responses:
 *       201:
 *         description: Het aangemaakte lid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Lid"
 *       400:
 *         description: Data komt niet overeen met het gevraagde
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/400BadRequest'
 */


const create = async (ctx) =>{
  const {naam, voornaam, geboortedatum, afdeling, ouder_id1, ouder_id2, leiding_id, huisarts_id} = {...ctx.request.body};
  const lid = await lidService.create({
    naam: naam,
    voornaam: voornaam,
    afdeling: afdeling,
    geboortedatum: new Date(geboortedatum),
    leiding_id: leiding_id,
    huisarts_id: huisarts_id
  })
  console.log(lid);
  if (ouder_id1){
    await gezinService.create({
    lid_id : lid.id,
    ouder_id : Number(ouder_id1),
  })
  }
  if(ouder_id2){
    await gezinService.create({
    lid_id: lid.id,
    ouder_id: Number(ouder_id2)
  })
  }
  
  ctx.status = 201;
  ctx.body = lid;
}
create.validationScheme = {
  body:{
    geboortedatum: Joi.date().iso().less('now'),
    naam: Joi.string().max(255),
    voornaam: Joi.string().max(255),
    afdeling: Joi.string().max(255),
    leiding_id: Joi.number(),
    huisarts_id: Joi.number()
  }
}


/**
 * @swagger
 * /api/leden/{id}:
 *   delete:
 *     summary: Verwijder een lid
 *     tags:
 *      - Leden
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       204:
 *         description: Geen antwoord, de verwijdering is gelukt
 *       404:
 *         description: Geen lid met dit id aanwezig
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/404NotFound'
 */

const deleteById = async(ctx) =>{
  ctx.body = await lidService.deleteById(
    Number(ctx.params.id)
  )
  ctx.status = 204
}
deleteById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * @swagger
 * /api/lid/{id}:
 *   put:
 *     summary: Update een bestaand lid
 *     tags:
 *      - Leden
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       200:
 *         description: Het geupdate lid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Lid"
 *       404:
 *         description: Geen lid met id aanwezig
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/404NotFound'
 */

const updateId = async(ctx) =>{
  ctx.body = await lidService.updateId(Number(ctx.params.id),{
    ...ctx.request.body, 
    geboortedatum: new Date(ctx.request.body.geboortedatum)})
  ctx.status = 200;
}
updateId.validationScheme = {
  params:{
    id: Joi.number().integer().positive()
  },
  body: {
    geboortedatum: Joi.date().iso().less('now'),
    naam: Joi.string().max(255),
    voornaam: Joi.string().max(255),
    afdeling: Joi.string().max(255)
  }
}






/**
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: '/leden',
  });

  router.get(
    '/',
    requireAuthentication,
    validate(getAllLeden.validationScheme),
    getAllLeden
  );
  router.get(
    '/:id',
    requireAuthentication,
    validate(getLiDById.validationScheme),
    getLiDById
  );
  router.get(
    '/afdeling/:afdeling',
    requireAuthentication,
    validate(getLidByAfdeling.validationScheme),
    getLidByAfdeling
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
  router.put(
    '/:id',
    requireAuthentication,
    validate(updateId.validationScheme),
    updateId
  );

  app.use(router.routes())
     .use(router.allowedMethods());
};