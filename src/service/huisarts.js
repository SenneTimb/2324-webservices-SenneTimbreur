let HUISARTS_REPO = require('../repository/huisarts');
const handleDBError = require('./_handleDBError');
const ServiceError = require('../core/serviceError'); 
const { log } = require('winston');

const getAll = async () => {
  const items = await HUISARTS_REPO.getAllHuisartsen();
  return {
    items,
    count: items.length,
  };
};


const getById = async (id) =>{
  const huisarts = await HUISARTS_REPO.findById(id);
  if (!huisarts){
    throw ServiceError.notFound(`Huisarts met id ${id} bestaat niet`)
  }
  return huisarts
}

const deleteById = async (id) => {
  try {
    const deleted = await HUISARTS_REPO.deleteById(id);

    if (!deleted) {
      throw ServiceError.notFound(`No user with id ${id} exists`, { id });
    }
  } catch (error) {
    throw handleDBError(error);
  }
};


const create = async ({voornaam, naam, telefoonnummer}) => {
  try{
    const id =  await HUISARTS_REPO.create({voornaam, naam, telefoonnummer});
    return getById(id);
  }catch (error) {
    throw handleDBError(error);
  }

  
}

module.exports = {getAll, deleteById, create, getById}