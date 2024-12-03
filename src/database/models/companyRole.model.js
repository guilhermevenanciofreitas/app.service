import { DataTypes } from 'sequelize';

export class CompanyRole {

  id = {
    field: 'id',
    primaryKey: true,
    type: DataTypes.UUID
  };

  companyId = {
    field: 'companyId',
    type: DataTypes.UUID
  };

  roleId = {
    field: 'roleId',
    type: DataTypes.UUID
  };

}