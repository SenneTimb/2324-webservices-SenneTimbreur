let GEZIN_REPO = require('../repository/gezin')

const getAll = async () => {
  return await GEZIN_REPO.getAllGezinnen();
}


const create = async ({lid_id, ouder_id}) => {
  const nieuwGezin= {lid_id:lid_id, ouder_id:ouder_id};
  return await GEZIN_REPO.create(nieuwGezin);
}

module.exports = {getAll, create}