import { Sequelize } from 'sequelize';

export class StatementDataConciled {

  id = {
    field: 'id',
    primaryKey: true,
    autoIncrement: true,
    type: Sequelize.UUID,
  }
  
  name = {
    field: 'name',
    type: Sequelize.STRING(100)
  }

  statementDataId = {
    field: 'statementDataId',
    type: Sequelize.UUID
  }
  
  receivementId = {
    field: 'receivementId',
    type: Sequelize.UUID
  }

  paymentId = {
    field: 'paymentId',
    type: Sequelize.UUID
  }
  
  paymentCategorieId = {
    field: 'paymentCategorieId',
    type: Sequelize.UUID
  }

  action = {
    field: 'action',
    type: Sequelize.STRING(30)
  }

  type = {
    field: 'type',
    type: Sequelize.STRING(30)
  }

  originId = {
    field: 'originId',
    type: Sequelize.UUID
  }

  destinationId = {
    field: 'destinationId',
    type: Sequelize.UUID
  }

  transferId = {
    field: 'transferId',
    type: Sequelize.STRING(6)
  }

  amount = {
    field: 'amount',
    type: Sequelize.DECIMAL(18, 2)
  }

  fee = {
    field: 'fee',
    type: Sequelize.DECIMAL(18, 2)
  }

  discount = {
    field: 'discount',
    type: Sequelize.DECIMAL(18, 2)
  }

  isConciled = {
    field: 'isConciled',
    type: Sequelize.BOOLEAN
  }

  message = {
    field: 'message',
    type: Sequelize.STRING(150)
  }

}