import { DataTypes } from 'sequelize'

export class TaskMethod {

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

}