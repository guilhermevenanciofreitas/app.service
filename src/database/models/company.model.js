import { DataTypes } from 'sequelize';

export class Company {

  id = {
    field: 'id',
    primaryKey: true,
    type: DataTypes.UUID
  };

  name = {
    field: 'name',
    type: DataTypes.STRING(100)
  };

  surname = {
    field: 'surname',
    type: DataTypes.STRING(80)
  };

}