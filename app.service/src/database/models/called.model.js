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

  priority = {
    field: 'priority',
    type: Sequelize.SMALLINT,
  }

  step = {
    field: 'step',
    type: Sequelize.SMALLINT,
  }

  previsionAt = {
    field: 'previsionAt',
    type: Sequelize.STRING,
  }

  closedAt = {
    field: 'closedAt',
    type: Sequelize.STRING,
  }

  externalProtocol = {
    field: 'externalProtocol',
    type: Sequelize.STRING(25),
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

  observation = {
    field: 'observation',
    type: Sequelize.STRING(500),
  }

}