// Base paths
const BASE_PATHS = {
  ROOT: "/",
  AUTH: "/auth",
  ADMIN: "/admin",
  STARTER: "/starter",
  MANAGE_USER: "/admin/manage-user",
  MANAGE_QUESTION: "/admin/manage-question",
  MANAGE_LIBRARY: "/admin/manage-library",
  MANAGE_STATISTICS: "/admin/manage-statistic",
  MANAGE_SYSTEM: "/admin/manage-system",
} as const;

// Public routes
const PUBLIC = {
  HOME: BASE_PATHS.ROOT,
  LIBRARY: "/library",
  MAP: "/ky-gioi",
  ABOUT: "/about-us",
  PRODUCTS: "/products",
  CONTACT: "/contact",
  PLAY_GROUND: "/starter/test-playground",
  TEST_PLAYGROUND_RESULT: "/starter/test-playground-result",
} as const;

// Auth routes
const AUTH = {
  LOGIN: `${BASE_PATHS.AUTH}/login`,
  REGISTER: `${BASE_PATHS.AUTH}/register`,
  FORGOT_PASSWORD: `${BASE_PATHS.AUTH}/forgot-password`,
  VERIFY_OTP: `${BASE_PATHS.AUTH}/verify-otp`,
  RESET_PASSWORD: `${BASE_PATHS.AUTH}/reset-password`,
  VERIFY_EMAIL: `${BASE_PATHS.AUTH}/verify-email`,
  UNAUTHORIZED: `${BASE_PATHS.AUTH}/unauthorized`,
  LOGOUT: "/logout",
} as const;

// Admin dashboard routes
const ADMIN_DASHBOARD = {
  USER: {
    INFO: `${BASE_PATHS.MANAGE_USER}/info`,
    POINTS: `${BASE_PATHS.MANAGE_USER}/points`,
    GIFT_CODE: `${BASE_PATHS.MANAGE_USER}/gift-code`,
    SUBMITTED_IMAGE: `${BASE_PATHS.MANAGE_USER}/submitted-image`,
    SENT_MAIL: `${BASE_PATHS.MANAGE_USER}/sent-mail`,
    TRANSACTIONS: `${BASE_PATHS.MANAGE_USER}/transactions`,
    NOTIFICATIONS: `${BASE_PATHS.MANAGE_USER}/notifications`,
    SETTINGS: `${BASE_PATHS.MANAGE_USER}/settings`,
    LOGS: `${BASE_PATHS.MANAGE_USER}/logs`,
    REPORTS: `${BASE_PATHS.MANAGE_USER}/reports`,
    ANALYTICS: `${BASE_PATHS.MANAGE_USER}/analytics`,
  },
  CONTENT: {
    INFO: `${BASE_PATHS.ADMIN}/content-info`,
    CREATE: `${BASE_PATHS.ADMIN}/content-create`,
    EDIT: `${BASE_PATHS.ADMIN}/content-edit`,
    LIST: `${BASE_PATHS.ADMIN}/content-list`,
  },
  QUESTION: {
    BANK: `${BASE_PATHS.MANAGE_QUESTION}/question-bank`,
    STATISTICS: `${BASE_PATHS.MANAGE_QUESTION}/question-statistics`,
  },
  LIBRARY: {
    CARD: `${BASE_PATHS.MANAGE_LIBRARY}/card`,
    CARD_STORY: `${BASE_PATHS.MANAGE_LIBRARY}/card-story`,
    LIB_CARD: `${BASE_PATHS.MANAGE_LIBRARY}/lib-card`,
    KY_NHAN_LIST: `${BASE_PATHS.MANAGE_LIBRARY}/ky-nhan-list`,
    KY_NHAN_SUMMARY: `${BASE_PATHS.MANAGE_LIBRARY}/ky-nhan-summary`,
  },
  STATISTICS: {
    OVERVIEW: `${BASE_PATHS.MANAGE_STATISTICS}/overview`,
    USER: `${BASE_PATHS.MANAGE_STATISTICS}/user`,
  },
  SYSTEM: {
    RELEASE_DATE: `${BASE_PATHS.MANAGE_SYSTEM}/release-date`,
  },
} as const;

const STARTER = {
  ENTRY_TEST: `${BASE_PATHS.STARTER}/entry-test`,
  PERSONALITY_RESULT: `${BASE_PATHS.STARTER}/personality-result`,
  SELECT_CHARACTER: `${BASE_PATHS.STARTER}/select-character`,
  TEST_PLAYGROUND: `${BASE_PATHS.STARTER}/test-playground`,
  TEST_PLAYGROUND_RESULT: `${BASE_PATHS.STARTER}/test-playground-result`,
};

export const ROUTES = {
  AUTH,
  ADMIN_DASHBOARD,
  STARTER,
  PUBLIC,
  BASE_PATHS,
} as const;

// Type exports for better TypeScript support
export type RouteKeys = keyof typeof ROUTES;
export type AuthRoutes = keyof typeof AUTH;
export type AdminRoutes = keyof typeof ADMIN_DASHBOARD;
export type PublicRoutes = keyof typeof PUBLIC;
export type StarterRoutes = keyof typeof STARTER;
