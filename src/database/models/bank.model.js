import { DataTypes } from 'sequelize'

export class Bank {

  id = {
    field: 'id',
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.UUID,
  }

  name = {
    field: 'name',
    type: DataTypes.STRING(30)
  }

  image = {
    field: 'image',
    type: DataTypes.STRING(200)
  }

}