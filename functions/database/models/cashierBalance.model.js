import { DataTypes } from 'sequelize';

export class CashierBalance {

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

  cashierId = {
    field: 'cashierId',
    type: DataTypes.UUID,
  }

}