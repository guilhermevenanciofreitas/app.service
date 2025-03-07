import { Sequelize } from 'sequelize';

export class StatementData {

  id = {
    field: 'id',
    primaryKey: true,
    autoIncrement: true,
    type: Sequelize.UUIDV4,
  };

  statementId = {
    field: 'statementId',
    type: Sequelize.UUIDV4
  };

  date = {
    field: 'date',
    type: Sequelize.STRING
  };

  description = {
    field: 'description',
    type: Sequelize.STRING(50),
  };

  sourceId = {
    field: 'sourceId',
    type: Sequelize.STRING,
  };

  orderId = {
    field: 'orderId',
    type: Sequelize.STRING,
  };
  
  gross = {
    field: 'gross',
    type: Sequelize.DECIMAL(18, 2)
  };

  coupon = {
    field: 'coupon',
    type: Sequelize.DECIMAL(18, 2)
  };

  fee = {
    field: 'fee',
    type: Sequelize.DECIMAL(18, 2)
  };

  shipping = {
    field: 'shipping',
    type: Sequelize.DECIMAL(18, 2)
  };

  shippingCost = {
    field: 'shippingCost',
    type: Sequelize.DECIMAL(18, 2)
  };

  debit = {
    field: 'debit',
    type: Sequelize.DECIMAL(18, 2)
  };

  credit = {
    field: 'credit',
    type: Sequelize.DECIMAL(18, 2)
  };

  balance = {
    field: 'balance',
    type: Sequelize.DECIMAL(18, 2)
  };

  /*
  data = {
    field: 'data',
    type: DataTypes.JSONB
  };
  */

}