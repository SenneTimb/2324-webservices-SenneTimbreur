const { tables, getKnex } = require('../data/index');
const { getLogger } = require('../core/logging');


const SELECT_COLUMNS = [
  `${tables.leiding}.id`,
  'naam',
  'voornaam',
  'afdeling',
  'email',
  'password_hash',
  'roles'


];

const getAllLeiding = async () => {
  const leiding = await getKnex()(tables.leiding)
  return leiding;
};

const updateById = async (id, {
      voornaam, naam, afdeling, email, passwordHash}) => {
  try {
    await getKnex()(tables.leiding)
      .update({
        voornaam,
        naam,
        afdeling,
        email,
        password_hash: passwordHash
      })
      .where('id', id);
    return id;
  } catch (error) {
    getLogger().error('Error in updateById', {
      error,
    });
    throw error;
  }
};

const deleteById = async (id) => {
  try {
    const rowsAffected = await getKnex()(tables.leiding).delete().where('id', id);
    return rowsAffected > 0;
  } catch (error) {
    getLogger().error('Error in deleteById', {
      error,
    });
    throw error;
  }
};

const create = async ({
  voornaam,
  naam,
  afdeling,
  email, 
  passwordHash, 
  roles, 
}) => {
  try {
    const [id] = await getKnex()(tables.leiding).insert({
      voornaam,
      naam,
      afdeling,
      email, 
      password_hash: passwordHash, 
      roles: JSON.stringify(roles),
    });
    return id;
  } catch (error) {
    getLogger().error('Error in create', {
      error,
    });
    throw error;
  }
};

const findByEmail = (email) => {
  return getKnex()(tables.leiding).where('email', email).first();
};

const findById = async (id) => {
  const leiding = await getKnex()(tables.leiding)
    .where(`${tables.leiding}.id`, id)
    .first(SELECT_COLUMNS);
  return leiding;
}

module.exports = {deleteById, updateById, getAllLeiding, create, findByEmail, findById}