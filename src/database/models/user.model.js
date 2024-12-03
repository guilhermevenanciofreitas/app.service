import { DataTypes } from 'sequelize'

export class User {

  id = {
    field: 'id',
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.UUID,
  }

  name = {
    field: 'name',
    type: DataTypes.STRING(100)
  }

  email = {
    field: 'email',
    type: DataTypes.STRING(80)
  }

  password = {
    field: 'password',
    type: DataTypes.STRING(15)
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