export const sidebarConfig = [
  // =============================
  // DASHBOARD
  // =============================
  {
    label: "Dashboard",
    icon: "FiHome",
    path: "/dashboard",
    permission: "DASHBOARD.VIEW",
  },

  // =============================
  // TENANT MANAGEMENT (Platform)
  // =============================
  {
    label: "Tenant Management",
    icon: "FiLayers",
    permission: "TENANTS.VIEW",
    children: [
      {
        label: "All Tenants",
        path: "/tenants",
        permission: "TENANTS.VIEW",
      },
      {
        label: "Create Tenant",
        path: "/tenants/create",
        permission: "TENANTS.CREATE",
      },
      {
        label: "Suspended Tenants",
        path: "/tenants/suspended",
        permission: "TENANTS.SUSPEND",
      },
    ],
  },

  // =============================
  // SUBSCRIPTION & BILLING
  // =============================
  {
    label: "Subscriptions",
    icon: "FiCreditCard",
    permission: "SUBSCRIPTIONS.VIEW",
    children: [
      {
        label: "Plans",
        path: "/subscriptions/plans",
        permission: "PLANS.VIEW",
      },
      {
        label: "Plan Features",
        path: "/subscriptions/features",
        permission: "PLAN_FEATURES.VIEW",
      },
      {
        label: "Tenant Subscriptions",
        path: "/subscriptions/tenants",
        permission: "TENANT_SUBSCRIPTIONS.VIEW",
      },
      {
        label: "Billing & Invoices",
        path: "/billing",
        permission: "BILLING.VIEW",
      },
    ],
  },

  // =============================
  // IAM (Role & Access)
  // =============================
  {
    label: "Access Control",
    icon: "FiShield",
    permission: "ROLES.VIEW",
    children: [
      {
        label: "Roles",
        path: "/roles",
        permission: "ROLES.VIEW",
      },
      {
        label: "Permissions",
        path: "/permissions",
        permission: "PERMISSIONS.VIEW",
      },
      {
        label: "Platform Users",
        path: "/platform-users",
        permission: "PLATFORM_USERS.VIEW",
      },
    ],
  },

  // =============================
  // CASE MANAGEMENT (Tenant Side)
  // =============================
  {
    label: "Cases",
    icon: "FiFileText",
    permission: "CASES.VIEW",
    children: [
      {
        label: "All Cases",
        path: "/cases",
        permission: "CASES.VIEW",
      },
      {
        label: "Create Case",
        path: "/cases/create",
        permission: "CASES.CREATE",
      },
      {
        label: "Reports",
        path: "/cases/reports",
        permission: "REPORTS.VIEW",
      },
    ],
  },

  // =============================
  // LAB / SAMPLE MANAGEMENT
  // =============================
  {
    label: "Lab Operations",
    icon: "FiActivity",
    permission: "SAMPLES.VIEW",
    children: [
      {
        label: "Samples",
        path: "/samples",
        permission: "SAMPLES.VIEW",
      },
      {
        label: "Test Types",
        path: "/test-types",
        permission: "TEST_TYPES.VIEW",
      },
      {
        label: "Results Entry",
        path: "/results",
        permission: "RESULTS.CREATE",
      },
    ],
  },

  // =============================
  // FINANCE
  // =============================
  {
    label: "Finance",
    icon: "FiDollarSign",
    permission: "FINANCE.VIEW",
    children: [
      {
        label: "Revenue",
        path: "/finance/revenue",
        permission: "REVENUE.VIEW",
      },
      {
        label: "Expenses",
        path: "/finance/expenses",
        permission: "EXPENSES.VIEW",
      },
      {
        label: "Payouts",
        path: "/finance/payouts",
        permission: "PAYOUTS.VIEW",
      },
    ],
  },

  // =============================
  // ANALYTICS
  // =============================
  {
    label: "Analytics & Reports",
    icon: "FiBarChart2",
    permission: "ANALYTICS.VIEW",
    children: [
      {
        label: "Usage Analytics",
        path: "/analytics/usage",
        permission: "USAGE_ANALYTICS.VIEW",
      },
      {
        label: "Revenue Reports",
        path: "/analytics/revenue",
        permission: "REVENUE_REPORTS.VIEW",
      },
      {
        label: "System Reports",
        path: "/analytics/system",
        permission: "SYSTEM_REPORTS.VIEW",
      },
    ],
  },

  // =============================
  // MONITORING
  // =============================
  {
    label: "Monitoring",
    icon: "FiMonitor",
    permission: "MONITORING.VIEW",
    children: [
      {
        label: "System Health",
        path: "/monitoring/health",
        permission: "SYSTEM_HEALTH.VIEW",
      },
      {
        label: "Incidents",
        path: "/monitoring/incidents",
        permission: "INCIDENTS.VIEW",
      },
      {
        label: "Logs",
        path: "/monitoring/logs",
        permission: "LOGS.VIEW",
      },
    ],
  },

  // =============================
  // SETTINGS
  // =============================
  {
    label: "Configuration",
    icon: "FiSettings",
    permission: "SETTINGS.VIEW",
    children: [
      {
        label: "Platform Settings",
        path: "/settings/platform",
        permission: "PLATFORM_SETTINGS.UPDATE",
      },
      {
        label: "Tenant Settings",
        path: "/settings/tenant",
        permission: "TENANT_SETTINGS.UPDATE",
      },
      {
        label: "Feature Flags",
        path: "/settings/feature-flags",
        permission: "FEATURE_FLAGS.UPDATE",
      },
    ],
  },
];