import Sequelize from 'sequelize';

export class Called {

  id = {
    field: 'id',
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
    type: Sequelize.UUIDV4,
  }

  openedDate = {
    field: 'openedDate',
    type: Sequelize.DATE,
  }

  reasonId = {
    field: 'reasonId',
    type: Sequelize.UUIDV4,
  }

  occurrenceId = {
    field: 'occurrenceId',
    type: Sequelize.UUIDV4,
  }

  responsibleId = {
    field: 'responsibleId',
    type: Sequelize.UUIDV4,
  }

  requestedId = {
    field: 'requestedId',
    type: Sequelize.BIGINT,
  }

  subject = {
    field: 'subject',
    type: Sequelize.STRING,
  }

  detail = {
    field: 'detail',
    type: Sequelize.STRING,
  }

}