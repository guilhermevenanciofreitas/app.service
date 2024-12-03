import { DataTypes } from 'sequelize'

export class CurrencyMethod {

  id = {
    field: 'id',
    primaryKey: true,
    type: DataTypes.UUID
  }

  name = {
    field: 'name',
    type: DataTypes.STRING(50)
  }

}