import Sequelize from 'sequelize';

export class Called {

  id = {
    field: 'id',
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
    type: Sequelize.UUIDV4,
  }

  companyId = {
    field: 'companyId',
    type: Sequelize.TINYINT
  }

  number = {
    field: 'number',
    type: Sequelize.BIGINT,
  }

  createdAt = {
    field: 'createdAt',
    type: Sequelize.STRING,
  }

  userId = {
    field: 'userId',
    type: Sequelize.UUIDV4,
  }

  responsibleId = {
    field: 'responsibleId',
    type: Sequelize.UUIDV4,
  }

  subject = {
    field: 'subject',
    type: Sequelize.STRING,
  }

  requestedId = {
    field: 'requestedId',
    type: Sequelize.BIGINT,
  }

  reasonId = {
    field: 'reasonId',
    type: Sequelize.UUIDV4,
  }

  occurrenceId = {
    field: 'occurrenceId',
    type: Sequelize.UUIDV4,
  }

  statusId = {
    field: 'statusId',
    type: Sequelize.UUIDV4,
  }

}