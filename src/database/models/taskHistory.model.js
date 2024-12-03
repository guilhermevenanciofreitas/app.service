import { DataTypes } from 'sequelize'

export class TaskHistory {

  id = {
    field: 'id',
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.UUID,
  }

  entryAt = {
    field: 'entryAt',
    type: DataTypes.DATE
  }

  taskId = {
    field: 'taskId',
    type: DataTypes.UUID
  }

  finishedAt = {
    field: 'finishedAt',
    type: DataTypes.DATE
  }

  error = {
    field: 'error',
    type: DataTypes.STRING(200)
  }
  
}