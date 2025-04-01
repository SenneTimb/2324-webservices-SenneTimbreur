const { tables, getKnex } = require('../data/index');
const { getLogger } = require('../core/logging');

const formatGezin = ({ouderId, ouderVoornaam, ouderNaam, lidId, lidVoornaam, lidNaam, ...gezin}) =>{
  return {...gezin,
    ouder: {
      id: ouderId,
      voornaam: ouderVoornaam,
      naam: ouderNaam
    },
    lid: {
      id: lidId,
      voornaam: lidVoornaam,
      naam: lidNaam
    }
  }
}



const SELECT_COLUMNS = [
  `${tables.gezin}.id`,
  `${tables.ouders}.id`,
  `${tables.ouders}.voornaam as ouderVoornaam`,
  `${tables.ouders}.naam as ouderNaam`,
  `${tables.leden}.voornaam as lidVoornaam`,
  `${tables.leden}.naam as lidNaam`,
];

const getAllGezinnen= async () => {
   const gezinnen = await getKnex()(tables.gezin)
    .join(
      tables.ouders,
      `${tables.gezin}.id`,
      '=',
      `${tables.ouders}.id`
    )
    .join(
      tables.leden,
      `${tables.gezin}.id`,
      '=',
      `${tables.leden}.id`
    )
    .select(SELECT_COLUMNS)

  return gezinnen.map(formatGezin);
};

const create = async ({ lid_id, ouder_id}) => {
  try {
    const [id] = await getKnex()(tables.gezin).insert({
      lid_id,
      ouder_id
    });
    return id;
  } catch (error) {
    getLogger().error('Error in create', {
      error,
    });
    throw error;
  }
};

module.exports = {getAllGezinnen, create}