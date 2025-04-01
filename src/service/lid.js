let LEDEN_REPO = require('../repository/lid');
const ServiceError = require('../core/serviceError'); 
const handleDBError = require('./_handleDBError');

const getAll = async () => {
  const items = await LEDEN_REPO.getAllLeden();
  return {
    items,
    count: items.length,
  };
};
const getById = async (id) =>{
  const lid = await LEDEN_REPO.findById(id);

  if (!lid){
    throw ServiceError.notFound(`Geen lid met het id ${id} gevonden.`, { id })
  }
  return lid
}
const getByAfdeling = async (afdeling) => {
  const leden = await LEDEN_REPO.findByAfdeling(afdeling);
  if (leden.length === 0){
    throw ServiceError.notFound(`Geen leden gevonden met afdeling ${afdeling}`, {afdeling})
  }
  return leden;
}
const create = async ({voornaam, naam, afdeling, geboortedatum, leiding_id, huisarts_id}) => {
  const nieuwLid = {voornaam: voornaam, naam: naam, afdeling: afdeling, geboortedatum: geboortedatum, leiding_id: leiding_id, huisarts_id: huisarts_id};
  console.log(nieuwLid);
  return await LEDEN_REPO.create(nieuwLid);
}
const deleteById = async (id) =>{
  return await LEDEN_REPO.deleteById(id);
}

const updateId = async (id, {voornaam, naam, afdeling, geboortedatum}) =>{
  return await LEDEN_REPO.updateId(id, {voornaam, naam, afdeling, geboortedatum});
}

module.exports = {getAll, getById, getByAfdeling, create, deleteById, updateId};