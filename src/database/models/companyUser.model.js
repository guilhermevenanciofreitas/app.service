import { DataTypes } from 'sequelize'

export class CompanyUser {

  id = {
    field: 'id',
    primaryKey: true,
    type: DataTypes.UUID
  }

  companyId = {
    field: 'companyId',
    type: DataTypes.UUID
  }

  userId = {
    field: 'userId',
    type: DataTypes.UUID
  }

  roleId = {
    field: 'roleId',
    type: DataTypes.UUID
  }

}