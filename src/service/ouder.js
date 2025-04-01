let OUDER_REPO = require('../repository/ouder')
const handleDBError = require('./_handleDBError');
const ServiceError = require('../core/serviceError');

const getAll = async () => {
  const items = await OUDER_REPO.getAllOuders();
  return {
    items,
    count: items.length,
  };
};

const deleteById = async (id) => {
  try {
    console.log(await OUDER_REPO.getAllOuders());
    const deleted = await OUDER_REPO.deleteById(id);

    if (!deleted) {
      throw ServiceError.notFound(`No user with id ${id} exists`, { id });
    }
  } catch (error) {
    throw handleDBError(error);
  }
};


const create = async ({voornaam, naam, telefoonnummer}) => {
  const nieuwOuder = {voornaam: voornaam, naam: naam, telefoonnummer: telefoonnummer};
  await OUDER_REPO.create(nieuwOuder);
  const ouders = await OUDER_REPO.getAllOuders();
  return ouders[ouders.length -1]
}

module.exports = {getAll, create, deleteById}