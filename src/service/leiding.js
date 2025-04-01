let LEIDING_REPO = require('../repository/leiding');
const ServiceError = require('../core/serviceError'); 
const handleDBError = require('./_handleDBError');
const Role = require('../core/roles');
const config = require('config');
const { getLogger } = require('../core/logging');

const { hashPassword, verifyPassword } = require('../core/password'); 
const { generateJWT, verifyJWT } = require('../core/jwt'); 


const getAll = async () => {
  const items = await LEIDING_REPO.getAllLeiding();
  return {
    items,
    count: items.length,
  };
};

const updateById = async (id, { voornaam, naam, afdeling, email, password }) => {
  try {
    const passwordHash = await hashPassword(password);
    await LEIDING_REPO.updateById(id, {
      voornaam, naam, afdeling, email, passwordHash
    });
    return getById(id);
  } catch (error) {
    throw handleDBError(error);
  }
};

const deleteById = async (id) => {
  try {
    const deleted = await LEIDING_REPO.deleteById(id);

    if (!deleted) {
      throw ServiceError.notFound(`No user with id ${id} exists`, { id });
    }
  } catch (error) {
    throw handleDBError(error);
  }
};


const create = async ({voornaam, naam, afdeling, email, password}) => {
  
  try {
    const passwordHash = await hashPassword(password);
    const leidingId = await LEIDING_REPO.create({voornaam, naam, afdeling, email, passwordHash, roles: [Role.leiding]});
    return await LEIDING_REPO.getAllLeiding();
  }
  catch (error) {
    throw handleDBError(error);
  } 
  
}

const makeExposedLeiding = ({ id, naam, voornaam, afdeling, email, roles }) => ({
  id,
  voornaam,
  naam,
  afdeling,
  email,
  roles,
});


const makeLoginData = async (leiding) => {
  const token = await generateJWT(leiding); 
  return {
    leiding: makeExposedLeiding(leiding),
    token,
  }; 
};

const getById = async (id) => {
  const leiding = await LEIDING_REPO.findById(id);

  if (!leiding){
    throw ServiceError.notFound(`Geen leiding met het id ${id} gevonden.`, { id })
  }
  return leiding
}

const register = async (
  {naam,
  voornaam,
  afdeling,
  email, 
  password,
}) => {
  const passwordHash = await hashPassword(password);

  const leidingId = await LEIDING_REPO.create({
    naam,
    voornaam,
    afdeling,
    email,
    passwordHash,
    roles: [Role.USER],
  });

  const leiding = await LEIDING_REPO.findById(leidingId); // 👈 4
  return await makeLoginData(leiding); 
};


const login = async (email, password) => {
  const leiding = await LEIDING_REPO.findByEmail(email); 

  if (!leiding) {
    // DO NOT expose we don't know the leiding
    throw ServiceError.unauthorized(
      'Het opgegeven email en wachtwoord komen niet overeen.'
    );
  }

  const passwordValid = await verifyPassword(password, leiding.password_hash); 

  if (!passwordValid) {
    // DO NOT expose we know the leiding but an invalid password was given
    throw ServiceError.unauthorized(
      'Het opgegeven email en wachtwoord komen niet overeen.'
    );
  }

  return await makeLoginData(leiding); 
};

const checkAndParseSession = async (authHeader) => {
  if (!authHeader) {
    throw ServiceError.unauthorized('You need to be signed in');
  } 

  if (!authHeader.startsWith('Bearer ')) {
    throw ServiceError.unauthorized('Invalid authentication token');
  }

  const authToken = authHeader.substring(7); 
  try {
    const { roles, leidingId } = await verifyJWT(authToken);


    return {
      leidingId,
      roles,
      authToken,
    }; 
  } catch (error) {
    getLogger().error(error.message, { error });
    throw new Error(error.message);
  } 
};

const checkRole = (role, roles) => {
  const hasPermission = roles.includes(role); 

  if (!hasPermission) {
    throw ServiceError.forbidden(
      'You are not allowed to view this part of the application'
    );
  }
};

module.exports = {getAll, deleteById, create, login, getById, register,
  checkAndParseSession, checkRole, updateById }