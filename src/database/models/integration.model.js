import { DataTypes } from 'sequelize';

export class Integration {

  id = {
    field: 'id',
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.UUID,
  }

  name = {
    field: 'name',
    type: DataTypes.STRING(50)
  }

  image = {
    field: 'image',
    type: DataTypes.STRING(200)
  }

}