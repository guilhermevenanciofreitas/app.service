import { DataTypes } from 'sequelize'

export class Partner {

  id = {
    field: 'id',
    primaryKey: true,
    type: DataTypes.UUID
  }

  companyId = {
    field: 'companyId',
    type: DataTypes.UUID
  }

  name = {
    field: 'name',
    type: DataTypes.STRING(100)
  }

  surname = {
    field: 'surname',
    type: DataTypes.STRING(100)
  }

}