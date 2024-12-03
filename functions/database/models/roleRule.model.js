import { DataTypes } from 'sequelize';

export class RoleRule {

  id = {
    field: 'id',
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.UUID,
  }

  roleId = {
    field: 'roleId',
    type: DataTypes.UUID
  }

  ruleId = {
    field: 'ruleId',
    type: DataTypes.UUID
  }

}