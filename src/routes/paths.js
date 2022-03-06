// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';
const ROOTS_SALEPAGE = '/sale-page';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  register: path(ROOTS_AUTH, '/register'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  verify: path(ROOTS_AUTH, '/verify')
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page404: '/404',
  page500: '/500',
  components: '/components'
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
    ecommerce: path(ROOTS_DASHBOARD, '/ecommerce'),
    analytics: path(ROOTS_DASHBOARD, '/analytics'),
    banking: path(ROOTS_DASHBOARD, '/banking'),
    booking: path(ROOTS_DASHBOARD, '/booking')
  },
  mail: {
    root: path(ROOTS_DASHBOARD, '/mail'),
    all: path(ROOTS_DASHBOARD, '/mail/all')
  },
  chat: {
    root: path(ROOTS_DASHBOARD, '/chat'),
    new: path(ROOTS_DASHBOARD, '/chat/new'),
    conversation: path(ROOTS_DASHBOARD, '/chat/:conversationKey')
  },
  calendar: path(ROOTS_DASHBOARD, '/calendar'),
  kanban: path(ROOTS_DASHBOARD, '/kanban'),
  todo: {
    root: path(ROOTS_DASHBOARD, '/todo'),
    list: path(ROOTS_DASHBOARD, '/todo/list'),
    newTodo: path(ROOTS_DASHBOARD, '/todo/new'),
    editById: path(ROOTS_DASHBOARD, `/todo/-1/edit`)
  },
  myCustomProduct: {
    root: path(ROOTS_DASHBOARD, '/my-custom-product'),
    list: path(ROOTS_DASHBOARD, '/my-custom-product/list'),
    newMyCustomProduct: path(ROOTS_DASHBOARD, '/my-custom-product/new'),
    editById: path(ROOTS_DASHBOARD, `/my-custom-product/-1/edit`)
  },
  myCustomUser: {
    root: path(ROOTS_DASHBOARD, '/my-custom-user'),
    list: path(ROOTS_DASHBOARD, '/my-custom-user/list')
  },
  importOrder: {
    root: path(ROOTS_DASHBOARD, '/import-order'),
    list: path(ROOTS_DASHBOARD, '/import-order/list'),
    newImportOrder: path(ROOTS_DASHBOARD, '/import-order/new'),
    detail: path(ROOTS_DASHBOARD, `/import-order/-1/-1/detail`)
  },
  bill: {
    root: path(ROOTS_DASHBOARD, '/bill'),
    list: path(ROOTS_DASHBOARD, '/bill/list'),
    detail: path(ROOTS_DASHBOARD, `/bill/-1/-1/-1/detail`)
  },
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    profile: path(ROOTS_DASHBOARD, '/user/profile'),
    cards: path(ROOTS_DASHBOARD, '/user/cards'),
    list: path(ROOTS_DASHBOARD, '/user/list'),
    newUser: path(ROOTS_DASHBOARD, '/user/new'),
    editById: path(ROOTS_DASHBOARD, `/user/reece-chung/edit`),
    account: path(ROOTS_DASHBOARD, '/user/account')
  },
  eCommerce: {
    root: path(ROOTS_DASHBOARD, '/e-commerce'),
    shop: path(ROOTS_DASHBOARD, '/e-commerce/shop'),
    product: path(ROOTS_DASHBOARD, '/e-commerce/product/:name'),
    productById: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-air-force-1-ndestrukt'),
    list: path(ROOTS_DASHBOARD, '/e-commerce/list'),
    newProduct: path(ROOTS_DASHBOARD, '/e-commerce/product/new'),
    editById: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-blazer-low-77-vintage/edit'),
    checkout: path(ROOTS_DASHBOARD, '/e-commerce/checkout'),
    invoice: path(ROOTS_DASHBOARD, '/e-commerce/invoice')
  },
  blog: {
    root: path(ROOTS_DASHBOARD, '/blog'),
    posts: path(ROOTS_DASHBOARD, '/blog/posts'),
    post: path(ROOTS_DASHBOARD, '/blog/post/:title'),
    postById: path(ROOTS_DASHBOARD, '/blog/post/apply-these-7-secret-techniques-to-improve-event'),
    newPost: path(ROOTS_DASHBOARD, '/blog/new-post')
  }
};

export const PATH_SALEPAGE = {
  root: ROOTS_SALEPAGE,
  shop: path(ROOTS_SALEPAGE, '/shop'),
  product: path(ROOTS_SALEPAGE, '/product/:id'),
  checkout: path(ROOTS_SALEPAGE, '/checkout'),
  myBill: path(ROOTS_SALEPAGE, '/my-bills')
};

export const PATH_DOCS = 'https://docs-minimals.vercel.app/introduction';
