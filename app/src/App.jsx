import React, { useEffect, useState } from 'react';
import { Routes, Route, useRoutes, Navigate } from 'react-router-dom';
import { CustomProvider, Loader } from 'rsuite';
import enGB from 'rsuite/locales/en_GB';
import Frame from './components/Frame';
import DashboardPage from './views/dashboard';
import Error404Page from './views/errors/404';

import { SignIn } from './views/sign-in/signIn'

import { appNavs } from './config';

//Calendar
import CalendarPage from './views/calendar';

//Calleds
import { Calleds } from './views/calleds/index.calleds';

//Register
import RegisterProducts from './views/register/products/index.products';

//Finance
import FinanceCashiers from './views/finance/cashiers/index.cashiers';
import FinanceBankAccounts from './views/finance/bank-accounts/index.bank-accounts';
import FinancePayments from './views/finance/payments/index.payments';
import FinanceReceivements from './views/finance/receivements/index.receivements';
import { Statements } from './views/finance/statements/index.statements';


//Logistic
import { LogisticCtes } from './views/logistic/ctes/index.ctes';
import { LogisticShippiments } from './views/logistic/shippiments/index.shippiments'
import { LogisticTrips } from './views/logistic/trips/index.trips'

//Integrations
import { Integrations } from './views/integrations/index.integrations';

//Settings
import { Setting } from './views/setting/index.setting';
import { SettingUsers } from './views/setting/index.setting.users';
import { SettingRoles } from './views/setting/index.setting.roles';
import { SettingBankAccounts } from './views/setting/index.setting.bank-accounts';
import SettingContabilityCategories from './views/setting/index.setting.contability-categories';
import SettingPaymentMethods from './views/setting/index.setting.payment-methods';

//Integration
import Tasks from './views/task/index.tasks'

import ptBR from 'rsuite/locales/pt_BR';
import { IntlProvider } from 'react-intl';

export class Loading extends React.Component {

  static Show(message = 'Carregando...') {
    
    var loaderElement = document.getElementsByClassName('rs-loader-content')
  
    loaderElement[0].innerHTML = message

    document.getElementById('loading').style.display = 'block'
    
  }

  static Hide() {
    document.getElementById('loading').style.display = 'none';
  }

  render() {
    return (
      <div id='loading' className="loader-overlay" style={{display: 'none'}}>
        <div className="loader-content loader-center">
          <div className="loader-center"><Loader id='loader' size="lg" inverse content='Carregando...' /></div>
        </div>
      </div>
    );
  }

}

export const checkAuthorization = () => {

  const authData = localStorage.getItem("Authorization")

  if (!authData) {
    return false
  }

  const { token, lastAcess, expireIn } = JSON.parse(authData);

  if (!token || !lastAcess || !expireIn) {
    return false
  }

  const expirationTime = Number(lastAcess) + Number(expireIn) * 60 * 1000

  if (Date.now() >= expirationTime) {
    return false
  } else {
    return true
  }

}

const PrivateRoute = ({ component }) => {

  const [isAuthenticated, setIsAuthenticated] = useState(null)

  useEffect(() => {

    let animationFrameId

    const checkAuth = () => {

      const isAuth = checkAuthorization()

      if (!isAuth) {
        setIsAuthenticated(false)
      } else {
        setIsAuthenticated(true)
        animationFrameId = requestAnimationFrame(checkAuth)
      }
    }

    checkAuth()

    return () => cancelAnimationFrame(animationFrameId)

  }, [])

  if (isAuthenticated === null) {
    return null
  }

  const redirect = window.location.pathname == '/' ? '' : `?redirect=${window.location.pathname}`

  return isAuthenticated ? component : <Navigate to={`/sign-in${redirect}`} replace />

}

const App = () => {

  return (
    <>
      <Loading />
      <IntlProvider locale="zh">
        <CustomProvider locale={ptBR}>
          <Routes>
            
            <Route path="sign-in" element={<SignIn />} />

            <Route path="/" element={<PrivateRoute component={<Frame navs={appNavs} />} />}>

              <Route index element={<DashboardPage />} />

              <Route path="dashboard" element={<DashboardPage />} />

              {/*Calendar*/}
              <Route path='calendar' element={<CalendarPage />} />

              {/*Calleds*/}
              <Route path='calleds' element={<Calleds />} />

              {/*Register*/}
              <Route path="register/products" element={<RegisterProducts />} />

              {/*Finance*/}
              <Route path="finance/cashiers" element={<FinanceCashiers />} />
              <Route path="finance/bank-accounts" element={<FinanceBankAccounts />} />
              <Route path="finance/payments" element={<FinancePayments />} />
              <Route path="finance/receivements" element={<FinanceReceivements />} />
              <Route path="finance/statements" element={<Statements />} />

              {/*Logistic*/}
              <Route path="logistic/ctes" element={<LogisticCtes />} />
              <Route path="logistic/shippiments" element={<LogisticShippiments />} />
              <Route path="logistic/trips" element={<LogisticTrips />} />

              {/*Integration*/}
              <Route path="integrations" element={<Integrations />} />

              {/*Setting*/}
              <Route path="settings" element={<Setting />} />
              <Route path="settings/users" element={<SettingUsers />} />
              <Route path="settings/roles" element={<SettingRoles />} />
              <Route path="settings/bank-accounts" element={<SettingBankAccounts />} />
              <Route path="settings/contability-categories" element={<SettingContabilityCategories />} />
              <Route path="settings/payment-methods" element={<SettingPaymentMethods />} />

              {/*Task*/}
              <Route path="tasks" element={<Tasks />} />

            </Route>
            
            <Route path="*" element={<Error404Page />} />

          </Routes>
        </CustomProvider>
      </IntlProvider>
    </>
  )
}

export default App;
