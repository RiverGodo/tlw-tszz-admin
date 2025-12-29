import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
  path: '/login',
  name: 'login',
  meta: {
    title: '图书增值后台管理',
    requiresAuth: false
  },
  component: resolve => {
    require(['@/views/login.vue'], resolve);
  }
};

export const page404 = {
  path: '/*',
  name: 'error-404',
  meta: {
    title: '404-页面不存在',
    requiresAuth: false
  },
  component: resolve => {
    require(['@/views/error-page/404.vue'], resolve);
  }
};

export const page403 = {
  path: '/403',
  meta: {
    title: '403-权限不足',
    requiresAuth: false
  },
  name: 'error-403',
  component: resolve => {
    require(['@//views/error-page/403.vue'], resolve);
  }
};

export const page500 = {
  path: '/500',
  meta: {
    title: '500-服务端错误',
    requiresAuth: false
  },
  name: 'error-500',
  component: resolve => {
    require(['@/views/error-page/500.vue'], resolve);
  }
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
  path: '/',
  name: 'otherRouter',
  component: Main,
  children: [{
      path: 'home',
      meta: {
        requiresAuth: true,
        title: '默认主页',
      },
      title: {
        i18n: 'home'
      },
      name: 'home_index',
      component: resolve => {
        require(['@/views/home/home.vue'], resolve);
      }
    },
    {
      path: '/BookManage/subjectesourceList/:book_id',
      meta: {
        requiresAuth: true,
        title: '课程资源列表',
        access: 321
      },
      name: 'subject_resource_list',
      component: resolve => {
        require(['@/views/book/book-resource-list.vue'], resolve);
      }
    },
    {
      path: '/BookManage/bookresourceList/:book_id',
      meta: {
        requiresAuth: true,
        title: '图书资源列表',
        access: 331
      },
      name: 'book_resource_list',
      component: resolve => {
        require(['@/views/book/book-resource-list.vue'], resolve);
      }
    },
    {
      path: '/BookManage/chatRoomList/:resourceId',
      meta: {
        requiresAuth: true,
        title: '直播间详情',
        access: 341
      },
      name: 'chat_room',
      component: resolve => {
        require(['@/views/book/chat-room.vue'], resolve);
      }
    },
    {
      path: '/DailyEnglish/CategoryArticleList/:c_id',
      meta: {
        requiresAuth: true,
        /* access: 5, */
        title: '专栏内容文章列表',
      },
      name: 'DECategoryArticleList',
      title: '专栏内容文章列表',
      component: resolve => {
        require(['@/views/daily-english/article-list.vue'],
          resolve);
      }
    },
    {
      path: '/DailyEnglish/AddArticle/:type',
      meta: {
        requiresAuth: true,
        title: '创建文章',
        access: 521
      },
      name: 'DEAddArticle',
      title: '创建文章',
      component: resolve => {
        require(['@/views/daily-english/add-article.vue'],
          resolve);
      }
    },
    {
      path: '/DailyEnglish/AddCategory',
      meta: {
        requiresAuth: true,
        title: '创建专栏',
        access: 532
      },
      name: 'DEAddCategory',
      title: '创建专栏',
      component: resolve => {
        require(['@/views/daily-english/add-category.vue'],
          resolve);
      }
    },
    {
      path: '/DailyEnglish/AddBanner',
      meta: {
        requiresAuth: true,
        title: '创建广告',
        access: 511
      },
      name: 'DEAddBanner',
      title: '创建广告',
      component: resolve => {
        require(['@/views/daily-english/add-banner.vue'],
          resolve);
      }
    },
    {
      path: '/DailyEnglish/AddExam',
      meta: {
        requiresAuth: true,
        title: '创建练习',
        access: 551
      },
      name: 'DEAddExam',
      title: '创建练习',
      component: resolve => {
        require(['@/views/daily-english/add-exam.vue'],
          resolve);
      }
    },
    {
      path: '/DailyEnglish/ExamAnalysis',
      meta: {
        requiresAuth: true,
        title: '练习分析',
        access: 552
      },
      name: 'AnalysisExam',
      title: '练习分析',
      component: resolve => {
        require(['@/views/daily-english/exam-analysis.vue'],
          resolve);
      }
    },
    {
      path: '/DailyEnglish/AddQuestion',
      meta: {
        requiresAuth: true,
        title: '创建试题',
        access: 561
      },
      name: 'DEAddQuestion',
      title: '创建试题',
      component: resolve => {
        require(['@/views/daily-english/add-question.vue'],
          resolve);
      }
    },
    {
      path: '/DailyEnglish/CategoryDetail/:cid',
      meta: {
        requiresAuth: true,
        title: '专栏详情',
        access: 531
      },
      name: 'DECategoryDetail',
      title: '专栏详情',
      component: resolve => {
        require(['@/views/daily-english/category-detail.vue'],
          resolve);
      }
    },
    {
      path: 'QuestionnaireDetail',
      meta: {
        requiresAuth: true,
        title: '问卷详情',
        access: 611
      },
      title: '问卷详情',
      name: 'QuestionnaireDetail',
      component: resolve => {
        require(['@/views/questionnaire-lottery/questionnaire-detail.vue'],
          resolve);
      }
    },
    {
      path: 'answerDetail',
      meta: {
        requiresAuth: true,
        title: '答卷详情',
        access: 621
      },
      title: '答卷详情',
      name: 'answerDetail',
      component: resolve => {
        require(['@/views/questionnaire-lottery/answer-detail.vue'],
          resolve);
      }
    },
    {
      path: 'questionnaire-record',
      meta: {
        requiresAuth: true,
        title: '答卷记录',
        access: 612
      },
      title: '答卷记录',
      name: 'questionnaireRecord',
      component: resolve => {
        require(['@/views/questionnaire-lottery/questionnaire-record.vue'],
          resolve);
      }
    },
    /* {
        path: '/add-live-resource/:type',
        meta: {
            requiresAuth: true
        },
        title: '答卷记录',
        name: 'add-live-resource',
        component: resolve => {
            require(['@/views/book/add-live-resource.vue'],
                resolve);
        }
    }, */
    {
      path: '/Verification/AddVerification',
      meta: {
        requiresAuth: true,
        title: '生成邀请码',
        access: 731
      },
      name: 'AddVerification',
      title: '生成邀请码',
      component: resolve => {
        require(['@/views/settings/add-verification.vue'],
          resolve);
      }
    },
    {
      path: '/Verification/CheckVerification',
      meta: {
        requiresAuth: true,
        title: '查看邀请码',
        access: 732
      },
      name: 'CheckVerification',
      title: '查看邀请码',
      component: resolve => {
        require(['@/views/settings/add-verification.vue'],
          resolve);
      }
    },
    {
      path: '/Verification/usedCodeList',
      meta: {
        requiresAuth: true,
        title: '查看使用记录',
        access: 733
      },
      name: 'usedCodeList',
      title: '查看使用记录',
      component: resolve => {
        require(['@/views/settings/used-code-list.vue'],
          resolve);
      }
    },
    {
      path: '/BookManage/AddBanner',
      meta: {
        requiresAuth: true,
        title: '创建广告',
        access: 311
      },
      name: 'AddBanner',
      title: '创建广告',
      component: resolve => {
        require(['@/views/book/add-banner.vue'],
          resolve);
      }
    },
    {
      path: 'SignUp/AddSale',
      meta: {
        requiresAuth: true,
        title: '添加销售模式',
        access: 741
      },
      title: '添加销售模式',
      name: 'AddSale',
      component: resolve => {
        require(['@/views/sign-up/add-sale.vue'],
          resolve);
      }
    },
    {
      path: '/SignUp/AddBanner',
      meta: {
        requiresAuth: true,
        title: '创建广告',
        access: 751
      },
      name: 'AddBanner',
      title: '创建广告',
      component: resolve => {
        require(['@/views/sign-up/add-banner.vue'],
          resolve);
      }
    },
    //统计有关
    {
      path: 'evnetStatDetail',
      meta: {
        requiresAuth: true,
        title: '事件统计',
        access: 621
      },
      title: '事件统计',
      name: 'evnetStatDetail',
      component: resolve => {
        require(['@/views/statistics/detail/event-stat-detail.vue'],
          resolve);
      }
    },
     //经销商授权系统有关
     {
      path: 'dealerList/activeList',
      meta: {
        requiresAuth: true,
        title: '授权人员列表',
        access: 621
      },
      title: '授权人员列表',
      name: 'activeList',
      component: resolve => {
        require(['@/views/dealer/detail/active-user-list.vue'],
          resolve);
      }
    },
  ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
  // {
  //     path: '/group',
  //     icon: 'ios-folder',
  //     name: 'group',
  //     title: 'Group',
  //     component: Main,
  //     children: [
  //         {
  //             path: 'page1',
  //             meta: {
  //                 requiresAuth: true
  //             },
  //             icon: 'ios-paper-outline',
  //             name: 'page1',
  //             title: 'Page1',
  //             component: resolve => { require(['@/views/group/page1/page1.vue'], resolve); }
  //         },
  //         {
  //             path: 'page2',
  //             meta: {
  //                 requiresAuth: true
  //             },
  //             icon: 'ios-list-outline',
  //             name: 'page2',
  //             title: 'Page2',
  //             component: resolve => { require(['@/views/group/page2/page2.vue'], resolve); }
  //         }
  //     ]
  // },
  {
    path: '/UserManage',
    icon: 'ios-paper',
    title: '用户管理',
    access: 2,
    name: 'UserManage',
    component: Main,
    children: [{
        path: 'ToolUserList',
        meta: {
          requiresAuth: true,
          access: 21,
          title: '后台用户列表'
        },
        title: '后台用户列表',
        name: 'tool_user_list',
        component: resolve => {
          require(['@/views/user/tool-user-list.vue'], resolve);
        }
      },
      {
        path: 'FrontEndUserList',
        meta: {
          requiresAuth: true,
          access: 22,
          title: '前端用户列表'
        },
        title: '前端用户列表',
        name: 'front_end_user_list',
        component: resolve => {
          require(['@/views/user/front-end-user-list.vue'], resolve)
        }
      },
      {
        path: 'ExchangeUserList',
        meta: {
          requiresAuth: true,
          access: 23,
          title: '兑换用户列表'
        },
        title: '兑换用户列表',
        name: 'exchange-user-list',
        component: resolve => {
          require(['@/views/user/exchange-user-list.vue'], resolve)
        }
      }
    ]
  },
  {
    path: '/SubjectManage',
    icon: 'ios-paper',
    title: '课程管理',
    access: 3,
    name: 'SubjectManage',
    component: Main,
    children: [{
        path: 'BannerList',
        meta: {
          requiresAuth: true,
          title: "广告列表",
          access: 31
        },
        title: "广告列表",
        name: 'banner_list',
        component: resolve => {
          require(['@/views/book/banner-list.vue'], resolve);
        }
      },
      {
        path: 'SubjectList',
        meta: {
          requiresAuth: true,
          title: "课程列表",
          access: 32
        },
        title: "课程列表",
        name: 'subject_list',
        component: resolve => {
          require(['@/views/book/subject-list.vue'], resolve);
        }
      },
      {
        path: 'teacher_list',
        meta: {
          requiresAuth: true,
          title: "教师列表",
          access: 34
        },
        title: "教师列表",
        name: 'teacher_list',
        component: resolve => {
          require(['@/views/book/teacher-list.vue'], resolve);
        }
      },
      {
        path: 'discount_list',
        meta: {
          requiresAuth: true,
          title: "优惠券列表",
          access: 35
        },
        title: "优惠券列表",
        name: 'discount_list',
        component: resolve => {
          require(['@/views/book/discount-list.vue'], resolve);
        }
      },
      {
        path: 'Resource',
        meta: {
          requiresAuth: true,
          title: '资源列表',
          access: 34
        },
        title: '资源列表',
        name: 'resource',
        component: resolve => {
          require(['@/views/subject/resource-list.vue'], resolve);
        }
      },
      {
        path: 'Subject',
        meta: {
          requiresAuth: true,
          title: '评论列表',
          access: 35
        },
        name: 'Subject',
        title: '评论列表',
        component: resolve => {
          require(['@/views/subject/comment-list.vue'],
            resolve);
        }
      },
      {
        path: 'BookOrderList',
        meta: {
          requiresAuth: true,
          title: '订单列表',
          access: 37
        },
        name: 'book_order_list',
        title: '订单列表',
        component: resolve => {
          require(['@/views/book/book-order-list.vue'], resolve)
        }
      },
      {
        path: 'moduleManage',
        meta: {
          requiresAuth: true,
          title: '板块管理',
          access: 37
        },
        name: 'module_manage',
        title: '板块管理',
        component: resolve => {
          require(['@/views/book/module_manage.vue'], resolve)
        }
      }
    ]
  },
  {
    path: '/BookManage',
    icon: 'ios-paper',
    title: '图书管理',
    access: 3,
    name: 'BookManage',
    component: Main,
    children: [
      // {
      //     path: 'SubjectList',
      //     meta: {
      //         requiresAuth: true,
      //         title: "课程列表",
      //         access: 32
      //     },
      //     title: "课程列表",
      //     name: 'subject_list',
      //     component: resolve => {
      //         require(['@/views/book/subject-list.vue'], resolve);
      //     }
      // },
      // {
      //     path: 'recommendSubject',
      //     meta: {
      //         requiresAuth: true,
      //         title: "推荐课程",
      //         access: 33
      //     },
      //     title: "推荐课程",
      //     name: 'recommend_subject',
      //     component: resolve => {
      //         require(['@/views/book/recommend-subject.vue'], resolve);
      //     }
      // },
      // {
      //     path: 'teacher_list',
      //     meta: {
      //         requiresAuth: true,
      //         title: "教师列表",
      //         access: 34
      //     },
      //     title: "教师列表",
      //     name: 'teacher_list',
      //     component: resolve => {
      //         require(['@/views/book/teacher-list.vue'], resolve);
      //     }
      // },
      // {
      //     path: 'discount_list',
      //     meta: {
      //         requiresAuth: true,
      //         title: "优惠券列表",
      //         access: 35
      //     },
      //     title: "优惠券列表",
      //     name: 'discount_list',
      //     component: resolve => {
      //         require(['@/views/book/discount-list.vue'], resolve);
      //     }
      // },
      {
        path: 'BookList',
        meta: {
          requiresAuth: true,
          title: "图书列表",
          access: 33
        },
        title: "图书列表",
        name: 'book_list',
        component: resolve => {
          require(['@/views/book/book-list.vue'], resolve);
        }
      },
      {
        path: 'ResourceList',
        meta: {
          requiresAuth: true,
          title: '资源列表',
          access: 34
        },
        title: '资源列表',
        name: 'resource_list',
        component: resolve => {
          require(['@/views/book/resource-list.vue'], resolve);
        }
      },
      {
        path: 'CommentList',
        meta: {
          requiresAuth: true,
          title: '评论列表',
          access: 35
        },
        name: 'comment_list',
        title: '评论列表',
        component: resolve => {
          require(['@/views/book/comment-list.vue'],
            resolve);
        }
      },
      {
        path: 'ConfigList',
        meta: {
          requiresAuth: true,
          title: '系统配置',
          access: 36
        },
        name: 'config_list',
        title: '系统配置',
        component: resolve => {
          require(['@/views/book/config-list.vue'], resolve)
        }
      },
      // {
      //     path: 'BookOrderList',
      //     meta: {
      //         requiresAuth: true,
      //         title: '订单列表',
      //         access: 37
      //     },
      //     name: 'book_order_list',
      //     title: '订单列表',
      //     component: resolve => {
      //         require(['@/views/book/book-order-list.vue'], resolve)
      //     }
      // }
    ]
  },
  /* {
      path: '/ResourceManage',
      icon: 'ios-paper',
      title: '资源管理',
      access: 4,
      name: 'ResourceManage', 
      component: Main,
      children: [
          {
              path: 'ResourceList',
              meta: {
                  requiresAuth: true,
                  title: '资源管理',
                  access: 4
              },  name: 'resource_list', component: resolve => { require(['@/views/resource/list.vue'], resolve); }
          }
      ]
  }, */
  // {
  //   path: '/DailyEnglish',
  //   icon: 'ios-paper',
  //   title: '每日英语',
  //   access: 5,
  //   name: "DailyEnglish",
  //   component: Main,
  //   children: [{
  //       path: 'BannerManage',
  //       meta: {
  //         requiresAuth: true,
  //         title: '广告管理',
  //         access: 51
  //       },
  //       title: '广告管理',
  //       name: 'DEBannerManage',
  //       component: resolve => {
  //         require(['@/views/daily-english/banner-list.vue'],
  //           resolve);
  //       }
  //     },
  //     {
  //       path: 'ArticleManage',
  //       meta: {
  //         requiresAuth: true,
  //         title: '文章管理',
  //         access: 52
  //       },
  //       name: 'DEArticleManage',
  //       title: '文章管理',
  //       component: resolve => {
  //         require(['@/views/daily-english/article-list.vue'],
  //           resolve);
  //       }
  //     },
  //     {
  //       path: 'CategoryManage',
  //       meta: {
  //         requiresAuth: true,
  //         title: '专栏管理',
  //         access: 53
  //       },
  //       name: 'DECategoryManage',
  //       title: '专栏管理',
  //       component: resolve => {
  //         require(['@/views/daily-english/category-list.vue'],
  //           resolve);
  //       }
  //     },
  //     {
  //       path: 'CommentManage',
  //       meta: {
  //         requiresAuth: true,
  //         title: '评论管理',
  //         access: 54
  //       },
  //       name: 'DECommentManage',
  //       title: '评论管理',
  //       component: resolve => {
  //         require(['@/views/daily-english/comment-list.vue'],
  //           resolve);
  //       }
  //     },
  //     {
  //       path: 'SourceManage',
  //       meta: {
  //         requiresAuth: true,
  //         title: '资源管理',
  //         access: 55
  //       },
  //       name: 'DESourceManage',
  //       title: '资源管理',
  //       component: resolve => {
  //         require(['@/views/daily-english/source-list.vue'],
  //           resolve);
  //       }
  //     },
  //     {
  //       path: 'ExamManage',
  //       meta: {
  //         requiresAuth: true,
  //         title: '练习管理',
  //         access: 55
  //       },
  //       name: 'DEExamManage',
  //       title: '练习管理',
  //       component: resolve => {
  //         require(['@/views/daily-english/exam-list.vue'],
  //           resolve);
  //       }
  //     },
  //     {
  //       path: 'QuestionManage',
  //       meta: {
  //         requiresAuth: true,
  //         title: '试题管理',
  //         access: 56
  //       },
  //       name: 'DEQuestionManage',
  //       title: '试题管理',
  //       component: resolve => {
  //         require(['@/views/daily-english/question-list.vue'],
  //           resolve);
  //       }
  //     }
  //   ]
  // },
  {
    path: '/QuesLottery',
    icon: 'ios-paper',
    title: '有奖反馈',
    access: 6,
    name: "QuesLottery",
    component: Main,
    children: [{
        path: 'QuestionnaireList',
        meta: {
          requiresAuth: true,
          title: '问卷列表',
          access: 61
        },
        title: '问卷列表',
        name: 'QuestionnaireList',
        component: resolve => {
          require(['@/views/questionnaire-lottery/questionnaire-list.vue'],
            resolve);
        }
      },
      {
        path: 'UserQuestionnaireList',
        meta: {
          requiresAuth: true,
          title: '答卷列表',
          access: 62
        },
        title: '答卷列表',
        name: 'UserQuestionnaireList',
        component: resolve => {
          require(['@/views/questionnaire-lottery/user-questionnaire-list.vue'],
            resolve);
        }
      },
      {
        path: 'lottery-setting',
        meta: {
          requiresAuth: true,
          title: '抽奖设置',
          access: 63
        },
        title: '抽奖设置',
        name: 'LotterySetting',
        component: resolve => {
          require(['@/views/questionnaire-lottery/lottery-setting.vue'],
            resolve);
        }
      },
      {
        path: 'lottery-result',
        meta: {
          requiresAuth: true,
          title: '中奖结果',
          access: 64
        },
        title: '中奖结果',
        name: 'LotteryResult',
        component: resolve => {
          require(['@/views/questionnaire-lottery/lottery-result.vue'],
            resolve);
        }
      }
    ]
  },
  {
    path: '/SignUp',
    icon: 'ios-paper',
    title: '天利商城',
    access: 7,
    name: 'SignUp',
    component: Main,
    children: [{
        path: 'BannerManage',
        meta: {
          requiresAuth: true,
          title: '广告管理',
          access: 75
        },
        title: '广告管理',
        name: 'SUBannerManage',
        component: resolve => {
          require(['@/views/sign-up/banner-list.vue'],
            resolve);
        }
      },
      {
        path: 'ProductList',
        meta: {
          requiresAuth: true,
          title: '产品列表',
          access: 71
        },
        title: '产品列表',
        name: 'ProductList',
        component: resolve => {
          require(['@/views/sign-up/productList.vue'],
            resolve);
        }
      },
      {
        path: 'OrderList',
        meta: {
          requiresAuth: true,
          title: '订单列表',
          access: 72
        },
        title: '订单列表',
        name: 'OrderList',
        component: resolve => {
          require(['@/views/sign-up/orderList.vue'],
            resolve);
        }
      },
      {
        path: 'Verification',
        meta: {
          requiresAuth: true,
          title: '课程兑换码',
          access: 73
        },
        title: '课程兑换码',
        name: 'Verification',
        component: resolve => {
          require(['@/views/settings/verification-code.vue'],
            resolve);
        }
      },
      {
        path: 'SaleList',
        meta: {
          requiresAuth: true,
          title: '销售模式列表',
          access: 74
        },
        title: '销售模式列表',
        name: 'SaleList',
        component: resolve => {
          require(['@/views/sign-up/saleList.vue'],
            resolve);
        }
      },
      {
        path: 'dealerList',
        meta: {
          requiresAuth: true,
          title: '经销商列表',
          access: 74
        },
        title: '经销商列表',
        name: 'dealerList',
        component: resolve => {
          require(['@/views/dealer/dealer-list.vue'],
            resolve);
        }
      },{
        path: 'activeUserList',
        meta: {
          requiresAuth: true,
          title: '激活列表',
          access: 74
        },
        title: '激活列表',
        name: 'activeUserList',
        component: resolve => {
          require(['@/views/dealer/detail/active-user-list.vue'],
            resolve);
        }
      },{
        path: 'withdrawList',
        meta: {
          requiresAuth: true,
          title: '提现列表',
          access: 74
        },
        title: '提现列表',
        name: 'withdrawList',
        component: resolve => {
          require(['@/views/dealer/withdraw-list.vue'],
            resolve);
        }
      }
    ]
  },
  {
    path: '/Statistics',
    icon: 'ios-paper',
    title: '统计分析',
    access: 7,
    name: 'Staitstics',
    component: Main,
    children: [{
      path: 'EventStat',
      meta: {
        requiresAuth: true,
        title: '事件统计',
        access: 75
      },
      title: '事件统计',
      name: 'EventStat',
      component: resolve => {
        require(['@/views/statistics/event-stat.vue'],
          resolve);
      }
    }]
  }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
  loginRouter,
  otherRouter,
  ...appRouter,
  page500,
  page403,
  page404
];