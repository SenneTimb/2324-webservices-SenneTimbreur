const ServiceError = require('../core/serviceError');

const handleDBError = (error) => {
  const { code = '', sqlMessage } = error;

  if (code === 'ER_DUP_ENTRY') {
    switch (true) {
      case sqlMessage.includes('idx_ouder_telefoonnummer'):
        return ServiceError.validationFailed(
          'There is already a user with this phone number'
        );
      default:
        return ServiceError.validationFailed('This item already exists');
    }
  }

  if (code.startsWith('ER_NO_REFERENCED_ROW')) {
    switch (true) {
      case sqlMessage.includes('fk_lid_gezin'):
        return ServiceError.notFound('Dit lid bestaat niet');
      case sqlMessage.includes('fk_gezin_ouder1'):
        return ServiceError.notFound('Ouder1 bestaat niet');
      case sqlMessage.includes('fk_gezin_ouder2'):
        return ServiceError.notFound('Ouder2 bestaat niet');
    }
  }

  // Return error because we don't know what happened
  return error;
};

module.exports = handleDBError; 
