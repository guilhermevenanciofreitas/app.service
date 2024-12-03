import { DataTypes } from 'sequelize';

export class Session {

  id = {
    field: 'id',
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.UUID
  };

  userId = {
    field: 'userId',
    type: DataTypes.UUID
  };

  companyId = {
    field: 'companyId',
    type: DataTypes.UUID
  };

  lastAcess = {
    field: 'lastAcess',
    type: DataTypes.DATE
  };

  expireIn = {
    field: 'expireIn',
    type: DataTypes.INTEGER
  };

}