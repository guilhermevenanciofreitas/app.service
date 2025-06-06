import Sequelize from 'sequelize'

export class Payment {

  id = {
    field: 'codigo_movimento_detalhe',
    primaryKey: true,
    autoIncrement: true,
    type: Sequelize.BIGINT,
  }

  /*
  companyId = {
    field: 'companyId',
    type: Sequelize.UUID
  }

  documentNumber = {
    field: 'documentNumber',
    type: Sequelize.STRING(15)
  }

  beneficiaryId = {
    field: 'beneficiaryId',
    type: Sequelize.UUID
  }

  categorieId = {
    field: 'categorieId',
    type: Sequelize.UUID
  }

  currencyMethodId = {
    field: 'currencyMethodId',
    type: Sequelize.UUID
  }

  issueDate = {
    field: 'issueDate',
    type: Sequelize.DATE
  }

  dueDate = {
    field: 'dueDate',
    type: Sequelize.DATE
  }

  bankAccountId = {
    field: 'bankAccountId',
    type: Sequelize.UUID
  }

  /*
  cashierBalanceId = {
    field: 'cashierBalanceId',
    type: DataTypes.UUID
  }
  */

  amount = {
    field: 'valor_parcela',
    type: Sequelize.DECIMAL(18, 2)
  }

  /*
  fee = {
    field: 'fee',
    type: DataTypes.DECIMAL(18, 2)
  }

  discount = {
    field: 'discount',
    type: DataTypes.DECIMAL(18, 2)
  }
  */

}