import { DataTypes } from 'sequelize';

export class Attachment {

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