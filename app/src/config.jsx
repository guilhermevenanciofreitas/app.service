import React from 'react';
import { Icon } from '@rsuite/icons';
import { VscTable, VscCalendar } from 'react-icons/vsc';
import { MdFingerprint, MdDashboard, MdModeEditOutline, Md10K, MdSupport, MdSettings } from 'react-icons/md';
import CubesIcon from '@rsuite/icons/legacy/Cubes';
import { Badge } from 'rsuite';
import { FaArchive, FaCalendar, FaCalendarDay, FaCalendarTimes, FaCalendarWeek, FaCartPlus, FaCashRegister, FaDiaspora, FaDropbox, FaInfo, FaInfoCircle, FaLifeRing, FaMoneyBill, FaMoneyCheck, FaSupple, FaTasks, FaTruck, FaTruckLoading, FaUserPlus, FaVirusSlash } from 'react-icons/fa';

export const appNavs = [
  {
    eventKey: 'dashboard',
    icon: <Icon as={MdDashboard} />,
    title: 'Dashboard',
    to: '/dashboard'
  },
  {
    eventKey: 'calleds',
    icon: <Icon as={MdSupport} />,
    title: 'Chamados',
    to: '/calleds',
    ruleId: '0F7D1201-F8C9-4F1D-934D-B32A3232F7EE'
  },
  /*
  {
    eventKey: 'calendar',
    icon: <Icon as={FaCalendarWeek} />,
    title: <Badge content={1}><span style={{marginRight: 10}}>Calendário</span></Badge>,
    to: '/calendar'
  },
  {
    eventKey: 'calleds',
    icon: <Icon as={FaLifeRing} />,
    title: <Badge content={5}><span style={{marginRight: 10}}>Chamados</span></Badge>,
    to: '/calleds'
  },
  {
    eventKey: 'register',
    icon: <Icon as={FaUserPlus} />,
    title: 'Cadastros',
    to: '/register',
    children: [
      {
        eventKey: 'customers',
        title: 'Clientes',
        to: '/register/customers'
      },
      {
        eventKey: 'suppliers',
        title: 'Fornecedores',
        to: '/register/suppliers'
      },
      {
        eventKey: 'products',
        title: 'Produtos',
        to: '/register/products'
      },
      {
        eventKey: 'services',
        title: 'Serviços',
        to: '/register/services'
      },
      {
        eventKey: 'advertisements',
        title: 'Anúncios',
        to: '/register/advertisements'
      },
      {
        eventKey: 'promotions',
        title: 'Promoções',
        to: '/register/promotions'
      }
    ]
  },
  {
    eventKey: 'supplies',
    icon: <Icon as={FaDropbox} />,
    title: 'Suprimentos',
    to: '/supplies',
    children: [
      {
        eventKey: 'stock',
        title: 'Estoque',
        to: '/supplies/stock'
      },
      {
        eventKey: 'purchase-suggestion',
        title: 'Sugestão de compra',
        to: '/supplies/purchase-suggestion'
      },
      {
        eventKey: 'purchase',
        title: 'Ordem de compra',
        to: '/supplies/purchase'
      },
      {
        eventKey: 'services-taken',
        title: 'Serviços tomados',
        to: '/supplies/services-taken'
      },
      {
        eventKey: 'merchandise-receipt',
        title: 'Entrada de nota fiscal',
        to: '/supplies/merchandise-receipt'
      },
      {
        eventKey: 'conference',
        title: 'Conferência',
        to: '/suppliers/conference'
      },
      {
        eventKey: 'virtualized',
        title: 'Produção',
        to: '/suppliers/production'
      }
    ]
  },*/
  {
    eventKey: 'finance',
    icon: <Icon as={FaMoneyBill} />,
    title: 'Finanças',
    to: '/finance',
    children: [
      /*
      {
        eventKey: 'cashiers',
        title: 'Caixa',
        to: '/finance/cashiers'
      },
      {
        eventKey: 'bank-accounts',
        title: 'Bancos',
        to: '/finance/bank-accounts'
      },
      {
        eventKey: 'payments',
        title: 'Contas a pagar',
        to: '/finance/payments'
      },
      {
        eventKey: 'receivements',
        title: 'Contas a receber',
        to: '/finance/receivements'
      },
      {
        eventKey: 'prepare',
        title: 'Preparar',
        to: '/finance/prepare'
      },
      {
        eventKey: 'shippings',
        title: 'Remessas',
        to: '/finance/shippings'
      },
      {
        eventKey: 'charges',
        title: 'Retornos',
        to: '/finance/charges'
      },*/
      {
        eventKey: 'statements',
        title: 'Extratos',
        to: '/finance/statements',
        ruleId: '53AFC0B2-7890-4D43-A6E0-B6035ADBFD64'
      }
    ]
  },/*
  {
    eventKey: 'sale',
    title: 'Vendas',
    icon: <Icon as={FaCartPlus} />,
    children: [
      {
        eventKey: 'pdv',
        title: 'PDV',
        to: '/sale/pdv'
      },
      {
        eventKey: 'proposals',
        title: 'Propostas',
        to: '/sale/proposals'
      },
      {
        eventKey: 'orders',
        title: 'Ordens de pedido',
        to: '/sale/orders'
      },
      {
        eventKey: 'billings',
        title: 'Faturamento',
        to: '/sale/billings'
      },
      {
        eventKey: 'separations',
        title: 'Separação',
        to: '/sale/separations'
      },
      {
        eventKey: 'expeditions',
        title: 'Expedição',
        to: '/sale/expeditions'
      },
      {
        eventKey: 'nfe',
        title: 'NF-e',
        to: '/sale/nfe'
      },
    ]
  },*/
  {
    eventKey: 'expedition',
    title: 'Expedição',
    icon: <Icon as={FaTruckLoading} />,
    children: [
      /*
      {
        eventKey: 'ctes1',
        title: 'Ordens de carga',
        to: '/logistic/ctes1',
        ruleId: 'FC9DE921-1B87-4BDE-85CC-2D5FD0CDDD6C'
      },*/
      {
        eventKey: 'shippiments',
        title: 'Romaneios',
        to: '/expedition/shippiments',
        ruleId: '6F1F9996-C17B-470A-93B7-A2491DFDF20F'
      },
      {
        eventKey: 'dispatches',
        title: 'Despacho',
        to: '/expedition/dispatches',
        ruleId: '6F1F9996-C17B-470A-93B7-A2491DFDF20F'
      },
    ]
  },
  {
    eventKey: 'logistic',
    title: 'Logística',
    icon: <Icon as={FaTruck} />,
    children: [
      /*{
        eventKey: 'ctes1',
        title: 'Ordem de cargas',
        to: '/logistic/ctes1',
        ruleId: 'FC9DE921-1B87-4BDE-85CC-2D5FD0CDDD6C'
      },*/
      {
        eventKey: 'trips',
        title: 'Viagens',
        to: '/logistic/trips',
        ruleId: '0A4763CF-3D8F-4F4A-B83C-396494F38254'
      },
      {
        eventKey: 'follow-up',
        title: 'Acompanhamento',
        to: '/logistic/follow-up',
        ruleId: 'A'
      },
    ]
  },
  {
    eventKey: 'fiscal',
    title: 'Fiscal',
    icon: <Icon as={FaCashRegister} />,
    children: [
      {
        eventKey: 'ctes',
        title: 'Conhecimentos',
        to: '/logistic/ctes',
        ruleId: 'FC9DE921-1B87-4BDE-85CC-2D5FD0CDDD6C'
      },
    ]
  },
  /*
  {
    eventKey: 'service',
    title: 'Serviço',
    icon: <Icon as={FaArchive} />,
    children: [
      {
        eventKey: 'service',
        title: 'Contratos',
        to: '/service/contracts'
      },
      {
        eventKey: 'service',
        title: 'Ordens de serviço',
        to: '/service/orders'
      },
      {
        eventKey: 'service',
        title: 'Notas de serviço',
        to: '/service/invoices'
      },
    ]
  },*/
  /*
  {
    eventKey: 'tasks',
    icon: <Icon as={FaTasks} />,
    title: 'Tarefas',
    to: '/tasks'
  },*/
  {
    eventKey: 'integrations',
    icon: <Icon as={FaInfoCircle} />,
    title: 'Integrações',
    to: '/integrations'
  },
  {
    eventKey: 'settings',
    icon: <Icon as={MdSettings} />,
    title: 'Configurações',
    to: '/settings',
    ruleId: 'B77BA3E3-C830-40D7-9E7C-FE21C42BF014'
  },
];
