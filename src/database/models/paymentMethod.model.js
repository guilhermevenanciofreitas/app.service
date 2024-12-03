import { DataTypes } from 'sequelize'

export class PaymentMethod {

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

  currencyMethodId = {
    field: 'currencyMethodId',
    type: DataTypes.UUID
  }

}