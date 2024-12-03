import { DataTypes } from 'sequelize'

export class Cte {

  id = {
    field: 'id',
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.UUID,
  }

  cte = {
    field: 'cte',
    type: DataTypes.JSONB
  }

}