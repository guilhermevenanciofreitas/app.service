import { DataTypes } from 'sequelize'

export class Task {

  id = {
    field: 'id',
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.UUID,
  }

  companyId = {
    field: 'companyId',
    type: DataTypes.UUID
  }

  schedule = {
    field: 'schedule',
    type: DataTypes.STRING(20)
  }
  
  methodId = {
    field: 'methodId',
    type: DataTypes.UUID
  }

  arguments = {
    field: 'arguments',
    type: DataTypes.JSONB
  }

  inactivatedAt = {
    field: 'inactivatedAt',
    type: DataTypes.DATE
  }

  deletedAt = {
    field: 'deletedAt',
    type: DataTypes.DATE
  }

  status = {
    field: 'status',
    type: DataTypes.STRING
  }

}