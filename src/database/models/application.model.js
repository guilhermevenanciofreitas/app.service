import { DataTypes } from 'sequelize';

export class Application {

  id = {
    field: 'id',
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.UUID,
  };

  name = {
    field: 'name',
    type: DataTypes.STRING(30)
  };

}