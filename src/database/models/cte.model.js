import { DataTypes } from 'sequelize'

export class Cte {

  id = {
    field: 'id',
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.BIGINT,
  }

  tripId = {
    field: 'IdViagem',
    type: DataTypes.BIGINT
  }

  takerId = {
    field: 'IdTomador',
    type: DataTypes.BIGINT
  }

  shippimentId = {
    field: 'IDCarga',
    type: DataTypes.BIGINT
  }

  dhEmi = {
    field: 'dhEmi',
    type: DataTypes.STRING
  }

  nCT = {
    field: 'nCT',
    type: DataTypes.SMALLINT
  }

  serieCT = {
    field: 'serieCT',
    type: DataTypes.BIGINT
  }

  chaveCT = {
    field: 'ChaveCT',
    type: DataTypes.STRING(44)
  }

  tpCTe = {
    field: 'tpCTe',
    type: DataTypes.SMALLINT
  }

  CFOP = {
    field: 'CFOP',
    type: DataTypes.INTEGER
  }

  cStat = {
    field: 'cStat',
    type: DataTypes.INTEGER
  }

  nProt = {
    field: 'nProt',
    type: DataTypes.STRING
  }
  
  dhRecbto = {
    field: 'dhRecbto',
    type: DataTypes.STRING
  }

  vTPrest = {
    field: 'vTPrest',
    type: DataTypes.DECIMAL
  }

  valorAReceber = {
    field: 'valorAReceber',
    type: DataTypes.DECIMAL
  }

  codigoUnidade = {
    field: 'codigoUnidade',
    type: DataTypes.SMALLINT
  }

  baseCalculo = {
    field: 'baseCalculo',
    type: DataTypes.DECIMAL
  }

  pRedBC = {
    field: 'pRedBC',
    type: DataTypes.DECIMAL
  }

  pICMS = {
    field: 'pICMS',
    type: DataTypes.DECIMAL
  }

  recipientId = {
    field: 'IDCliente',
    type: DataTypes.BIGINT
  }

  xml = {
    field: 'Xml',
    type: DataTypes.BLOB
  }

}