import { DataTypes } from 'sequelize';

export class Statement {

  id = {
    field: 'id',
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.UUID
  }

  bankAccountId = {
    field: 'bankAccountId',
    type: DataTypes.UUID,
  }

  sourceId = {
    field: 'sourceId',
    type: DataTypes.STRING,
  }

  createdAt = {
    field: 'createdAt',
    type: DataTypes.DATE
  }

  begin = {
    field: 'begin',
    type: DataTypes.DATE
  }

  end = {
    field: 'end',
    type: DataTypes.DATE
  }

}