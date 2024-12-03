import { DataTypes } from 'sequelize'

export class Receivement {

  id = {
    field: 'id',
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.UUID,
  }

  companyId = {
    field: 'companyId',
    type: DataTypes.UUID
  }

  documentNumber = {
    field: 'documentNumber',
    type: DataTypes.STRING(15)
  }

  payerId = {
    field: 'payerId',
    type: DataTypes.UUID
  }

  categorieId = {
    field: 'categorieId',
    type: DataTypes.UUID
  }

  currencyMethodId = {
    field: 'currencyMethodId',
    type: DataTypes.UUID
  }

  issueDate = {
    field: 'issueDate',
    type: DataTypes.DATE
  }

  dueDate = {
    field: 'dueDate',
    type: DataTypes.DATE
  }

  bankAccountId = {
    field: 'bankAccountId',
    type: DataTypes.UUID
  }

  /*
  cashierBalanceId = {
    field: 'cashierBalanceId',
    type: DataTypes.UUID
  }
  */

  amount = {
    field: 'amount',
    type: DataTypes.DECIMAL(18, 2)
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