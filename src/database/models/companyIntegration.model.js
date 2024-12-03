import { DataTypes } from 'sequelize';

export class CompanyIntegration {

  id = {
    field: 'id',
    primaryKey: true,
    type: DataTypes.UUID
  }

  companyId = {
    field: 'companyId',
    type: DataTypes.UUID
  }

  integrationId = {
    field: 'integrationId',
    type: DataTypes.UUID
  }

  options = {
    field: 'options',
    type: DataTypes.JSONB
  }

}