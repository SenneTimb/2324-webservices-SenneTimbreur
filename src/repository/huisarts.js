const { tables, getKnex } = require('../data/index');


const SELECT_COLUMNS = [
  `${tables.huisarts}.id`,
  'naam',
  'voornaam',
  'telefoonnummer'
];

const getAllHuisartsen = async () => {
  const huisartsen = await getKnex()(tables.huisarts)
  return huisartsen;
};

const findById = async (id) => {
  const huisarts = await getKnex()(tables.huisarts)
    .where(`${tables.huisarts}.id`, id)
    .first();
  return huisarts;
};

const create = async ({voornaam, naam, telefoonnummer}) =>{
  try{
    const [createId] = await getKnex()(tables.huisarts).insert({
    voornaam,
    naam,
    telefoonnummer
      }); 
    return createId;
  }catch (error) {
    getLogger().error('Error in create', {
      error,
    });
    throw error;
  }
  
  
  
}
const deleteById = async (id) => {
  try {
    const rowsAffected = await getKnex()(tables.huisarts).delete().where('id', id);
    return rowsAffected > 0;
  } catch (error) {
    getLogger().error('Error in deleteById', {
      error,
    });
    throw error;
  }
};

module.exports ={getAllHuisartsen, create, deleteById, findById}