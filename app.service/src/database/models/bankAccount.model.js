import Sequelize from 'sequelize';

export class BankAccount {

  id = {
    field: 'codigo_conta_bancaria',
    primaryKey: true,
    autoIncrement: true,
    type: Sequelize.INTEGER,
  }

  companyId = {
    field: 'CodigoEmpresaFilial',
    type: Sequelize.TINYINT,
  }

  /*
  name = {
    field: 'name',
    type: Sequelize.STRING(30),
  }
  */

  bankId = {
    field: 'bankId',
    type: Sequelize.INTEGER,
  }

  agency = {
    field: 'agencia',
    type: Sequelize.STRING(10)
  }

  /*
  agencyDigit = {
    field: 'agencyDigit',
    type: Sequelize.STRING(1)
  }
  */

  account = {
    field: 'numero_conta_bancaria',
    type: Sequelize.STRING(15)
  }

  /*
  accountDigit = {
    field: 'accountDigit',
    type: Sequelize.STRING(1)
  }
  */
 
}