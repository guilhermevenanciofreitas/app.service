import { DataTypes } from 'sequelize';

export class IntegrationSSW {

  id = {
    field: 'id',
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.UUID,
  }

  code = {
    field: 'code',
    type: DataTypes.STRING(10)
  }

}