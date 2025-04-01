const { tables, getKnex } = require('../data/index');


const SELECT_COLUMNS = [
  `${tables.ouders}.id`,
  'naam',
  'voornaam',
  'telefoonnummer'
];

const getAllOuders = async () => {
  const ouders = await getKnex()(tables.ouders)
  return ouders;
};

const create = async ({voornaam, naam, telefoonnummer}) =>{
  const [createId] = await getKnex()(tables.ouders).insert({
    voornaam,
    naam,
    telefoonnummer
  }); 
  return createId;
  
}

const deleteById = async (id) => {
  try {
    const rowsAffected = await getKnex()(tables.ouders).delete().where('id', id);
    return rowsAffected > 0;
  } catch (error) {
    getLogger().error('Error in deleteById', {
      error,
    });
    throw error;
  }
};

module.exports ={getAllOuders, create, deleteById}