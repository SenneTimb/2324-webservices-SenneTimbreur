const Router = require('@koa/router');
const Joi = require('joi');
const leidingService = require('../service/leiding');
const validate = require('../core/validatie');
const { requireAuthentication, makeRequireRole } = require('../core/auth');
const Role = require('../core/roles');

/**
 * Check if the signed in user can access the given user's information.
 */
const checkLeidingId = (ctx, next) => {
  const { LeidingId, roles } = ctx.state.session;
  const { id } = ctx.params;

  // You can only get our own data unless you're an admin
  if (id !== LeidingId && !roles.includes(Role.ADMIN)) {
    return ctx.throw(
      403,
      "You are not allowed to view this user's information",
      {
        code: 'FORBIDDEN',
      }
    );
  }
  return next();
};


/**
 * @swagger
 * tags:
 *   name: Leiding
 *   description: Leiding die zich inlogt en andere dingen kan toevoegen.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Leiding:
 *       allOf:
 *         - $ref: "#/components/schemas/Base"
 *         - type: object
 *           required:
 *             - id
 *             - voornaam
 *             - naam
 *             - afdeling
 *             - email
 *           properties:
 *             voornaam:
 *               type: string
 *             naam:
 *               type: string
 *             afdeling:
 *               type: string
 *             email:
 *               type: string
 *               format: email
 *           example:
 *             $ref: "#/components/examples/Leiding"
 *     LeidingList:
 *       allOf:
 *         - $ref: "#/components/schemas/ListResponse"
 *         - type: object
 *           required:
 *             - items
 *           properties:
 *             items:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Leiding"
 */

/**
 * @swagger
 * components:
 *    responses:
 *     LoginResponse:
 *       description: Leiding en JWT token
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               leiding:
 *                 $ref: "#/components/schemas/Leiding"
 *               token:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsZWlkaW5nSWQiOjMsInJvbGVzIjpbInVzZXIiXSwiaWF0IjoxNzAzMTUyNjQzLCJleHAiOjE3MDMxNTYyNDMsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTE3MyIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6OTAwMCIsInN1YiI6ImF1dGgifQ.7_uagU7Uq2UruiaJGxQjrDvK2MIzeH49LQrfwb5F6r4"
 */

/**
 * @swagger
 * components:
 *    examples:
 *      Leiding:
 *        id: 1
 *        voornaam: Senne
 *        naam: Timbreur
 *        afdeling: keti
 *        email: senne.timbreur@gmail.com
 */

/**
 * @swagger
 * /api/leiding:
 *   get:
 *     summary: Geef alle leiding
 *     tags:
 *      - Leiding
 *     responses:
 *       200:
 *         description: Lijst van leiding
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LeidingList"
 */

const getAllLeiding = async (ctx) => {
  const leiding = await leidingService.getAll();
  ctx.body = leiding;
};
getAllLeiding.validationScheme = null;


/**
 * @swagger
 * /api/leiding/login:
 *   post:
 *     summary: Probeer in te loggen
 *     tags:
 *      - Leiding
 *     requestBody:
 *       description: Email en wachtwoord van leiding nodig om in te loggen
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Leiding en JWT token
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/responses/LoginResponse'
 *              example:
 *                 leiding:
 *                   id: 1
 *                   voornaam: Senne
 *                   naam: Timbreur
 *                   afdeling: keti
 *                   email: senne.timbreur@gmail.com
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsZWlkaW5nSWQiOjMsInJvbGVzIjpbInVzZXIiXSwiaWF0IjoxNzAzMTUyNjQzLCJleHAiOjE3MDMxNTYyNDMsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTE3MyIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6OTAwMCIsInN1YiI6ImF1dGgifQ.7_uagU7Uq2UruiaJGxQjrDvK2MIzeH49LQrfwb5F6r4"
 *       400:
 *         description: Data die je meestuurd is incorrect
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/400BadRequest'
 *       401:
 *         description: Credentials zijn niet correct
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - code
 *                 - details
 *               properties:
 *                 code:
 *                   type: string
 *                 details:
 *                   type: string
 *                   description:  Extra information over de specifieke error
 *                 stack:
 *                   type: string
 *                   description: Stack trace (only available if set in configuration)
 *               example:
 *                 code: "UNAUTHORIZED"
 *                 details: "Het opgegeven email en wachtwoord komen niet overeen"
 */

const login = async (ctx) => {
  const { email, password } = ctx.request.body; 
  const token = await leidingService.login(email, password); 
  ctx.body = token; 
};
login.validationScheme = {
  body: {
    email: Joi.string().email(),
    password: Joi.string(),
  },
};


/**
 * @swagger
 * /api/leiding/register:
 *   post:
 *     summary: Maak een nieuwe leiding aan
 *     tags:
 *      - Leiding
 *     requestBody:
 *       description: Data van de leiding
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               voornaam:
 *                 type: string
 *               naam:
 *                 type: string
 *               afdeling:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Leiding en JWT token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/LoginResponse'
 *             example:
 *                 leiding:
 *                   id: 1
 *                   voornaam: Senne
 *                   naam: Timbreur
 *                   afdeling: keti
 *                   email: senne.timbreur@gmail.com
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsZWlkaW5nSWQiOjMsInJvbGVzIjpbInVzZXIiXSwiaWF0IjoxNzAzMTUyNjQzLCJleHAiOjE3MDMxNTYyNDMsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTE3MyIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6OTAwMCIsInN1YiI6ImF1dGgifQ.7_uagU7Uq2UruiaJGxQjrDvK2MIzeH49LQrfwb5F6r4"
 *       400:
 *         description: Meegegeven data is incorrect
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/400BadRequest'
 */

const register = async (ctx) => {
  const token = await leidingService.register(ctx.request.body);
  ctx.body = token; 
  ctx.status = 200; 
}
register.validationScheme = {
  body: {
    naam: Joi.string().max(255),
    voornaam: Joi.string().max(255),
    afdeling: Joi.string().max(255),
    email: Joi.string().email(),
    password: Joi.string().min(8).max(30),
  },
}


/**
 * @swagger
 * /api/leiding/{id}:
 *   get:
 *     summary: Geef een enkele leiding terug
 *     tags:
 *      - Leiding
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       200:
 *         description: De opgevragen leider/leidster
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Leiding"
 *       403:
 *         description: Je kan deze info enkel ophalen als je een admin bent
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/403Forbidden'
 *       404:
 *         description: Geen leiding met dit id aanwezig
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/404NotFound'
 */


const getLeidingById = async (ctx) => {
  ctx.body = await leidingService.getById(Number(ctx.params.id));
  ctx.status = 200;
}
getLeidingById.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive()
  })
}

/**
 * @swagger
 * /api/leiding/{id}:
 *   put:
 *     summary: Update een bestaande leider/leidster
 *     tags:
 *      - Leiding
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       200:
 *         description: De geupdate leider/leidster
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Leiding"
 *       403:
 *         description: Je kan enkel je eigen info update of die van iedereen indien je admin bent
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/403Forbidden'
 *       404:
 *         description: Geen leider/leidster met id aanwezig
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/404NotFound'
 */

const updateLeidingById = async (ctx) => {
  const leiding = await leidingService.updateById(ctx.params.id, ctx.request.body);
  ctx.status = 200;
  ctx.body = leiding;
};
updateLeidingById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
  body: {
    voornaam: Joi.string().max(255),
    naam: Joi.string().max(255),
    afdeling: Joi.string().max(255),
    email: Joi.string().email(),
    password: Joi.string().min(8).max(30),
  },
};

/**
 * @swagger
 * /api/leiding/{id}:
 *   delete:
 *     summary: Verwijder een leider(ster)
 *     tags:
 *      - Leiding
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       204:
 *         description: Geen antwoord, de verwijdering is gelukt
 *       403:
 *         description: Je kan geen andere leiding verwijderen tenzij je admin bent
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/403Forbidden'
 *       404:
 *         description: Geen leider/leidster met dit id aanwezig
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/404NotFound'
 */

const deleteLeidingById = async (ctx) => {
  await leidingService.deleteById(ctx.params.id);
  ctx.status = 204;
};
deleteLeidingById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
}


/**
 * Install user routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = function installLeidingRoutes(app) {
  const router = new Router({
    prefix: '/leiding',
  });
  //public routes
  router.get(
    '/',
    validate(getAllLeiding.validationScheme),
    getAllLeiding
  );
  router.post(
    '/login',
    validate(login.validationScheme),
    login
  );
  router.post(
    '/register',
    validate(register.validationScheme),
    register
  );

  // routes with authentication
  const requireAdmin = makeRequireRole(Role.ADMIN);
  router.put(
    '/:id',
    requireAuthentication,
    validate(updateLeidingById.validationScheme),
    checkLeidingId,
    updateLeidingById,
  );
  router.delete(
    '/:id',
    requireAuthentication,
    validate(deleteLeidingById.validationScheme),
    checkLeidingId,
    deleteLeidingById,
  );
  router.get(
    '/:id',
    requireAuthentication,
    requireAdmin,
    validate(getLeidingById.validationScheme),
    checkLeidingId,
    getLeidingById,
  );

  app.use(router.routes()).use(router.allowedMethods())

}