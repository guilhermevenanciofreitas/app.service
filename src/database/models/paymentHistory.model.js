import { DataTypes } from 'sequelize'

export class PaymentHistory {

  id = {
    field: 'id',
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.UUID,
  }

  paymentId = {
    field: 'paymentId',
    type: DataTypes.UUID
  }

  cashierBalanceStatementId = {
    field: 'cashierBalanceStatementId',
    type: DataTypes.UUID
  }

  bankAccountStatementId = {
    field: 'bankAccountStatementId',
    type: DataTypes.UUID
  }

}