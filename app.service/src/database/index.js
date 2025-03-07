import { Sequelize } from 'sequelize'
import tedious from 'tedious'
import 'dotenv/config'

import { Company } from './models/company.model.js'
import { CompanyRole } from './models/companyRole.model.js'
import { CompanyUser } from './models/companyUser.model.js'
import { Integration } from './models/integration.model.js'
import { Bank } from './models/bank.model.js'
import { BankAccount } from './models/bankAccount.model.js'
import { Product } from './models/product.model.js'
import { Session } from './models/session.model.js'
import { User } from './models/user.model.js'
import { Role } from './models/role.model.js'
import { RoleRule } from './models/roleRule.model.js'
import { Rule } from './models/rule.model.js'
import { Statement } from './models/statement.model.js'
import { Cashier } from './models/cashier.model.js'
import { CompanyIntegration } from './models/companyIntegration.model.js'
import { ContabilityCategorie } from './models/contabilityCategorie.model.js'
import { Payment } from './models/payment.model.js'
import { Partner } from './models/partner.model.js'
import { PaymentMethod } from './models/paymentMethod.model.js'
import { Receivement } from './models/receivement.model.js'
import { ReceivementMethod } from './models/reeceivementMethod.model.js'
import { CurrencyMethod } from './models/currencyMethod.model.js'
import { BankAccountStatement } from './models/bankAccountStatement.model.js'
import { Cte } from './models/cte.model.js'
import { TaskMethod } from './models/taskMethod.model.js'
import { Task } from './models/task.model.js'
import { TaskHistory } from './models/taskHistory.model.js'
import { Shippiment } from './models/shippiment.model.js'
import { ReceivementInstallment } from './models/receivementInstallment.model.js'
import { CteNfe } from './models/cteNfe.model.js'
import { NFe } from './models/nfe.model.js'
import { City } from './models/city.model.js'
import { State } from './models/state.model.js'
import { Cfop } from './models/cfop.model.js'
import { CompanyBusiness } from './models/companyBusiness.model.js'
import { UserMember } from './models/userMember.model.js'
import { Called } from './models/called.model.js'
import { CalledReason } from './models/calledReason.model.js'
import { CalledOccurrence } from './models/calledOccurrence.model.js'
import { CalledStatus } from './models/calledStatus.model.js'
import { CalledResolution } from './models/calledResolution.model.js'
import { StatementData } from './models/statementData.model.js'

export class AppContext extends Sequelize {
  
  Called = this.define('called', new Called(), { tableName: 'called' })
  
  CalledOccurrence = this.define('calledOccurrence', new CalledOccurrence(), { tableName: 'calledOccurrence' })

  CalledReason = this.define('calledReason', new CalledReason(), { tableName: 'calledReason' })

  CalledStatus = this.define('calledStatus', new CalledStatus(), { tableName: 'calledStatus' })

  CalledResolution = this.define('calledResolution', new CalledResolution(), { tableName: 'calledResolution' })

  Company = this.define('company', new Company(), { tableName: 'empresa_filial' })

  CompanyBusiness = this.define('companyBusiness', new CompanyBusiness(), { tableName: 'empresa' })

  CompanyIntegration = this.define('companyIntegration', new CompanyIntegration(), { tableName: 'companyIntegration' })

  //CompanyRole = this.define('companyRole', new CompanyRole(), { tableName: 'companyRole' })

  CompanyUser = this.define('companyUser', new CompanyUser(), { tableName: 'companyUser' })

  CurrencyMethod = this.define('currencyMethod', new CurrencyMethod(), { tableName: 'currencyMethod' })

  ContabilityCategorie = this.define('contabilityCategorie', new ContabilityCategorie(), { tableName: 'contabilityCategorie' })
  
  Cte = this.define('cte', new Cte(), { tableName: 'ctes' })

  City = this.define('city', new City(), { tableName: 'municipio' })
  
  Cfop = this.define('cfop', new Cfop(), { tableName: 'CFOP' })
  
  CteNfe = this.define('cteNfe', new CteNfe(), { tableName: 'CteNotas' })
  
  Integration = this.define('integration', new Integration(), { tableName: 'integration' })

  Bank = this.define('bank', new Bank(), { tableName: 'Banco' })

  BankAccount = this.define('bankAccount', new BankAccount(), { tableName: 'conta_bancaria' })
  
  BankAccountStatement = this.define('bankAccountStatement', new BankAccountStatement(), { tableName: 'bankAccountStatement' })

  Cashier = this.define('cashier', new Cashier(), { tableName: 'cashier' })

  Partner = this.define('partner', new Partner(), { tableName: 'pessoa' })

  Payment = this.define('payment', new Payment(), { tableName: 'payment' })

  PaymentMethod = this.define('paymentMethod', new PaymentMethod(), { tableName: 'paymentMethod' })

  Product = this.define('product', new Product(), { tableName: 'product' })

  Receivement = this.define('receivement', new Receivement(), { tableName: 'movimentos' })

  ReceivementInstallment = this.define('receivementInstallment', new ReceivementInstallment(), { tableName: 'movimentos_detalhe' })

  ReceivementMethod = this.define('receivementMethod', new ReceivementMethod(), { tableName: 'receivementMethod' })

  Role = this.define('role', new Role(), { tableName: 'role' })
  
  RoleRule = this.define('roleRule', new RoleRule(), { tableName: 'roleRule' })

  Rule = this.define('rule', new Rule(), { tableName: 'rule' })

  Nfe = this.define('nfe', new NFe(), { tableName: 'nota' })

  Session = this.define('session', new Session(), { tableName: 'session' })

  Shippiment = this.define('shippiment', new Shippiment(), { tableName: 'carga' })

  State = this.define('state', new State(), { tableName: 'uf' })

  Statement = this.define('statement', new Statement(), { tableName: 'statement' })

  StatementData = this.define('statementData', new StatementData(), { tableName: 'statementData' })

  Task = this.define('task', new Task(), { tableName: 'task' })

  TaskMethod = this.define('taskMethod', new TaskMethod(), { tableName: 'taskMethod' })

  TaskHistory = this.define('taskHistory', new TaskHistory(), { tableName: 'taskHistory' })

  User = this.define('user', new User(), { tableName: 'aspnet_Users' })

  UserMember = this.define('userMember', new UserMember(), { tableName: 'aspnet_Membership' })
  
  constructor() {

    super({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_DATABASE,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      dialect: 'mssql',
      dialectModule: tedious,
      databaseVersion: '10.50.1600',
      timezone: "America/Sao_Paulo",
      dialectOptions: { options: { requestTimeout: 300000, encrypt: false }}, define: { timestamps: false },
      logging: (query, options) => {
        if (options.bind) {
          Object.keys(options.bind).forEach((key) => query = query.replace(`@${key}`, `'${options.bind[key]}'`))
        }
        console.log(query)
      },
    })

    this.Called.belongsTo(this.Company, {as: 'company', foreignKey: 'companyId', targetKey: 'id'})
    this.Called.belongsTo(this.User, {as: 'responsible', foreignKey: 'responsibleId', targetKey: 'id'})
    this.Called.belongsTo(this.Partner, {as: 'requested', foreignKey: 'requestedId', targetKey: 'id'})
    this.Called.belongsTo(this.CalledStatus, {as: 'status', foreignKey: 'statusId', targetKey: 'id'})
    this.Called.belongsTo(this.CalledReason, {as: 'reason', foreignKey: 'reasonId', targetKey: 'id'})
    this.Called.belongsTo(this.CalledOccurrence, {as: 'occurrence', foreignKey: 'occurrenceId', targetKey: 'id'})

    this.Called.hasMany(this.CalledResolution, {as: 'resolutions', foreignKey: 'calledId'})
    
    this.CalledResolution.belongsTo(this.Called, {as: 'called', foreignKey: 'calledId', targetKey: 'id'})
    this.CalledResolution.belongsTo(this.User, {as: 'user', foreignKey: 'userId', targetKey: 'id'})
    this.CalledResolution.belongsTo(this.CalledStatus, {as: 'status', foreignKey: 'statusId', targetKey: 'id'})


    this.City.belongsTo(this.State, {as: 'state', foreignKey: 'stateId', targetKey: 'id'})

    this.CompanyBusiness.hasMany(this.Company, {as: 'companies', foreignKey: 'companyBusinessId'})

    this.Company.hasMany(this.CompanyUser, {as: 'companyUsers', foreignKey: 'companyId'})
    this.Company.belongsTo(this.CompanyBusiness, {as: 'companyBusiness', foreignKey: 'companyBusinessId', targetKey: 'id'})


    this.CompanyIntegration.belongsTo(this.Company, {as: 'company', foreignKey: 'companyId', targetKey: 'id'})
    this.CompanyIntegration.belongsTo(this.Integration, {as: 'integration', foreignKey: 'integrationId', targetKey: 'id'})

    //this.CompanyRole.belongsTo(this.Role, {as: 'role', foreignKey: 'roleId', targetKey: 'id'})

    this.CompanyUser.belongsTo(this.Company, {as: 'company', foreignKey: 'companyId', targetKey: 'id'})
    this.CompanyUser.belongsTo(this.User, {as: 'user', foreignKey: 'userId', targetKey: 'id'})
    this.CompanyUser.belongsTo(this.Role, {as: 'role', foreignKey: 'roleId', targetKey: 'id'})

    
    this.Cte.belongsTo(this.Partner, {as: 'sender', foreignKey: 'senderId', targetKey: 'id'})
    this.Cte.belongsTo(this.Partner, {as: 'recipient', foreignKey: 'recipientId', targetKey: 'id'})
    this.Cte.belongsTo(this.Partner, {as: 'dispatcher', foreignKey: 'dispatcherId', targetKey: 'id'})
    this.Cte.belongsTo(this.Partner, {as: 'receiver', foreignKey: 'receiverId', targetKey: 'id'})
    this.Cte.belongsTo(this.Partner, {as: 'taker', foreignKey: 'takerId', targetKey: 'id'})
    this.Cte.belongsTo(this.Shippiment, {as: 'shippiment', foreignKey: 'shippimentId', targetKey: 'id'})

    
    this.Cte.belongsTo(this.City, {as: 'origin', foreignKey: 'originId', targetKey: 'id'})
    this.Cte.belongsTo(this.City, {as: 'destiny', foreignKey: 'destinyId', targetKey: 'id'})

    this.Cte.hasMany(this.CteNfe, {as: 'cteNfes', foreignKey: 'cteId'})

    this.BankAccount.belongsTo(this.Bank, {as: 'bank', foreignKey: 'bankId', targetKey: 'id'})
    this.BankAccount.hasMany(this.BankAccountStatement, {as: 'bankAccountStatements', foreignKey: 'bankAccountId'})

    this.BankAccountStatement.belongsTo(this.Partner, {as: 'partner', foreignKey: 'partnerId', targetKey: 'id'})
    this.BankAccountStatement.belongsTo(this.BankAccount, {as: 'bankAccount', foreignKey: 'bankAccountId', targetKey: 'id'})
    this.BankAccountStatement.belongsTo(this.CurrencyMethod, {as: 'currencyMethod', foreignKey: 'currencyMethodId', targetKey: 'id'})
    this.BankAccountStatement.belongsTo(this.ContabilityCategorie, {as: 'categorie', foreignKey: 'categorieId', targetKey: 'id'})

    this.Cashier.belongsTo(this.BankAccount, {as: 'bankAccount', foreignKey: 'bankAccountId', targetKey: 'id'})

    this.Payment.belongsTo(this.Company, {as: 'company', foreignKey: 'companyId', targetKey: 'id'})
    this.Payment.belongsTo(this.Partner, {as: 'beneficiary', foreignKey: 'beneficiaryId', targetKey: 'id'})
    this.Payment.belongsTo(this.BankAccount, {as: 'bankAccount', foreignKey: 'bankAccountId', targetKey: 'id'})
    this.Payment.belongsTo(this.ContabilityCategorie, {as: 'categorie', foreignKey: 'categorieId', targetKey: 'id'})
    this.Payment.belongsTo(this.CurrencyMethod, {as: 'currencyMethod', foreignKey: 'currencyMethodId', targetKey: 'id'})

    this.PaymentMethod.belongsTo(this.CurrencyMethod, {as: 'currencyMethod', foreignKey: 'currencyMethodId', targetKey: 'id'})

    this.Receivement.belongsTo(this.Company, {as: 'company', foreignKey: 'companyId', targetKey: 'id'})
    this.Receivement.belongsTo(this.Partner, {as: 'payer', foreignKey: 'payerId', targetKey: 'id'})
    this.Receivement.belongsTo(this.BankAccount, {as: 'bankAccount', foreignKey: 'bankAccountId', targetKey: 'id'})
    this.Receivement.belongsTo(this.ContabilityCategorie, {as: 'categorie', foreignKey: 'categorieId', targetKey: 'id'})
    this.Receivement.belongsTo(this.CurrencyMethod, {as: 'currencyMethod', foreignKey: 'currencyMethodId', targetKey: 'id'})

    this.ReceivementMethod.belongsTo(this.CurrencyMethod, {as: 'currencyMethod', foreignKey: 'currencyMethodId', targetKey: 'id'})

    this.Role.hasMany(this.RoleRule, {as: 'roleRules', foreignKey: 'roleId'})

    this.Session.belongsTo(this.Company, {as: 'company', foreignKey: 'companyId', targetKey: 'id'})
    this.Session.belongsTo(this.User, {as: 'user', foreignKey: 'userId', targetKey: 'id'})

    this.Shippiment.belongsTo(this.Partner, {as: 'sender', foreignKey: 'senderId', targetKey: 'id'})
    this.Shippiment.hasMany(this.Cte, {as: 'ctes', foreignKey: 'shippimentId'})

    
    this.Statement.belongsTo(this.Company, {as: 'company', foreignKey: 'companyId', targetKey: 'id'})
    this.Statement.belongsTo(this.BankAccount, {as: 'bankAccount', foreignKey: 'bankAccountId', targetKey: 'id'})

    this.Task.belongsTo(this.TaskMethod, {as: 'method', foreignKey: 'methodId', targetKey: 'id'})
    this.Task.hasMany(this.TaskHistory, {as: 'taskHistories', foreignKey: 'taskId'})

    this.User.hasMany(this.CompanyUser, {as: 'companyUsers', foreignKey: 'userId'})

    this.User.belongsTo(this.UserMember, {as: 'userMember', foreignKey: 'id', targetKey: 'id'})
    
    this.CteNfe.belongsTo(this.Nfe, {as: 'nfe', foreignKey: 'nfeId', targetKey: 'id'})

  }

}