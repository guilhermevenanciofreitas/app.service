import { DataTypes } from 'sequelize';

export class BankAccountStatement {

  id = {
    field: 'id',
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.UUID,
  }

  entryAt = {
    field: 'entryAt',
    type: DataTypes.DECIMAL(18, 2),
  }

  partnerId = {
    field: 'partnerId',
    type: DataTypes.UUID,
  }

  bankAccountId = {
    field: 'bankAccountId',
    type: DataTypes.UUID,
  }

  currencyMethodId = {
    field: 'currencyMethodId',
    type: DataTypes.UUID
  }

  categorieId = {
    field: 'categorieId',
    type: DataTypes.UUID,
  }

  amount = {
    field: 'amount',
    type: DataTypes.DECIMAL(18, 2)
  }

}