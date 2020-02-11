/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const chartsRouter = {
  path: '/mysql',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Charts',
  meta: {
    title: 'MYSQL管理',
    icon: 'chart'
  },
  children: [
    {
      path: 'mysql-resource',
      component: () => import('@/views/mysql/db'),
      name: 'mysqlResource',
      meta: { title: '数据库资源', noCache: true }
    },
    {
      path: 'mysql-resource-analyze',
      component: () => import('@/views/mysql/db/analyze.vue'),
      name: 'mysqlResourceAnalyze',
      hidden: true,
      meta: { title: '仪表盘', noCache: true }
    }
  ]
}

export default chartsRouter
