import { DataTypes } from 'sequelize';

export class ReceivementHistory {

  id = {
    field: 'id',
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.UUID,
  }

  receivementId = {
    field: 'receivementId',
    type: DataTypes.UUID
  };

  cashierBalanceStatementId = {
    field: 'cashierBalanceStatementId',
    type: DataTypes.UUID
  }

  bankAccountStatementId = {
    field: 'bankAccountStatementId',
    type: DataTypes.UUID
  }

}