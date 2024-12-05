import { DataTypes } from 'sequelize'

export class User {

  id = {
    field: 'UserId',
    primaryKey: true,
    type: DataTypes.UUID
  }

  login = {
    field: 'UserName',
    type: DataTypes.STRING
  }

  password = {
    field: 'password',
    type: DataTypes.STRING
  }

  inactivatedAt = {
    field: 'inactivatedAt',
    type: DataTypes.DATE
  }

  deletedAt = {
    field: 'deletedAt',
    type: DataTypes.DATE
  }

  status = {
    field: 'status',
    type: DataTypes.STRING
  }

}