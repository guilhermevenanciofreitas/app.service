import { DataTypes } from 'sequelize'

export class ContabilityCategorie {

  id = {
    field: 'id',
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.UUID,
  }

  companyId = {
    field: 'companyId',
    type: DataTypes.UUID,
  }

  name = {
    field: 'name',
    type: DataTypes.STRING(30)
  }

}