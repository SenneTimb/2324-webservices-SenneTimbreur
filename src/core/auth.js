const leidingService = require('../service/leiding');


const requireAuthentication = async (ctx, next) => {
  const { authorization } = ctx.headers; 


  const { authToken, ...session } = await leidingService.checkAndParseSession(
    authorization
  );

  ctx.state.session = session; 
  ctx.state.authToken = authToken; 

  return next(); 
};


const makeRequireRole = (role) => async (ctx, next) => {
  const { roles = [] } = ctx.state.session; 

  leidingService.checkRole(role, roles);
  return next(); 
};

module.exports = {
  requireAuthentication,
  makeRequireRole, 
};
