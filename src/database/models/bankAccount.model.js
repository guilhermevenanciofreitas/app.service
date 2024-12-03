import { DataTypes } from 'sequelize';

export class BankAccount {

  id = {
    field: 'id',
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.UUID,
  }

  companyId = {
    field: 'companyId',
    type: DataTypes.UUID,
  }

  name = {
    field: 'name',
    type: DataTypes.STRING(30),
  }

  bankId = {
    field: 'bankId',
    type: DataTypes.UUID,
  }

  agency = {
    field: 'agency',
    type: DataTypes.STRING(4)
  }

  agencyDigit = {
    field: 'agencyDigit',
    type: DataTypes.STRING(1)
  }

  account = {
    field: 'account',
    type: DataTypes.STRING(10)
  }

  accountDigit = {
    field: 'accountDigit',
    type: DataTypes.STRING(1)
  }

  integrationId = {
    field: 'integrationId',
    type: DataTypes.UUID
  }

}