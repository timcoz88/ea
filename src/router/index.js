import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
/* import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'

import nestedRouter from './modules/nested'*/
import mysqlRouter from './modules/mysql'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/overview',
    children: [
      {
        path: 'overview',
        component: () => import('@/views/db/overview/index'),
        name: 'dbOverview',
        meta: { title: '概览', icon: 'dashboard', affix: true }
      },
      // {
      //   path: 'aa',
      //   component: () => import('@/views/db/aa/index'),
      //   name: 'aa',
      //   meta: { title: '11', affix: false }
      // },
      {
        path: 'database-monitor',
        component: () => import('@/views/db/database-monitor/index'),
        name: 'databaseMonitor',
        hidden: true,
        meta: { title: '数据库监控', affix: false }
      },
      {
        path: 'top-sql',
        component: () => import('@/views/db/top-sql/index'),
        name: 'topSql',
        hidden: true,
        meta: { title: 'TOP SQL详情', affix: false }
      },
      {
        path: 'session-detail',
        component: () => import('@/views/db/session-detail/index'),
        name: 'sessionDetail',
        hidden: true,
        meta: { title: '会话详情', affix: false }
      }
    ]
  },
  {
    path: '/auto-task',
    component: Layout,
    redirect: '/auto-task/operation',
    name: 'handler',
    alwaysShow: true,
    meta: {
      title: '自动化任务',
      icon: 'skill'
    },
    children: [
      {
        path: 'operation',
        component: () => import('@/views/auto/operation'),
        name: 'autoOperation',
        meta: { title: '自动化运维', affix: false }
      }, {
        path: 'addOper',
        component: () => import('@/views/auto/addOper'),
        name: 'addOper',
        hidden: true,
        meta: { title: '新增部署任务', affix: false }
      }, {
        path: 'deploymentLog',
        component: () => import('@/views/auto/deploymentLog'),
        name: 'deploymentLog',
        hidden: true,
        meta: { title: '部署日志', affix: false }
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  }
]
// export const constantRoutes = [
//   {
//     path: '/redirect',
//     component: Layout,
//     hidden: true,
//     children: [
//       {
//         path: '/redirect/:path*',
//         component: () => import('@/views/redirect/index')
//       }
//     ]
//   },
//   {
//     path: '/login',
//     component: () => import('@/views/login/index'),
//     hidden: true
//   },
//   {
//     path: '/auth-redirect',
//     component: () => import('@/views/login/auth-redirect'),
//     hidden: true
//   },
//   {
//     path: '/404',
//     component: () => import('@/views/error-page/404'),
//     hidden: true
//   },
//   {
//     path: '/401',
//     component: () => import('@/views/error-page/401'),
//     hidden: true
//   },
//   {
//     path: '/',
//     component: Layout,
//     redirect: '/dashboard',
//     children: [
//       {
//         path: 'dashboard',
//         component: () => import('@/views/dashboard/index'),
//         name: 'Dashboard',
//         meta: { title: '工作台', icon: 'dashboard', affix: true }
//       }
//     ]
//   },
//   {
//     path: '/system',
//     component: Layout,
//     redirect: '/system/user',
//     name: 'system',
//     meta: {
//       title: '系统管理',
//       icon: 'component'
//     },
//     children: [
//       {
//         path: 'user',
//         component: () => import('@/views/system/user/index'),
//         name: 'user',
//         meta: { title: '用户管理', affix: false }
//       },
//       {
//         path: 'plugin',
//         component: () => import('@/views/system/plugin/index'),
//         name: 'plugin',
//         meta: { title: '插件管理', affix: false }
//       }
//     ]
//   },
//   {
//     path: '/resource',
//     component: Layout,
//     redirect: '/resource/host',
//     name: 'resource',
//     meta: {
//       title: '资源管理',
//       icon: 'example'
//     },
//     children: [
//       {
//         path: 'host',
//         component: () => import('@/views/resource/host/index'),
//         name: 'host',
//         meta: { title: '服务器资源', affix: false }
//       },
//       {
//         path: 'db',
//         component: () => import('@/views/resource/db/index'),
//         name: 'db',
//         meta: { title: '数据库资源', affix: false }
//       },
//       {
//         path: 'shell',
//         component: () => import('@/views/resource/shell/index'),
//         name: 'shell',
//         meta: { title: '脚本资源', affix: false }
//       },
//       {
//         path: 'email',
//         component: () => import('@/views/resource/email/index'),
//         name: 'email',
//         meta: { title: '邮箱管理', affix: false }
//       },
//       {
//         path: 'task',
//         component: () => import('@/views/resource/task/index'),
//         name: 'task',
//         meta: { title: '定时任务', affix: false }
//       },
//       {
//         path: 'audit',
//         component: () => import('@/views/resource/audit/index'),
//         name: 'audit',
//         meta: { title: '审计' }
//       },
//       {
//         path: 'warning-sql',
//         component: () => import('@/views/resource/warning-sql/index'),
//         name: 'warningSql',
//         meta: { title: 'SQL预警管理' }
//       }
//     ]
//   },
//   {
//     path: '/dispatch',
//     component: Layout,
//     redirect: '/dispatch/shell',
//     name: 'dispatch',
//     meta: {
//       title: '调度管理',
//       icon: 'skill'
//     },
//     children: [
//       {
//         path: 'shell',
//         component: () => import('@/views/dispatch/shell/index'),
//         name: 'dispatchShell',
//         meta: { title: '脚本调度', affix: false }
//       },
//       {
//         path: 'history',
//         component: () => import('@/views/dispatch/shell/history'),
//         name: 'dispatchHistory',
//         hidden: true,
//         meta: { title: '调度历史', affix: false }
//       }
//     ]
//   },
//   {
//     path: '/db',
//     component: Layout,
//     redirect: '/db/overview',
//     name: 'dispatch',
//     meta: {
//       title: '数据库管理',
//       icon: 'skill'
//     },
//     children: [
//       {
//         path: 'aa',
//         component: () => import('@/views/db/aa/index'),
//         name: 'aa',
//         meta: { title: '11', affix: false }
//       },
//       {
//         path: 'overview',
//         component: () => import('@/views/db/overview/index'),
//         name: 'dbOverview',
//         meta: { title: '概览', affix: false }
//       },
//       {
//         path: 'database-monitor',
//         component: () => import('@/views/db/database-monitor/index'),
//         name: 'databaseMonitor',
//         hidden: true,
//         meta: { title: '数据库监控', affix: false }
//       },
//       {
//         path: 'top-sql',
//         component: () => import('@/views/db/top-sql/index'),
//         name: 'topSql',
//         hidden: true,
//         meta: { title: 'TOP SQL详情', affix: false }
//       },
//       {
//         path: 'session-detail',
//         component: () => import('@/views/db/session-detail/index'),
//         name: 'sessionDetail',
//         hidden: true,
//         meta: { title: '会话详情', affix: false }
//       },
//       {
//         path: 'oracle',
//         component: () => import('@/views/db/oracle/index'),
//         name: 'dbOracle',
//         meta: { title: 'ORACLE', affix: false }
//       },
//       {
//         path: 'oracle-detail',
//         component: () => import('@/views/db/db-manage-detail/index'),
//         name: 'dbOracleDetail',
//         hidden: true,
//         meta: { title: '数据库管理详情', affix: false }
//       },
//       {
//         path: 'auto',
//         component: () => import('@/views/polling/auto-polling/index'),
//         name: 'polling-auto',
//         meta: {
//           title: '自动化巡检',
//           key: 'polling-auto',
//           noCache: false
//         }
//       },
//       {
//         path: 'polling-report',
//         component: () => import('@/views/polling/polling-report/index'),
//         name: 'polling-report',
//         hidden: true,
//         meta: {
//           title: '巡检报告',
//           key: 'polling-report',
//           noCache: false
//         }
//       },
//       {
//         path: 'polling-report-detail',
//         component: () => import('@/views/polling/polling-report/report-detail'),
//         name: 'polling-report-detail',
//         hidden: true,
//         meta: {
//           title: '详细巡检报告',
//           key: 'polling-report',
//           noCache: false
//         }
//       },
//       {
//         path: 'sql-manage-detail',
//         component: () => import('@/views/db/sql-manage-detail/index'),
//         name: 'sqlManageDetail',
//         hidden: true,
//         meta: {
//           title: '表管理详情',
//           key: 'sql-manage-detail',
//           noCache: false
//         }
//       }, {
//         path: 'table-analyze-detail',
//         component: () => import('@/views/db/table-analyze/index'),
//         name: 'tableAnalyzeDetail',
//         hidden: true,
//         meta: {
//           title: '表分析详情',
//           key: 'table-analyze-detail',
//           noCache: false
//         }
//       }, {
//         path: 'user-admin-edit',
//         component: () => import('@/views/db/user-admin-edit'),
//         name: 'userAdminEdit',
//         hidden: true,
//         meta: {
//           title: '权限修改',
//           key: 'user-admin-edit',
//           noCache: false
//         }
//       }, {
//         path: 'sql-plan-detail',
//         component: () => import('@/views/db/sql-plan-detail'),
//         name: 'sqlPlanDetail',
//         hidden: true,
//         meta: {
//           title: 'sql计划',
//           key: 'user-admin-edit',
//           noCache: false
//         }
//       }, {
//         path: 'fix-plan-detail',
//         component: () => import('@/views/db/fix-plan-detail'),
//         name: 'fixPlanDetail',
//         hidden: true,
//         meta: {
//           title: '固定执行计划',
//           key: 'user-admin-edit',
//           noCache: false
//         }
//       },
//     ]
//   },
//   {
//     path: '/handler',
//     component: Layout,
//     redirect: '/handler/record',
//     name: 'handler',
//     alwaysShow: true,
//     meta: {
//       title: '资源调度',
//       icon: 'skill'
//     },
//     children: [
//       {
//         path: 'record',
//         component: () => import('@/views/handler/record/collection'),
//         name: 'handlerRecord',
//         hidden: true,
//         meta: { title: '交付历史', affix: false }
//       }, {
//         path: 'recordResult',
//         component: () => import('@/views/handler/record/result'),
//         name: 'recordResult',
//         meta: { 'title': '表格结果', affix: false },
//         hidden: true
//       },
//       {
//         path: 'updateHost',
//         component: () => import('@/views/resource/updateHost'),
//         name: 'updateHost',
//         meta: { title: '批量修改', affix: false }
//       },
//       {
//         path: 'taskManager',
//         component: () => import('@/views/resource/task/taskManager'),
//         name: 'taskManager',
//         meta: { title: '交付检查', affix: false }
//       },
//       {
//         path: 'jx-collect',
//         component: () => import('@/views/handler/jx-collect/taskManager'),
//         name: 'jxCollect',
//         meta: { title: '基线收集', affix: false }
//       },
//       {
//         path: 'jx-record',
//         component: () => import('@/views/handler/jx-record/collection'),
//         name: 'handlerJxRecord',
//         hidden: true,
//         meta: { title: '基线历史', affix: false }
//       },
//       {
//         path: 'warning-collect',
//         component: () => import('@/views/handler/warning-collect/taskManager'),
//         name: 'warningCollect',
//         meta: { title: '故障收集', affix: false }
//       },
//       {
//         path: 'warning-record',
//         component: () => import('@/views/handler/warning-record/collection'),
//         name: 'handlerWarningRecord',
//         hidden: true,
//         meta: { title: '故障历史', affix: false }
//       },
//     ]
//   },{
//     path:'/auto-task',
//     component:Layout,
//     redirect: '/auto-task/operation',
//     name: 'handler',
//     alwaysShow: true,
//     meta: {
//       title: '自动化任务',
//       icon: 'skill'
//     },
//     children: [
//       {
//         path:'operation',
//         component:() => import('@/views/auto/operation'),
//         name:'autoOperation',
//         meta:{title:'自动化运维',affix:false}
//       },{
//         path:'addOper',
//         component:() => import('@/views/auto/addOper'),
//         name:'addOper',
//         hidden: true,
//         meta:{title:'新增部署任务',affix:false}
//       },{
//         path:'deploymentLog',
//         component:() => import('@/views/auto/deploymentLog'),
//         name:'deploymentLog',
//         hidden: true,
//         meta:{title:'部署日志',affix:false}
//       }
//     ]
//   },
//   mysqlRouter
// /*  {
//     path: '/guide',
//     component: Layout,
//     redirect: '/guide/index',
//     children: [
//       {
//         path: 'index',
//         component: () => import('@/views/guide/index'),
//         name: 'Guide',
//         meta: { title: 'Guide', icon: 'guide', noCache: true }
//       }
//     ]
//   },
//   {
//     path: '/profile',
//     component: Layout,
//     redirect: '/profile/index',
//     hidden: true,
//     children: [
//       {
//         path: 'index',
//         component: () => import('@/views/profile/index'),
//         name: 'Profile',
//         meta: { title: 'Profile', icon: 'user', noCache: true }
//       }
//     ]
//   }*/
// ]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  /* {
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: 'Permission',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/permission/page'),
        name: 'PagePermission',
        meta: {
          title: 'Page Permission',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: 'Directive Permission'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: {
          title: 'Role Permission',
          roles: ['admin']
        }
      }
    ]
  },

  ,*/
  /* {
    path: '/icon',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/icons/index'),
        name: 'Icons',
        meta: { title: 'Icons', icon: 'icon', noCache: true }
      }
    ]
  },*/
  /** when your routing map is too long, you can split it into small modules **/
  /* componentsRouter,
  chartsRouter,
  nestedRouter,
  , */
  // tableRouter,

  /* {
    path: '/example',
    component: Layout,
    redirect: '/example/list',
    name: 'Example',
    meta: {
      title: 'Example',
      icon: 'example'
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/example/create'),
        name: 'CreateArticle',
        meta: { title: 'Create Article', icon: 'edit' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/example/edit'),
        name: 'EditArticle',
        meta: { title: 'Edit Article', noCache: true, activeMenu: '/example/list' },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/example/list'),
        name: 'ArticleList',
        meta: { title: 'Article List', icon: 'list' }
      }
    ]
  },

  {
    path: '/tab',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/tab/index'),
        name: 'Tab',
        meta: { title: 'Tab', icon: 'tab' }
      }
    ]
  },

  {
    path: '/error',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ErrorPages',
    meta: {
      title: 'Error Pages',
      icon: '404'
    },
    children: [
      {
        path: '401',
        component: () => import('@/views/error-page/401'),
        name: 'Page401',
        meta: { title: '401', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404'),
        name: 'Page404',
        meta: { title: '404', noCache: true }
      }
    ]
  },

  {
    path: '/error-log',
    component: Layout,
    children: [
      {
        path: 'log',
        component: () => import('@/views/error-log/index'),
        name: 'ErrorLog',
        meta: { title: 'Error Log', icon: 'bug' }
      }
    ]
  },*/

  /* {
    path: '/excel',
    component: Layout,
    redirect: '/excel/export-excel',
    name: 'Excel',
    meta: {
      title: 'Excel',
      icon: 'excel'
    },
    children: [
      {
        path: 'export-excel',
        component: () => import('@/views/excel/export-excel'),
        name: 'ExportExcel',
        meta: { title: 'Export Excel' }
      },
      {
        path: 'export-selected-excel',
        component: () => import('@/views/excel/select-excel'),
        name: 'SelectExcel',
        meta: { title: 'Export Selected' }
      },
      {
        path: 'export-merge-header',
        component: () => import('@/views/excel/merge-header'),
        name: 'MergeHeader',
        meta: { title: 'Merge Header' }
      },
      {
        path: 'upload-excel',
        component: () => import('@/views/excel/upload-excel'),
        name: 'UploadExcel',
        meta: { title: 'Upload Excel' }
      }
    ]
  },

  {
    path: '/zip',
    component: Layout,
    redirect: '/zip/download',
    alwaysShow: true,
    name: 'Zip',
    meta: { title: 'Zip', icon: 'zip' },
    children: [
      {
        path: 'download',
        component: () => import('@/views/zip/index'),
        name: 'ExportZip',
        meta: { title: 'Export Zip' }
      }
    ]
  },

  {
    path: '/pdf',
    component: Layout,
    redirect: '/pdf/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/pdf/index'),
        name: 'PDF',
        meta: { title: 'PDF', icon: 'pdf' }
      }
    ]
  },
  {
    path: '/pdf/download',
    component: () => import('@/views/pdf/download'),
    hidden: true
  },

  {
    path: '/theme',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/theme/index'),
        name: 'Theme',
        meta: { title: 'Theme', icon: 'theme' }
      }
    ]
  },

  {
    path: '/clipboard',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/clipboard/index'),
        name: 'ClipboardDemo',
        meta: { title: 'Clipboard', icon: 'clipboard' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://github.com/PanJiaChen/vue-element-admin',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },*/

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
