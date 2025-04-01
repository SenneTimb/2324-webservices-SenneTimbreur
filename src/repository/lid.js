const c = require('config');
const { tables, getKnex } = require('../data/index');


const SELECT_COLUMNS = [
  `${tables.leden}.id`,
  `${tables.leden}.voornaam`,
  `${tables.leden}.naam`,
  `${tables.leden}.afdeling`,
  `${tables.leden}.geboortedatum`,
  `${tables.huisarts}.id as huisarts_id`,
  `${tables.huisarts}.voornaam as huisarts_voornaam`,
  `${tables.huisarts}.naam as huisarts_naam`,
  `${tables.leiding}.id as leiding_id`,
  `${tables.leiding}.voornaam as leiding_voornaam`,
  `${tables.leiding}.naam as leiding_naam`,
];


const formatLid = ({
  huisarts_id,
  huisarts_naam,
  huisarts_voornaam,
  leiding_id,
  leiding_naam,
  leiding_voornaam,
  ...lid
}) => ({
  ...lid,
  huisarts: {
    id: huisarts_id,
    voornaam: huisarts_voornaam,
    naam: huisarts_naam,
  },
  leiding: {
    id: leiding_id,
    voornaam: leiding_voornaam,
    naam: leiding_naam
  }
});

//Probleem opgelost: joins vergeten
const findById = async (id) => {
  const lid = await getKnex()(tables.leden)
  .join(
      tables.huisarts,
      `${tables.leden}.huisarts_id`,
      '=',
      `${tables.huisarts}.id`,
    )
  .join(
      tables.leiding,
      `${tables.leden}.leiding_id`,
      '=',
      `${tables.leiding}.id`,
    )
    .where(`${tables.leden}.id`, id)
    .first(SELECT_COLUMNS);           
  return formatLid(lid);
};

const findByAfdeling = async (afdeling) => {
  const leden = await getKnex()(tables.leden)
    .where(`${tables.leden}.afdeling`, afdeling)
  return leden;
}

const getAllLeden = async () => {
  const leden = await getKnex()(tables.leden)
  .join(
      tables.huisarts,
      `${tables.leden}.huisarts_id`,
      '=',
      `${tables.huisarts}.id`,
    )
  .join(
      tables.leiding,
      `${tables.leden}.leiding_id`,
      '=',
      `${tables.leiding}.id`,
    )
    .select(SELECT_COLUMNS);
  return leden.map(formatLid)
};

const deleteById = async (id) => {
  try {
    const rowsAffected = await getKnex()(tables.leden).delete().where('id', id);
    console.log(rowsAffected);
    return rowsAffected > 0;
  } catch (error) {
    getLogger().error('Error in deleteById', {
      error,
    });
    throw error;
  }
};

const create = async (lid) =>{
  const createId = await getKnex()(tables.leden).insert({
    voornaam: lid.voornaam,
    naam: lid.naam,
    afdeling: lid.afdeling,
    geboortedatum: lid.geboortedatum,
    leiding_id: Number(lid.leiding_id),
    huisarts_id: Number(lid.huisarts_id)
  });
  const id = createId[0] 
  return findById(id);
  
}

const updateId = async (id,{voornaam, naam, afdeling, geboortedatum}) => {
  await getKnex()(tables.leden)
      .update({
        voornaam,
        naam,
        afdeling,
        geboortedatum
      })
      .where(`${tables.leden}.id`, id);
  return findById(id)
}



module.exports = {
  findById,
  getAllLeden,
  deleteById,
  create,
  updateId,
  findByAfdeling
};