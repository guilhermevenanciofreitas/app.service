import { DataTypes } from 'sequelize';

export class Rule {

  id = {
    field: 'id',
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.UUID,
  };

  description = {
    field: 'description',
    type: DataTypes.STRING(100)
  };

}