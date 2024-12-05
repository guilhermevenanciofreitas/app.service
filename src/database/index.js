import { QueryInterface, Sequelize } from 'sequelize'
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

export class AppContext extends Sequelize {
  
  Company = this.define('company', new Company(), { tableName: 'company' })

  CompanyIntegration = this.define('companyIntegration', new CompanyIntegration(), { tableName: 'companyIntegration' })

  CompanyRole = this.define('companyRole', new CompanyRole(), { tableName: 'companyRole' })

  CompanyUser = this.define('companyUser', new CompanyUser(), { tableName: 'companyUser' })

  CurrencyMethod = this.define('currencyMethod', new CurrencyMethod(), { tableName: 'currencyMethod' })

  ContabilityCategorie = this.define('contabilityCategorie', new ContabilityCategorie(), { tableName: 'contabilityCategorie' })
  
  Cte = this.define('cte', new Cte(), { tableName: 'ctes' })
  
  Integration = this.define('integration', new Integration(), { tableName: 'integration' })

  Bank = this.define('bank', new Bank(), { tableName: 'bank' })

  BankAccount = this.define('bankAccount', new BankAccount(), { tableName: 'bankAccount' })
  
  BankAccountStatement = this.define('bankAccountStatement', new BankAccountStatement(), { tableName: 'bankAccountStatement' })

  Cashier = this.define('cashier', new Cashier(), { tableName: 'cashier' })

  Partner = this.define('partner', new Partner(), { tableName: 'pessoa' })

  Payment = this.define('payment', new Payment(), { tableName: 'payment' })

  PaymentMethod = this.define('paymentMethod', new PaymentMethod(), { tableName: 'paymentMethod' })

  Product = this.define('product', new Product(), { tableName: 'product' })

  Receivement = this.define('receivement', new Receivement(), { tableName: 'receivement' })

  ReceivementMethod = this.define('receivementMethod', new ReceivementMethod(), { tableName: 'receivementMethod' })

  Role = this.define('role', new Role(), { tableName: 'role' })
  
  RoleRule = this.define('roleRule', new RoleRule(), { tableName: 'roleRule' })

  Rule = this.define('rule', new Rule(), { tableName: 'rule' })

  Session = this.define('session', new Session(), { tableName: 'session' })

  Shippiment = this.define('shippiment', new Shippiment(), { tableName: 'carga' })

  Statement = this.define('statement', new Statement(), { tableName: 'statement' })

  Task = this.define('task', new Task(), { tableName: 'task' })

  TaskMethod = this.define('taskMethod', new TaskMethod(), { tableName: 'taskMethod' })

  TaskHistory = this.define('taskHistory', new TaskHistory(), { tableName: 'taskHistory' })

  User = this.define('user', new User(), { tableName: 'aspnet_Users' })
  
  constructor() {

    super({host: process.env.DB_HOST, port: process.env.DB_PORT, database: process.env.DB_DATABASE, password: process.env.DB_PASSWORD, username: process.env.DB_USER, dialect: 'mssql', dialectModule: tedious, databaseVersion: '10.50.1600', timezone: "America/Sao_Paulo", dialectOptions: { options: { encrypt: false }}, define: { timestamps: false }})
    
    this.CompanyIntegration.belongsTo(this.Integration, {as: 'integration', foreignKey: 'integrationId', targetKey: 'id'})

    this.CompanyRole.belongsTo(this.Role, {as: 'role', foreignKey: 'roleId', targetKey: 'id'})

    this.CompanyUser.belongsTo(this.Company, {as: 'company', foreignKey: 'companyId', targetKey: 'id'})
    this.CompanyUser.belongsTo(this.User, {as: 'user', foreignKey: 'userId', targetKey: 'id'})
    this.CompanyUser.belongsTo(this.Role, {as: 'role', foreignKey: 'roleId', targetKey: 'id'})

    
    this.Cte.belongsTo(this.Partner, {as: 'recipient', foreignKey: 'recipientId', targetKey: 'id'})
    this.Cte.belongsTo(this.Shippiment, {as: 'shippiment', foreignKey: 'shippimentId', targetKey: 'id'})

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

    this.Statement.belongsTo(this.BankAccount, {as: 'bankAccount', foreignKey: 'bankAccountId', targetKey: 'id'})

    this.Task.belongsTo(this.TaskMethod, {as: 'method', foreignKey: 'methodId', targetKey: 'id'})
    this.Task.hasMany(this.TaskHistory, {as: 'taskHistories', foreignKey: 'taskId'})

    this.User.hasMany(this.CompanyUser, {as: 'companyUsers', foreignKey: 'userId'})    

  }

}