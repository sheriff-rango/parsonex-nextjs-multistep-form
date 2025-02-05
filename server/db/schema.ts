import {
  pgTable,
  serial,
  integer,
  varchar,
  numeric,
  date,
  timestamp,
  boolean,
  foreignKey,
  text,
  index,
  check,
  unique,
  smallint,
  jsonb,
  uuid,
  interval,
  char,
  primaryKey,
  pgSequence,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const usersUseridSeq = pgSequence("users_userid_seq", {
  startWith: "1",
  increment: "1",
  minValue: "1",
  maxValue: "9223372036854775807",
  cache: "1",
  cycle: false,
});
export const repsRepIdSeq = pgSequence("reps_rep_id_seq", {
  startWith: "1",
  increment: "1",
  minValue: "1",
  maxValue: "9223372036854775807",
  cache: "1",
  cycle: false,
});

export const giftblotter = pgTable("giftblotter", {
  giftid: serial().primaryKey().notNull(),
  repid: integer().notNull(),
  fundcompany: varchar({ length: 100 }).notNull(),
  fundcompanycontact: varchar({ length: 100 }),
  giftdescription: varchar({ length: 200 }).notNull(),
  gifttype: varchar({ length: 50 }).notNull(),
  dollarvalue: numeric({ precision: 12, scale: 2 }).notNull(),
  datereceived: date().notNull(),
  datecreated: timestamp({ mode: "string" }).notNull(),
});

export const listTimeHorizon = pgTable("list_time_horizon", {
  id: serial().primaryKey().notNull(),
  name: varchar({ length: 255 }).notNull(),
});

export const psiAccounts = pgTable("psi_accounts", {
  accountId: varchar("account_id")
    .default(sql`nextval('psi_accounts_psiaccountid_seq'::regclass)`)
    .primaryKey()
    .notNull(),
  searchid: varchar({ length: 50 }),
  estDate: date("est_date").default(sql`CURRENT_DATE`),
  tin: varchar({ length: 20 }),
  lastupdated: timestamp({ mode: "string" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  accountType: varchar("account_type", { length: 50 }),
  date17A3: date("date_17a3"),
  method17A3: varchar("method_17a3", { length: 100 }),
  emailAuth: boolean("email_auth"),
  ownerId: varchar("owner_id"),
  owner2Id: varchar("owner2_id"),
  status: varchar(),
  termDate: date("term_date"),
  invObjective: varchar("inv_objective"),
  riskTolerance: varchar("risk_tolerance"),
  timeHorizon: varchar("time_horizon"),
  pcm: varchar(),
  branch: varchar(),
  registration1: varchar("registration_1"),
  registration2: varchar("registration_2"),
  registration3: varchar("registration_3"),
  clientResState: varchar("client_res_state"),
  accountEmail: varchar("account_email"),
});

export const wfItemStatusHistory = pgTable(
  "wf_item_status_history",
  {
    historyid: serial().primaryKey().notNull(),
    workItemId: integer("work_item_id"),
    statusId: integer("status_id"),
    changedBy: varchar("changed_by"),
    changedOn: timestamp("changed_on", { mode: "string" }).default(
      sql`CURRENT_TIMESTAMP`,
    ),
    notes: text(),
  },
  (table) => [
    foreignKey({
      columns: [table.workItemId],
      foreignColumns: [wfItem.workItemId],
      name: "wf_item_status_history_workitemid_fkey",
    }),
    foreignKey({
      columns: [table.statusId],
      foreignColumns: [wfStatus.statusId],
      name: "wf_item_status_history_statusid_fkey",
    }),
  ],
);

export const repRegistrations = pgTable(
  "rep_registrations",
  {
    registrationId: integer("registration_id").primaryKey().notNull(),
    repId: integer("rep_id").notNull(),
    registrationType: varchar("registration_type", { length: 50 }).notNull(),
    registrationNumber: varchar("registration_number", { length: 20 }),
    status: varchar({ length: 20 }).notNull(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date"),
    npn: varchar({ length: 50 }),
    crd: varchar({ length: 50 }),
    iard: varchar({ length: 50 }),
  },
  (table) => [
    index("idx_rep_registrations_repid").using(
      "btree",
      table.repId.asc().nullsLast().op("int4_ops"),
    ),
    index("idx_rep_registrations_type").using(
      "btree",
      table.registrationType.asc().nullsLast().op("text_ops"),
    ),
    check(
      "chk_registration_status",
      sql`(status)::text = ANY ((ARRAY['Active'::character varying, 'Pending'::character varying, 'Terminated'::character varying])::text[])`,
    ),
  ],
);

export const psiSuitabilityMf = pgTable("psi_suitability_mf", {
  mfsuitabilityid: serial().primaryKey().notNull(),
  accountid: integer().notNull(),
  liquidatedinvestmentname: varchar({ length: 100 }),
  originalpurchasedate: date(),
  originalinvestmentamount: numeric({ precision: 12, scale: 2 }),
  lastdepositdate: date(),
  last36Motransfer: boolean(),
  previoussurrendercharge: numeric({ precision: 12, scale: 2 }),
  intendeduseofaccount: text(),
  distributionmethods: text(),
  anticipatedfirstdistribution: varchar({ length: 20 }),
  shareclass: varchar({ length: 50 }),
  csharetimehorizonover3Years: boolean(),
  asharetimehorizonover3Years: boolean(),
  shareclasssuitabilitydetails: text(),
  sharecomparisoninitial: numeric({ precision: 12, scale: 2 }),
  sharecomparisonror: numeric({ precision: 5, scale: 2 }),
  sharecomparisonperiod: varchar({ length: 20 }),
  asharefuturevalue: numeric({ precision: 12, scale: 2 }),
  ashareannualoperatingexpenses: numeric({ precision: 12, scale: 2 }),
  asharesalescharge: numeric({ precision: 5, scale: 2 }),
  asharecdsc: numeric({ precision: 12, scale: 2 }),
  asharetotalcost: numeric({ precision: 12, scale: 2 }),
  csharefuturevalue: numeric({ precision: 12, scale: 2 }),
  cshareannualoperatingexpenses: numeric({ precision: 12, scale: 2 }),
  csharesalescharge: numeric({ precision: 5, scale: 2 }),
  csharecdsc: numeric({ precision: 12, scale: 2 }),
  csharetotalcost: numeric({ precision: 12, scale: 2 }),
  additionalinformation: text(),
  previousfundexperience: boolean(),
  initialinvestmentamount: numeric({ precision: 12, scale: 2 }),
  surrenderperiod: varchar({ length: 50 }),
  createdon: timestamp({ mode: "string" }).notNull(),
});

export const repCommissions = pgTable(
  "rep_commissions",
  {
    commissionId: serial("commission_id").primaryKey().notNull(),
    transactionId: integer("transaction_id"),
    accountId: integer("account_id"),
    repId: integer("rep_id"),
    productType: varchar("product_type", { length: 50 }).notNull(),
    role: varchar({ length: 50 }).notNull(),
    rateId: integer("rate_id"),
    calculatedAmount: numeric("calculated_amount", {
      precision: 15,
      scale: 2,
    }).notNull(),
    payoutDate: timestamp("payout_date", { mode: "string" }).notNull(),
    payoutStatus: varchar("payout_status", { length: 20 }).default("Pending"),
    createdOn: timestamp("created_on", { mode: "string" }).default(
      sql`CURRENT_TIMESTAMP`,
    ),
    lastUpdated: timestamp("last_updated", { mode: "string" }).default(
      sql`CURRENT_TIMESTAMP`,
    ),
    commissionType: varchar("commission_type", { length: 20 }).default(
      "Initial",
    ),
  },
  (table) => [
    index("idx_rep_commissions_account_id").using(
      "btree",
      table.accountId.asc().nullsLast().op("int4_ops"),
    ),
    index("idx_rep_commissions_rep_id").using(
      "btree",
      table.repId.asc().nullsLast().op("int4_ops"),
    ),
    index("idx_rep_commissions_transaction_id").using(
      "btree",
      table.transactionId.asc().nullsLast().op("int4_ops"),
    ),
    check(
      "rep_commissions_calculated_amount_check",
      sql`calculated_amount >= (0)::numeric`,
    ),
  ],
);

export const listProducts = pgTable("list_products", {
  item: serial().primaryKey().notNull(),
  addDate: timestamp("add_date", { mode: "string" }).notNull(),
  cusip: varchar({ length: 20 }),
  productFamily: varchar("product_family", { length: 50 }).notNull(),
  lastUpdated: timestamp("last_updated", { mode: "string" }),
  productName: varchar("product_name", { length: 255 }).notNull(),
  productNo: varchar("product_no", { length: 50 }),
  productOtherId: varchar("product_other_id", { length: 50 }),
  symbol: varchar({ length: 20 }),
  type: varchar({ length: 50 }),
});

export const emails = pgTable("emails", {
  emailId: serial("email_id").primaryKey().notNull(),
  refTable: varchar("ref_table", { length: 50 }).notNull(),
  refId: varchar("ref_id").notNull(),
  emailAddress: varchar("email_address", { length: 255 }),
  emailType: varchar("email_type", { length: 50 }),
  isPrimary: boolean("is_primary").default(false),
  createdAt: timestamp("created_at", { mode: "string" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
});

export const phones = pgTable(
  "phones",
  {
    phoneId: serial("phone_id").primaryKey().notNull(),
    refTable: varchar("ref_table", { length: 50 }).notNull(),
    refId: varchar("ref_id").notNull(),
    phoneType: varchar("phone_type", { length: 50 }),
    phoneNumber: varchar("phone_number", { length: 20 }),
    isPrimary: boolean("is_primary").default(false),
    createdAt: timestamp("created_at", { mode: "string" }).default(
      sql`CURRENT_TIMESTAMP`,
    ),
  },
  (table) => [
    check(
      "phones_phone_type_check",
      sql`(phone_type)::text = ANY ((ARRAY['mobile'::character varying, 'home'::character varying, 'work'::character varying, 'other'::character varying])::text[])`,
    ),
  ],
);

export const adDetail = pgTable("ad_detail", {
  advertisingdetailid: serial().primaryKey().notNull(),
  workitemid: integer(),
  hostname: varchar({ length: 100 }).notNull(),
  issponsoredevent: boolean().notNull(),
  sponsorname: varchar({ length: 100 }),
  reimbursementamount: numeric(),
  eventdate: date(),
  location: varchar({ length: 200 }),
  issocialmediahosted: boolean(),
});

export const signatures = pgTable(
  "signatures",
  {
    signatureid: serial().primaryKey().notNull(),
    envelopeid: varchar({ length: 100 }).notNull(),
    relatedid: integer().notNull(),
    relatedentitytype: varchar({ length: 50 }).notNull(),
    signaturedate: timestamp({ mode: "string" }).notNull(),
    isverified: boolean().notNull(),
    verificationmethod: varchar({ length: 100 }),
    provider: varchar({ length: 50 }).default("DocuSign").notNull(),
  },
  (table) => [
    index("idx_signatures_provider").using(
      "btree",
      table.provider.asc().nullsLast().op("text_ops"),
    ),
    check(
      "chk_signatures_relatedentitytype",
      sql`(relatedentitytype)::text = ANY ((ARRAY['account'::character varying, 'rep'::character varying, 'compliance'::character varying, 'client'::character varying])::text[])`,
    ),
  ],
);

export const wfItem = pgTable(
  "wf_item",
  {
    workItemId: serial("work_item_id").primaryKey().notNull(),
    title: varchar({ length: 150 }).notNull(),
    workTypeId: integer("work_type_id").notNull(),
    repId: integer("rep_id").notNull(),
    createdOn: timestamp("created_on", { mode: "string" }).notNull(),
    assignedTo: integer("assigned_to"),
    isVoid: boolean("is_void").notNull(),
    createdBy: integer("created_by").notNull(),
    updatedOn: timestamp("updated_on", { mode: "string" }).notNull(),
    statusId: integer("status_id"),
  },
  (table) => [
    index("idx_wf_item_assignedto").using(
      "btree",
      table.assignedTo.asc().nullsLast().op("int4_ops"),
    ),
    foreignKey({
      columns: [table.statusId],
      foreignColumns: [wfStatus.statusId],
      name: "wf_item_statusid_fkey",
    }),
  ],
);

export const wfItemQueue = pgTable(
  "wf_item_queue",
  {
    wiQueueId: serial("wi_queue_id").primaryKey().notNull(),
    workItemId: integer("work_item_id").notNull(),
    roleId: integer("role_id"),
    userId: integer("user_id"),
    queueStatus: boolean("queue_status").notNull(),
    createdOn: timestamp("created_on", { mode: "string" }).notNull(),
    updatedOn: timestamp("updated_on", { mode: "string" }),
    version: timestamp({ mode: "string" }).notNull(),
    statusId: integer("status_id"),
  },
  (table) => [
    index("idx_wf_item_queue_roleid").using(
      "btree",
      table.roleId.asc().nullsLast().op("int4_ops"),
    ),
    index("idx_wf_item_queue_userid").using(
      "btree",
      table.userId.asc().nullsLast().op("int4_ops"),
    ),
    foreignKey({
      columns: [table.workItemId],
      foreignColumns: [wfItem.workItemId],
      name: "fk_wf_item_queue_workitemid",
    }),
    foreignKey({
      columns: [table.statusId],
      foreignColumns: [wfStatus.statusId],
      name: "wf_item_queue_statusid_fkey",
    }),
  ],
);

export const repsArchived = pgTable("reps_archived", {
  pcm: varchar({ length: 15 }).primaryKey().notNull(),
  fullname: text().notNull(),
});

export const bankInfo = pgTable(
  "bank_info",
  {
    bankId: serial("bank_id").primaryKey().notNull(),
    accountId: integer("account_id"),
    bankname: varchar({ length: 100 }).notNull(),
    accounttype: varchar({ length: 50 }).notNull(),
    addressid: integer(),
    routingnumber: varchar({ length: 20 }),
    accountnumber: varchar({ length: 50 }),
    phonenumber: varchar({ length: 20 }),
    createdon: timestamp({ mode: "string" }).notNull(),
    lastupdated: timestamp({ mode: "string" }).notNull(),
    relatedEntityType: varchar("related_entity_type", { length: 20 }).notNull(),
    relatedEntityId: integer("related_entity_id").notNull(),
  },
  (table) => [
    index("idx_bank_info_accountid").using(
      "btree",
      table.accountId.asc().nullsLast().op("int4_ops"),
    ),
    check(
      "bank_info_related_entity_type_check",
      sql`(related_entity_type)::text = ANY ((ARRAY['Rep'::character varying, 'Contact'::character varying, 'Client'::character varying])::text[])`,
    ),
  ],
);

export const psiComRates = pgTable("psi_com_rates", {
  payoutId: serial("payout_id").primaryKey().notNull(),
  repId: varchar("rep_id").notNull(),
  payeeId: varchar("payee_id").notNull(),
  payoutPct: numeric("payout_pct", { precision: 5, scale: 2 }).notNull(),
  createdOn: timestamp("created_on", { mode: "string" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  lastUpdated: timestamp("last_updated", { mode: "string" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  type: varchar("type", { length: 255 }),
});

export const notifications = pgTable(
  "notifications",
  {
    notificationid: serial().primaryKey().notNull(),
    userid: integer().notNull(),
    message: text().notNull(),
    createdon: timestamp({ mode: "string" }).notNull(),
    isread: boolean().notNull(),
    notificationtype: varchar({ length: 50 }).default("General"),
    relatedid: integer(),
    relatedtype: varchar({ length: 50 }),
  },
  (table) => [
    index("idx_notifications_userid").using(
      "btree",
      table.userid.asc().nullsLast().op("int4_ops"),
    ),
  ],
);

export const summaryProduction = pgTable("summary_production", {
  id: serial().primaryKey().notNull(),
  bizDate: date("biz_date").notNull(),
  repSearchid: varchar("rep_searchid", { length: 50 }).notNull(),
  productCode: varchar("product_code", { length: 50 }).notNull(),
  productType: varchar("product_type", { length: 50 }).notNull(),
  investmentAmt: numeric("investment_amt", {
    precision: 15,
    scale: 2,
  }).notNull(),
  production: numeric({ precision: 15, scale: 2 }).notNull(),
  commissions: numeric({ precision: 15, scale: 2 }).notNull(),
  pcm: varchar(),
  isArr: boolean("isarr").notNull(),
});

export const listOrderStatus = pgTable("list_order_status", {
  id: integer().primaryKey().notNull(),
  name: varchar({ length: 50 }).notNull(),
});

export const auditLog = pgTable(
  "audit_log",
  {
    auditid: serial().primaryKey().notNull(),
    tablename: varchar({ length: 100 }).notNull(),
    recordid: integer().notNull(),
    changedby: integer().notNull(),
    changedate: timestamp({ mode: "string" }).notNull(),
    operation: varchar({ length: 20 }).notNull(),
    oldvalue: text(),
    newvalue: text(),
  },
  (table) => [
    index("idx_audit_log_tablename").using(
      "btree",
      table.tablename.asc().nullsLast().op("text_ops"),
    ),
  ],
);

export const pasHoldings = pgTable(
  "pas_holdings",
  {
    holdingId: serial("holding_id").primaryKey().notNull(),
    accountId: integer("account_id").notNull(),
    productId: integer("product_id"),
    holdingType: varchar("holding_type", { length: 50 }),
    securityName: varchar("security_name", { length: 100 }),
    securityTicker: varchar("security_ticker", { length: 10 }),
    units: numeric({ precision: 18, scale: 4 }).default("0"),
    unitPrice: numeric("unit_price", { precision: 18, scale: 4 }).default("0"),
    marketValue: numeric("market_value", {
      precision: 18,
      scale: 4,
    }).generatedAlwaysAs(sql`(units * unit_price)`),
    costBasis: numeric("cost_basis", { precision: 18, scale: 4 }),
    createdOn: timestamp("created_on", { mode: "string" }).default(
      sql`CURRENT_TIMESTAMP`,
    ),
    lastUpdated: timestamp("last_updated", { mode: "string" }).default(
      sql`CURRENT_TIMESTAMP`,
    ),
  },
  (table) => [
    foreignKey({
      columns: [table.productId],
      foreignColumns: [summaryProductType.productid],
      name: "pas_account_holdings_product_id_fkey",
    }),
  ],
);

export const reportingMetrics = pgTable("reporting_metrics", {
  metricid: serial().primaryKey().notNull(),
  metricname: varchar({ length: 100 }).notNull(),
  metricvalue: numeric({ precision: 18, scale: 2 }).notNull(),
  recordeddate: timestamp({ mode: "string" }).notNull(),
});

export const documents = pgTable(
  "documents",
  {
    documentid: serial().primaryKey().notNull(),
    relatedid: integer().notNull(),
    relatedtype: varchar({ length: 50 }).notNull(),
    documenttype: varchar({ length: 50 }).notNull(),
    documentname: varchar({ length: 150 }).notNull(),
    filepath: varchar({ length: 255 }).notNull(),
    uploadedby: integer().notNull(),
    uploadedon: timestamp({ mode: "string" }).notNull(),
    lastupdated: timestamp({ mode: "string" }),
    isactive: boolean(),
    version: timestamp({ mode: "string" }).notNull(),
    signatureId: integer("signature_id"),
  },
  (table) => [
    index("idx_documents_relatedid").using(
      "btree",
      table.relatedid.asc().nullsLast().op("int4_ops"),
    ),
    check(
      "chk_documents_relatedtype",
      sql`(relatedtype)::text = ANY ((ARRAY['account'::character varying, 'rep'::character varying, 'compliance'::character varying, 'client'::character varying])::text[])`,
    ),
  ],
);

export const wfRoles = pgTable("wf_roles", {
  roleId: serial("role_id").primaryKey().notNull(),
  rolename: varchar({ length: 50 }).notNull(),
  description: text(),
});

export const listProductFamily = pgTable(
  "list_product_family",
  {
    familyId: serial("family_id").primaryKey().notNull(),
    familyName: varchar("family_name", { length: 100 }).notNull(),
    isActive: boolean("is_active").notNull(),
    website: varchar({ length: 200 }),
    phone: varchar({ length: 25 }),
    createdOn: timestamp("created_on", { mode: "string" })
      .defaultNow()
      .notNull(),
    lastUpdated: timestamp("last_updated", { mode: "string" }),
    fanCode: varchar("fan_code", { length: 5 }),
    fanProductType: varchar("fan_product_type"),
  },
  (table) => [
    index("idx_product_family_familyname").using(
      "btree",
      table.familyName.asc().nullsLast().op("text_ops"),
    ),
  ],
);

export const pasBilling = pgTable("pas_billing", {
  billingId: serial("billing_id").primaryKey().notNull(),
  accountId: integer("account_id"),
  householdId: integer("household_id"),
  repId: integer("rep_id"),
  billType: varchar("bill_type", { length: 20 }).notNull(),
  billDateRange: varchar("bill_date_range", { length: 50 }),
  billDate: timestamp("bill_date", { mode: "string" }).notNull(),
  accountName: varchar("account_name", { length: 100 }),
  mgmtStyle: varchar("mgmt_style", { length: 50 }),
  subadvisor: varchar({ length: 100 }),
  custodianAccount: varchar("custodian_account", { length: 50 }),
  payMethod: varchar("pay_method", { length: 20 }),
  billedValue: numeric("billed_value").notNull(),
  netFees: numeric("net_fees"),
  adjustments: numeric(),
  netDue: numeric("net_due").notNull(),
  feeSchedule: varchar("fee_schedule", { length: 20 }),
  paySchedule: varchar("pay_schedule", { length: 20 }),
  subFee: numeric("sub_fee"),
  subAdj: numeric("sub_adj"),
  riaFee: numeric("ria_fee").notNull(),
  riaAdj: numeric("ria_adj"),
  managerFee: numeric("manager_fee"),
  managerAdj: numeric("manager_adj"),
  createdOn: timestamp("created_on", { mode: "string" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  lastUpdated: timestamp("last_updated", { mode: "string" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
});

export const pasComRates = pgTable("pas_com_rates", {
  payoutId: serial("payout_id").primaryKey().notNull(),
  repId: varchar("rep_id", { length: 50 }).notNull(),
  payeeId: varchar("payee_id", { length: 50 }).notNull(),
  payoutPct: numeric("payout_pct").notNull(),
  type: varchar("type", { length: 255 }),
  createdOn: timestamp("created_on", { mode: "string" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  lastUpdated: timestamp("last_updated", { mode: "string" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
});

export const repOba = pgTable("rep_oba", {
  obaid: serial().primaryKey().notNull(),
  repid: integer().notNull(),
  obatype: varchar({ length: 50 }).notNull(),
  startdate: date().notNull(),
  stopdate: date(),
  hours: integer(),
  description: text().notNull(),
  documentid: integer(),
  compliancecheckid: integer(),
  createdon: timestamp({ mode: "string" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  lastupdated: timestamp({ mode: "string" }),
});

export const userPermissions = pgTable(
  "user_permissions",
  {
    permissionid: integer().primaryKey().notNull(),
    userid: integer().notNull(),
    role: varchar({ length: 50 }),
    userGroup: varchar("user_group", { length: 50 }),
    permissiontype: varchar({ length: 50 }).notNull(),
    isactive: boolean().notNull(),
    granteddate: timestamp({ mode: "string" }).notNull(),
    revokeddate: timestamp({ mode: "string" }),
  },
  (table) => [
    index("idx_user_permissions_role").using(
      "btree",
      table.role.asc().nullsLast().op("text_ops"),
    ),
    index("idx_user_permissions_userid_role").using(
      "btree",
      table.userid.asc().nullsLast().op("int4_ops"),
      table.role.asc().nullsLast().op("int4_ops"),
    ),
  ],
);

export const fanmailDownloads = pgTable(
  "fanmail_downloads",
  {
    fileId: serial("file_id").primaryKey().notNull(),
    fileName: varchar("file_name", { length: 255 }).notNull(),
    filePath: varchar("file_path", { length: 255 }).notNull(),
    fileType: varchar("file_type", { length: 50 }).notNull(),
    uploadDate: timestamp("upload_date", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    processedDate: timestamp("processed_date", { mode: "string" }),
    status: varchar({ length: 50 }).default("Pending").notNull(),
    errorMessage: text("error_message"),
  },
  (table) => [
    index("idx_fanmail_file_name").using(
      "btree",
      table.fileName.asc().nullsLast().op("text_ops"),
    ),
    index("idx_fanmail_upload_date").using(
      "btree",
      table.uploadDate.asc().nullsLast().op("timestamp_ops"),
    ),
    check(
      "chk_fanmail_status",
      sql`(status)::text = ANY ((ARRAY['Pending'::character varying, 'Processed'::character varying, 'Failed'::character varying])::text[])`,
    ),
  ],
);

export const repLicenses = pgTable(
  "rep_licenses",
  {
    licenseid: serial().primaryKey().notNull(),
    repid: integer().notNull(),
    licensetype: varchar({ length: 50 }).notNull(),
    licensenumber: varchar({ length: 20 }),
    state: varchar({ length: 2 }).notNull(),
    status: varchar({ length: 20 }).notNull(),
    issuedate: date(),
    expirationdate: date(),
    linkedsource: varchar({ length: 100 }),
    createdon: timestamp({ mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    lastupdated: timestamp({ mode: "string" }),
  },
  (table) => [
    index("idx_rep_licenses_state").using(
      "btree",
      table.state.asc().nullsLast().op("text_ops"),
    ),
  ],
);

export const listRepTypes = pgTable(
  "list_rep_types",
  {
    id: serial().primaryKey().notNull(),
    name: varchar({ length: 50 }).notNull(),
  },
  (table) => [unique("list_rep_types_rep_type_key").on(table.name)],
);

export const listProductTypes = pgTable("list_product_types", {
  id: serial().primaryKey().notNull(),
  name: varchar().default("Unknown").notNull(),
  isarr: boolean().default(false),
});

export const repProduction = pgTable(
  "rep_production",
  {
    item: serial().primaryKey().notNull(),
    payeerepno: varchar().notNull(),
    payeesearchid: varchar({ length: 100 }).notNull(),
    productid: integer().notNull(),
    investment: numeric({ precision: 15, scale: 2 }).notNull(),
    gdc: numeric({ precision: 10, scale: 2 }).notNull(),
    commissions: numeric({ precision: 10, scale: 2 }).notNull(),
    overrides: numeric({ precision: 10, scale: 2 }).notNull(),
    totalpay: numeric({ precision: 10, scale: 2 }).notNull(),
    bizdate: date().notNull(),
    commissionSource: varchar("commission_source", { length: 20 })
      .default("Securities")
      .notNull(),
    source: varchar({ length: 20 }),
  },
  (table) => [
    index("idx_rep_production_bizdate").using(
      "btree",
      table.bizdate.asc().nullsLast().op("date_ops"),
    ),
    index("idx_rep_production_productid").using(
      "btree",
      table.productid.asc().nullsLast().op("int4_ops"),
    ),
    index("idx_rep_production_repno").using(
      "btree",
      table.payeerepno.asc().nullsLast().op("text_ops"),
    ),
    foreignKey({
      columns: [table.productid],
      foreignColumns: [summaryProductType.productid],
      name: "fk_rep_production_productid",
    }),
    check(
      "chk_commission_source",
      sql`(commission_source)::text = ANY ((ARRAY['Advisory'::character varying, 'Securities'::character varying])::text[])`,
    ),
  ],
);

export const summaryProductType = pgTable("summary_product_type", {
  productid: serial().primaryKey().notNull(),
  productname: varchar({ length: 100 }).notNull(),
  productcode: varchar({ length: 50 }),
  category: varchar({ length: 20 }).notNull(),
  shareclass: varchar({ length: 20 }),
  isactive: boolean(),
  isarr: boolean(),
});

export const clients = pgTable(
  "clients",
  {
    clientId: varchar("client_id")
      .default(sql`nextval('clients_clientid_seq'::regclass)`)
      .primaryKey()
      .notNull(),
    createdon: date().default(sql`CURRENT_TIMESTAMP`),
    lastupdated: date().default(sql`CURRENT_TIMESTAMP`),
    isActive: boolean("is_active").default(true),
    nameSuffix: varchar("name_suffix", { length: 10 }),
    entityname: varchar({ length: 100 }),
    nameFull: text("name_full"),
    nameSalutation: varchar("name_salutation", { length: 10 }),
    nameFirst: varchar("name_first", { length: 50 }),
    nameMiddle: varchar("name_middle", { length: 50 }),
    nameLast: varchar("name_last", { length: 50 }),
    householdId: text("household_id"),
    terminationDate: date("termination_date"),
    addressId: integer("address_id"),
    finprofileId: integer("finprofile_id"),
    ofacId: integer("ofac_id"),
    dob: date(),
    ssnTaxid: varchar("ssn_taxid", { length: 50 }),
    gender: varchar({ length: 20 }),
    maritalstatus: varchar({ length: 20 }),
    employmentStatus: varchar("employment_status", { length: 50 }),
    employmentOccupation: varchar("employment_occupation", { length: 100 }),
    employer: varchar({ length: 100 }),
    employerBusinessType: varchar("employer_business_type", { length: 100 }),
    idNumber: varchar("id_number"),
    idIssuer: varchar("id_issuer"),
    idIssuedate: date("id_issuedate"),
    idExpires: date("id_expires"),
    idCitizenship: varchar("id_citizenship"),
    isUscitizen: boolean("is_uscitizen"),
    idVerifiedby: varchar("id_verifiedby"),
    idType: varchar("id_type"),
    riaClient: boolean("ria_client").default(false),
    bdClient: boolean("bd_client").default(false),
    ofacResource: text("ofac_resource"),
    ofacResult: varchar("ofac_result"),
    ofacBy: varchar("ofac_by"),
    ofacDate: date("ofac_date"),
    pcm: varchar(),
    repFullname: varchar("rep_fullname"),
  },
  (table) => [unique("unique_clientid").on(table.clientId)],
);

export const psiHeldaway = pgTable(
  "psi_heldaway",
  {
    heldawayassetid: serial().primaryKey().notNull(),
    accountid: integer().notNull(),
    accounttype: varchar({ length: 50 }).notNull(),
    institution: varchar({ length: 100 }).notNull(),
    amount: numeric({ precision: 12, scale: 2 }).notNull(),
    createdon: timestamp({ mode: "string" }).notNull(),
    lastupdated: timestamp({ mode: "string" }).notNull(),
    ownershipType: varchar("ownership_type", { length: 50 }),
    assetClassification: varchar("asset_classification", { length: 50 }),
    isLiquid: boolean("is_liquid"),
  },
  (table) => [
    index("idx_psi_heldaway_financialprofileid").using(
      "btree",
      table.accountid.asc().nullsLast().op("int4_ops"),
    ),
  ],
);

export const pasSis = pgTable(
  "pas_sis",
  {
    sisid: serial().primaryKey().notNull(),
    accountid: integer().notNull(),
    goalname: varchar({ length: 150 }).notNull(),
    investmenttimeframe: varchar({ length: 50 }).notNull(),
    investmentobjective: varchar({ length: 50 }).notNull(),
    portfoliostrategy: varchar({ length: 100 }).notNull(),
    percentage: numeric({ precision: 5, scale: 2 }).notNull(),
    submanagerfee: numeric({ precision: 10, scale: 2 }),
    lastupdated: timestamp({ mode: "string" }),
    signeddocumentid: integer(),
    createdon: timestamp({ mode: "string" }).notNull(),
  },
  (table) => [
    index("idx_pas_sis_accountid").using(
      "btree",
      table.accountid.asc().nullsLast().op("int4_ops"),
    ),
    check(
      "chk_pas_sis_percentage",
      sql`(percentage >= (0)::numeric) AND (percentage <= (100)::numeric)`,
    ),
  ],
);

export const addresses = pgTable("addresses", {
  addressId: serial("address_id").primaryKey().notNull(),
  refTable: varchar("ref_table", { length: 50 }).notNull(),
  refId: varchar("ref_id").notNull(),
  addressType: varchar("address_type", { length: 50 }).notNull(),
  address1: varchar({ length: 255 }),
  address2: varchar({ length: 255 }),
  city: varchar({ length: 100 }),
  state: varchar({ length: 50 }),
  zip: varchar({ length: 20 }),
  createdOn: timestamp("created_on", {
    withTimezone: true,
    mode: "string",
  }).default(sql`CURRENT_TIMESTAMP`),
  lastUpdated: timestamp("last_updated", {
    withTimezone: true,
    mode: "string",
  }).default(sql`CURRENT_TIMESTAMP`),
  isPrimary: boolean("is_primary").default(false),
});

export const complianceChecks = pgTable(
  "compliance_checks",
  {
    checkid: serial().primaryKey().notNull(),
    workitemid: integer().notNull(),
    checktype: varchar({ length: 50 }).notNull(),
    status: varchar({ length: 20 }).notNull(),
    checkedby: integer().notNull(),
    datechecked: timestamp({ mode: "string" }).notNull(),
    comments: text(),
    priority: varchar({ length: 20 }),
    dueDate: timestamp("due_date", { mode: "string" }),
    triggeredBy: varchar("triggered_by", { length: 50 }),
  },
  (table) => [
    index("idx_compliance_checks_checktype").using(
      "btree",
      table.checktype.asc().nullsLast().op("text_ops"),
    ),
  ],
);

export const repFees = pgTable(
  "rep_fees",
  {
    feeId: serial("fee_id").primaryKey().notNull(),
    repId: integer("rep_id"),
    serviceId: integer("service_id"),
    feeAmount: numeric("fee_amount", { precision: 15, scale: 2 }).notNull(),
    feeDate: date("fee_date").notNull(),
    paymentMethod: varchar("payment_method", { length: 20 }).notNull(),
    isCustomFee: boolean("is_custom_fee").default(false),
    description: text(),
    createdOn: timestamp("created_on", { mode: "string" }).default(
      sql`CURRENT_TIMESTAMP`,
    ),
    lastUpdated: timestamp("last_updated", { mode: "string" }).default(
      sql`CURRENT_TIMESTAMP`,
    ),
  },
  (table) => [
    check("rep_fees_fee_amount_check", sql`fee_amount >= (0)::numeric`),
    check(
      "rep_fees_payment_method_check",
      sql`(payment_method)::text = ANY ((ARRAY['Deduct from Commission'::character varying, 'Pre-pay'::character varying])::text[])`,
    ),
  ],
);

export const listInvestmentExperience = pgTable("list_investment_experience", {
  id: integer().primaryKey().notNull(),
  name: varchar(),
});

export const listAnnualIncomeOptions = pgTable("list_annual_income_options", {
  listId: integer("list_id").primaryKey().notNull(),
  name: varchar(),
});

export const listIncomeSources = pgTable("list_income_sources", {
  id: integer().primaryKey().notNull(),
  name: varchar(),
});

export const clientFinprofile = pgTable("client_finprofile", {
  finprofileId: serial("finprofile_id").primaryKey().notNull(),
  clientId: varchar("client_id").notNull(),
  profileType: varchar("profile_type", { length: 20 }),
  networth: numeric(),
  networthLiquid: numeric("networth_liquid"),
  incomeAnnual: numeric("income_annual"),
  taxbracket: varchar({ length: 50 }),
  incomeSource: varchar("income_source", { length: 50 }),
  investExperience: varchar("invest_experience", { length: 50 }),
  investExperienceYears: numeric("invest_experience_years"),
  totalHeldawayAssets: numeric("total_heldaway_assets"),
  updatedDate: text("updated_date"),
  updatedBy: text("updated_by"),
  incomeSourceType: varchar("income_source_type", { length: 50 }),
  incomeDescription: varchar("income_description", { length: 255 }),
  incomeSourceAdditional: varchar("income_source_additional", { length: 255 }),
  createdOn: timestamp("created_on", {
    withTimezone: true,
    mode: "string",
  }).default(sql`CURRENT_TIMESTAMP`),
  lastUpdated: timestamp("last_updated", {
    withTimezone: true,
    mode: "string",
  }).default(sql`CURRENT_TIMESTAMP`),
  jointClientId: varchar("joint_client_id"),
});

export const listInvestmentObjectives = pgTable("list_investment_objectives", {
  id: serial().primaryKey().notNull(),
  name: varchar().notNull(),
});

export const listComplianceChecks = pgTable("list_compliance_checks", {
  id: serial().primaryKey().notNull(),
  name: varchar().notNull(),
});

export const listNetworthOptions = pgTable("list_networth_options", {
  id: integer().primaryKey().notNull(),
  name: varchar(),
});

export const listLiquidNetworthOptions = pgTable(
  "list_liquid_networth_options",
  {
    id: integer().primaryKey().notNull(),
    name: varchar(),
  },
);

export const listTaxBracketOptions = pgTable("list_tax_bracket_options", {
  id: integer().primaryKey().notNull(),
  name: varchar(),
});

export const psiSubmissions = pgTable("psi_submissions", {
  submissionId: serial("submission_id").primaryKey().notNull(),
  workItemId: integer("work_item_id"),
  pcm: varchar().notNull(),
  accountType: varchar("account_type", { length: 50 }).notNull(),
  accountDescription: varchar("account_description").notNull(),
  tradeAmount: numeric("trade_amount", { precision: 15, scale: 2 }).notNull(),
  dateReceived: date("date_received").notNull(),
  shipMethod: varchar("ship_method", { length: 50 }),
  trackingNumber: varchar("tracking_number", { length: 50 }),
  dateSent: date("date_sent"),
  statusId: integer("status_id"),
  holdingsFunds: text("holdings_funds").notNull(),
  estGdc: numeric("est_gdc", { precision: 10, scale: 2 }).notNull(),
  enteredOn: timestamp("entered_on", { mode: "string" }).notNull(),
  enteredBy: varchar("entered_by").notNull(),
  editedBy: varchar("edited_by"),
  editedDate: timestamp("edited_date", { mode: "string" }),
  version: timestamp({ mode: "string" }).notNull(),
  notes: text(),
  clientLastName: varchar("client_last_name"),
  clientFirstName: varchar("client_first_name"),
});

export const listSourceOfFunds = pgTable("list_source_of_funds", {
  id: serial().primaryKey().notNull(),
  name: varchar().notNull(),
});

export const listPaymentMethods = pgTable("list_payment_methods", {
  id: serial().primaryKey().notNull(),
  name: varchar().notNull(),
});

export const listWorkflowStatuses = pgTable("list_workflow_statuses", {
  id: serial().primaryKey().notNull(),
  name: varchar().notNull(),
});

export const listDocumentTypes = pgTable("list_document_types", {
  id: serial().primaryKey().notNull(),
  name: varchar().notNull(),
});

export const listFeeTypes = pgTable("list_fee_types", {
  id: serial().primaryKey().notNull(),
  name: varchar().notNull(),
});

export const listAccountTypes = pgTable("list_account_types", {
  id: serial().primaryKey().notNull(),
  name: varchar().notNull(),
});

export const listRiskTolerance = pgTable("list_risk_tolerance", {
  id: serial().primaryKey().notNull(),
  name: varchar().notNull(),
});

export const refStates = pgTable("ref_states", {
  id: serial().primaryKey().notNull(),
  abbrev: varchar({ length: 2 }).notNull(),
  name: varchar({ length: 50 }).notNull(),
  fanCode: integer("fan_code"),
});

export const rep1099Summary = pgTable(
  "rep_1099_summary",
  {
    summaryId: serial("summary_id").primaryKey().notNull(),
    repId: varchar("rep_id"),
    taxYear: integer("tax_year").notNull(),
    totalCommission: numeric("total_commission", {
      precision: 18,
      scale: 2,
    }).notNull(),
    totalDeductions: numeric("total_deductions", {
      precision: 18,
      scale: 2,
    }).default("0"),
    netIncome: numeric("net_income", { precision: 18, scale: 2 }).notNull(),
    adjustments: numeric({ precision: 18, scale: 2 }).default("0"),
    createdOn: timestamp("created_on", { mode: "string" }).default(
      sql`CURRENT_TIMESTAMP`,
    ),
  },
  (table) => [
    check("rep_1099_summary_tax_year_check", sql`tax_year > 2000`),
    check(
      "rep_1099_summary_total_commission_check",
      sql`total_commission >= (0)::numeric`,
    ),
    check("rep_1099_summary_net_income_check", sql`net_income >= (0)::numeric`),
  ],
);

export const listAccountRoles = pgTable("list_account_roles", {
  id: serial().primaryKey().notNull(),
  name: varchar().notNull(),
});

export const listPhoneTypes = pgTable("list_phone_types", {
  id: serial().primaryKey().notNull(),
  name: varchar().notNull(),
});

export const listContactTypes = pgTable(
  "list_contact_types",
  {
    id: serial().primaryKey().notNull(),
    name: varchar().notNull(),
  },
  (table) => [unique("unique_contact_type_name").on(table.name)],
);

export const listEmailTypes = pgTable("list_email_types", {
  id: serial().primaryKey().notNull(),
  name: varchar().notNull(),
});

export const listCountries = pgTable("list_countries", {
  id: serial().primaryKey().notNull(),
  name: varchar().notNull(),
});

export const listIdTypes = pgTable("list_id_types", {
  id: serial().primaryKey().notNull(),
  name: varchar().default("Unknown").notNull(),
});

export const listSalutations = pgTable("list_salutations", {
  id: serial().primaryKey().notNull(),
  name: varchar().default("Unknown").notNull(),
});

export const households = pgTable("households", {
  householdId: text("household_id")
    .default(sql`nextval('pas_households_householdid_seq'::regclass)`)
    .primaryKey()
    .notNull(),
  householdName: varchar("household_name", { length: 150 }).notNull(),
  createdon: timestamp({ mode: "string" }).notNull(),
  active: boolean(),
  repname: text(),
});

export const listRepServices = pgTable("list_rep_services", {
  id: serial().primaryKey().notNull(),
  name: varchar().notNull(),
});

export const listMaritalStatus = pgTable("list_marital_status", {
  id: serial().primaryKey().notNull(),
  name: varchar().notNull(),
});

export const listSubmissionTypes = pgTable("list_submission_types", {
  id: serial().primaryKey().notNull(),
  name: varchar().default("Unknown").notNull(),
});

export const listUserRoles = pgTable(
  "list_user_roles",
  {
    id: serial().primaryKey().notNull(),
    name: varchar({ length: 50 }).notNull(),
    description: text(),
  },
  (table) => [unique("list_user_roles_role_name_key").on(table.name)],
);

export const psiOrdersTemp = pgTable("psi_orders_temp", {
  orderId: integer("order_id"),
  status: varchar(),
  orderType: varchar("order_type"),
  ticketNo: varchar("ticket_no"),
  accountId: varchar("account_id"),
  accountSearchid: varchar("account_searchid"),
  repNo: varchar("rep_no"),
  fanRepName: varchar("fan_rep_name"),
  branchNo: varchar("branch_no"),
  productNo: varchar("product_no"),
  productName: varchar("product_name"),
  productFamily: varchar("product_family"),
  shareClass: varchar("share_class"),
  cusip: varchar(),
  symbol: varchar(),
  fan: varchar(),
  tradeDate: date("trade_date"),
  settleDate: date("settle_date"),
  entryDate: date("entry_date"),
  cashDate: date("cash_date"),
  confirmDate: date("confirm_date"),
  eodDate: date("eod_date"),
  cncDate: date("cnc_date"),
  commDate: date("comm_date"),
  purchaseCode: varchar("purchase_code"),
  units: numeric(),
  unitPrice: numeric("unit_price"),
  amountInvested: numeric("amount_invested"),
  actualCnc: numeric("actual_cnc", { precision: 18, scale: 2 }),
  cancelFlag: boolean("cancel_flag"),
  suspenseFlag: boolean("suspense_flag"),
  holdFlag: boolean("hold_flag"),
  totalCommissionPaid: numeric("total_commission_paid"),
  commBatch: text("comm_batch"),
  ordCancelTicketno: varchar("ord_cancel_ticketno"),
  memo: text(),
  eodBatch: varchar("eod_batch"),
  sourceOfFunds: varchar("source_of_funds"),
  orderAction: varchar("order_action"),
  invPayMethod: varchar("inv_pay_method"),
  accountTypeCode: varchar("account_type_code"),
  transactionDescription: varchar("transaction_description"),
  fanmailBatch: varchar("fanmail_batch"),
  fanmailBatchDate: date("fanmail_batch_date"),
  checkNo: varchar("check_no"),
  resState: varchar("res_state"),
  underwriterCnc: numeric("underwriter_cnc", { precision: 18, scale: 2 }),
  dealerComCode: varchar("dealer_com_code", { length: 10 }),
  tin: integer(),
});

export const wfStatus = pgTable(
  "wf_status",
  {
    statusId: serial("status_id").primaryKey().notNull(),
    statusKey: varchar("status_key", { length: 10 }).notNull(),
    status: varchar({ length: 50 }).notNull(),
    orderno: smallint().notNull(),
    updatedOn: timestamp("updated_on", { mode: "string" }).notNull(),
    transitionTo: jsonb("transition_to"),
    typeId: integer("type_id"),
  },
  (table) => [
    foreignKey({
      columns: [table.typeId],
      foreignColumns: [wfType.workTypeId],
      name: "wf_status_typeid_fkey",
    }),
    unique("unique_statuskey").on(table.statusKey),
  ],
);

export const userActivity = pgTable(
  "user_activity",
  {
    activityId: serial("activity_id").primaryKey().notNull(),
    userId: integer("user_id").notNull(),
    sessionId: uuid("session_id").notNull(),
    loginTimestamp: timestamp("login_timestamp", { mode: "string" }).notNull(),
    logoutTimestamp: timestamp("logout_timestamp", { mode: "string" }),
    ipAddress: varchar("ip_address", { length: 45 }),
    device: varchar({ length: 100 }),
    browserInfo: varchar("browser_info", { length: 255 }),
    activityDuration: interval("activity_duration"),
    actionsPerformed: text("actions_performed"),
    createdOn: timestamp("created_on", { mode: "string" }).default(
      sql`CURRENT_TIMESTAMP`,
    ),
    passwordLastUpdated: timestamp("password_last_updated", { mode: "string" }),
    failedLoginAttempts: integer("failed_login_attempts").default(0),
    lastFailedLogin: timestamp("last_failed_login", { mode: "string" }),
  },
  (table) => [
    index("idx_user_activity_login_timestamp").using(
      "btree",
      table.loginTimestamp.asc().nullsLast().op("timestamp_ops"),
    ),
    index("idx_user_activity_user_id").using(
      "btree",
      table.userId.asc().nullsLast().op("int4_ops"),
    ),
  ],
);

export const pasRegistrations = pgTable("pas_registrations", {
  registrationId: integer("registration_id"),
  active: boolean(),
  lastName: varchar("last_name"),
  firstName: varchar("first_name"),
  fullName: varchar("full_name"),
  accountType: varchar("account_type"),
  currVal: numeric("curr_val"),
  tin: varchar(),
  dob: date(),
  householdId: integer("household_id"),
  dateCreated: timestamp("date_created", { mode: "string" }),
  custodianAcctNo: varchar("custodian_acct_no"),
  hasSleeves: boolean("has_sleeves"),
  regType: integer("reg_type"),
  repName: varchar("rep_name"),
  repnumber: varchar(),
  typeCode: varchar("type_code"),
});

export const wfType = pgTable("wf_type", {
  workTypeId: serial("work_type_id").primaryKey().notNull(),
  workTypeName: varchar("work_type_name", { length: 100 }).notNull(),
  parentworktypeid: integer(),
  updatedOn: timestamp("updated_on", { mode: "string" }).notNull(),
});

export const instructions = pgTable(
  "instructions",
  {
    instructionId: serial("instruction_id").primaryKey().notNull(),
    accountid: integer().notNull(),
    contactid: integer().notNull(),
    instructiontype: varchar({ length: 50 }).notNull(),
    instructiondetails: text(),
    createdby: varchar({ length: 100 }).notNull(),
    createdon: timestamp({ mode: "string" }).notNull(),
    effectivedate: date(),
    signeddate: date(),
    status: varchar({ length: 50 }).notNull(),
    lastupdated: timestamp({ mode: "string" }),
    lastupdatedby: varchar({ length: 100 }),
  },
  (table) => [
    index("idx_instructions_accountid").using(
      "btree",
      table.accountid.asc().nullsLast().op("int4_ops"),
    ),
    index("idx_instructions_contactid").using(
      "btree",
      table.contactid.asc().nullsLast().op("int4_ops"),
    ),
    index("idx_instructions_instructiontype").using(
      "btree",
      table.instructiontype.asc().nullsLast().op("text_ops"),
    ),
  ],
);

export const psiSuitabilityAnnuity = pgTable("psi_suitability_annuity", {
  annuitysuitabilityid: serial().primaryKey().notNull(),
  accountid: integer().notNull(),
  annuitytype: varchar({ length: 50 }).notNull(),
  investmentswitchtype: varchar({ length: 100 }),
  companyproduct: varchar({ length: 100 }),
  shareclass: varchar({ length: 50 }),
  initialinvestmentamount: numeric({ precision: 12, scale: 2 }).notNull(),
  livingbenefitbase: numeric({ precision: 12, scale: 2 }),
  surrenderschedule: text(),
  ridername: varchar({ length: 100 }),
  riderfee: numeric({ precision: 5, scale: 2 }),
  liquidityoptions: numeric({ precision: 5, scale: 2 }),
  otheroptions: numeric({ precision: 5, scale: 2 }),
  managementexpensefee: numeric({ precision: 5, scale: 2 }),
  adminfee: numeric({ precision: 5, scale: 2 }),
  totalexpenses: numeric({ precision: 12, scale: 2 }),
  upfrontgdc: numeric({ precision: 5, scale: 2 }),
  oldcompanyproduct: varchar({ length: 100 }),
  oldshareclass: varchar({ length: 50 }),
  oldinvestmentamount: numeric({ precision: 12, scale: 2 }),
  oldlivingbenefitbase: numeric({ precision: 12, scale: 2 }),
  oldsurrenderschedule: text(),
  oldridername: varchar({ length: 100 }),
  oldriderfee: numeric({ precision: 5, scale: 2 }),
  oldliquidityoptions: numeric({ precision: 5, scale: 2 }),
  oldotheroptions: numeric({ precision: 5, scale: 2 }),
  oldmanagementexpensefee: numeric({ precision: 5, scale: 2 }),
  oldadminfee: numeric({ precision: 5, scale: 2 }),
  oldtotalexpenses: numeric({ precision: 12, scale: 2 }),
  oldupfrontgdc: numeric({ precision: 5, scale: 2 }),
  oldrrpaid: boolean(),
  oldrrpaypercentage: numeric({ precision: 5, scale: 2 }),
  replacementreason: text(),
  exchangebenefit: text(),
  exchangeinlast36Months: boolean(),
  exchange36Monthreason: text(),
  surrenderchargeexplanation: text(),
  distributionplan: varchar({ length: 100 }),
  minimumholdingperiod: varchar({ length: 50 }),
  firstdistribution: varchar({ length: 50 }),
  currentfundsliquid: boolean(),
  percentageliquid: varchar({ length: 20 }),
  postpurchaseliquidity: numeric({ precision: 12, scale: 2 }),
  postsufficientliquidity: boolean(),
  planneduseofaccount: varchar({ length: 100 }),
  planneduseofaccountother: text(),
  purchasereasons: varchar({ length: 100 }),
  purchasereasonsother: text(),
  benefitvsotherproducts: text(),
  timehorizonandsurrenderconsistent: boolean(),
  reducedsurrendercharge: boolean(),
  reducedsurrenderchargebasetext: text(),
  livingbenefitwithin5Years: varchar({ length: 20 }),
  livingbenefitwithin5Yearsexplain: text(),
  additionalnotes: text(),
  createdon: timestamp({ mode: "string" }).notNull(),
  reducedsurrb: numeric({ precision: 5, scale: 2 }),
  reducedsurrl: numeric({ precision: 5, scale: 2 }),
  reducedsurrtextexplain: text(),
  lb5Year: varchar({ length: 20 }),
  lb5Yearexplain: text(),
  addnotes: text(),
  surrenderperiod: varchar({ length: 50 }),
  planneduseaccountother: text(),
  purchasereasonother: text(),
  benefitotherproducts: text(),
});

export const psiSuitability = pgTable(
  "psi_suitability",
  {
    suitabilityid: serial().primaryKey().notNull(),
    accountid: integer().notNull(),
    producttype: varchar({ length: 50 }).notNull(),
    otherproducttype: varchar({ length: 100 }),
    issolicited: boolean().notNull(),
    investmenttype: varchar({ length: 50 }).notNull(),
    sourceoffunds: varchar({ length: 100 }),
    investmentamount: numeric({ precision: 12, scale: 2 }).notNull(),
    productfamilyid: integer(),
    additionalinfo: text(),
    investmentobjective: varchar({ length: 50 }).notNull(),
    investmenttimehorizon: varchar({ length: 20 }),
    risktolerancelevel: varchar({ length: 20 }),
    liquidityneedslevel: varchar({ length: 20 }),
    createdon: timestamp({ mode: "string" }).notNull(),
  },
  (table) => [
    index("idx_psi_suitability_investmenttype").using(
      "btree",
      table.investmenttype.asc().nullsLast().op("text_ops"),
    ),
  ],
);

export const psiHoldings = pgTable("psi_holdings", {
  holdingId: varchar("holding_id")
    .default(sql`nextval('account_holdings_holding_id_seq'::regclass)`)
    .primaryKey()
    .notNull(),
  accountId: varchar("account_id").notNull(),
  holdingType: varchar("holding_type", { length: 50 }).notNull(),
  securityName: varchar("security_name", { length: 150 }),
  securityTicker: varchar("security_ticker", { length: 20 }),
  cusip: varchar({ length: 20 }),
  units: numeric(),
  unitPrice: numeric("unit_price"),
  marketValue: numeric("market_value"),
  costBasis: numeric("cost_basis"),
  lastUpdated: date("last_updated").default(sql`CURRENT_TIMESTAMP`),
  createdOn: date("created_on").default(sql`CURRENT_TIMESTAMP`),
  holdingFan: varchar("holding_fan", { length: 50 }),
  productNo: varchar("product_no"),
  productFamily: varchar("product_family"),
  holdPriceDate: date("hold_price_date"),
  branchNo: varchar("branch_no"),
  repNo: varchar("rep_no"),
});

export const psiBlotter = pgTable(
  "psi_blotter",
  {
    blotterId: serial("blotter_id").primaryKey().notNull(),
    submissionsId: integer("submissions_id").notNull(),
    transferType: varchar("transfer_type", { length: 50 }).notNull(),
    checkNo: varchar("check_no", { length: 50 }),
    transactionAmount: numeric("transaction_amount", {
      precision: 15,
      scale: 2,
    }).notNull(),
    estGdc: numeric("est_gdc", { precision: 15, scale: 2 }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.submissionsId],
      foreignColumns: [psiSubmissions.submissionId],
      name: "fk_submissions",
    }).onDelete("cascade"),
  ],
);

export const listOrderTypes = pgTable("list_order_types", {
  orderTypeId: serial("order_type_id").primaryKey().notNull(),
  orderName: varchar("order_name", { length: 100 }).notNull(),
  orderCode: varchar("order_code", { length: 20 }).notNull(),
  productType: varchar("product_type", { length: 100 }).notNull(),
  isArr: boolean("is_arr").default(false).notNull(),
});

export const psiOrdersStaging = pgTable("psi_orders_staging", {
  id: serial().primaryKey().notNull(),
  fileName: varchar("file_name", { length: 255 }),
  lineNumber: integer("line_number"),
  rawLine: text("raw_line"),
});

export const pasAccounts = pgTable("pas_accounts", {
  accountId: integer("account_id"),
  active: boolean(),
  fullName: varchar("full_name"),
  accountNo: varchar("account_no"),
  custodian: varchar(),
  accountType: varchar("account_type"),
  model: varchar(),
  dateCreated: timestamp("date_created", { mode: "string" }),
  source: varchar(),
  feeSchedule: varchar("fee_schedule"),
  feeScheduleId: integer("fee_schedule_id"),
  householdName: varchar("household_name"),
  modelAggId: integer("model_agg_id"),
  payoutSchedule: varchar("payout_schedule"),
  repName: varchar("rep_name"),
  repNo: varchar("rep_no"),
  dateStart: date("date_start"),
  subAdvisor: varchar("sub_advisor"),
});

export const notes = pgTable(
  "notes",
  {
    noteid: serial().primaryKey().notNull(),
    relatedid: integer().notNull(),
    relatedtype: varchar({ length: 50 }).notNull(),
    notetype: varchar({ length: 50 }).notNull(),
    addedby: varchar({ length: 100 }).notNull(),
    addeddate: timestamp({ mode: "string" }).notNull(),
    notemessage: text().notNull(),
    lastupdated: timestamp({ mode: "string" }).default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("idx_notes_related").using(
      "btree",
      table.relatedid.asc().nullsLast().op("int4_ops"),
      table.relatedtype.asc().nullsLast().op("int4_ops"),
    ),
  ],
);

export const reps = pgTable(
  "reps",
  {
    repId: varchar("rep_id")
      .default(sql`nextval('reps_rep_id_seq'::regclass)`)
      .primaryKey()
      .notNull(),
    pcm: varchar({ length: 15 }),
    createdOn: timestamp("createdon", { mode: "string" }),
    firstName: varchar("firstname", { length: 50 }),
    middleName: varchar("middlename", { length: 50 }),
    lastName: varchar("lastname", { length: 50 }),
    fullName: varchar("fullname"),
    isActive: boolean("is_active").default(true),
    repType: varchar("rep_type", { length: 50 })
      .default("Unassigned")
      .notNull(),
    isBranchMgr: boolean("is_branch_mgr").default(false),
    pwHash: varchar("pw_hash", { length: 255 }),
    profilePictureUrl: varchar("profile_picture_url", { length: 255 }),
    dob: date(),
    maritalStatus: varchar("marital_status", { length: 50 }),
    gender: varchar({ length: 10 }),
    tin: varchar({ length: 50 }),
  },
  (table) => [
    index("idx_reps_pcm").using(
      "btree",
      table.pcm.asc().nullsLast().op("text_ops"),
    ),
  ],
);

export const refResidentStates = pgTable("ref_resident_states", {
  stateCode: varchar("state_code", { length: 10 }).primaryKey().notNull(),
  stateName: varchar("state_name", { length: 100 }),
});

export const psiOrdersRaw = pgTable("psi_orders_raw", {
  id: serial().primaryKey().notNull(),
  fileName: varchar("file_name", { length: 255 }),
  rawData: text("raw_data"),
  uploadedAt: timestamp("uploaded_at", { mode: "string" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
});

export const refPaymentMethods = pgTable("ref_payment_methods", {
  paymentCode: char("payment_code", { length: 1 }).primaryKey().notNull(),
  paymentDescription: varchar("payment_description", { length: 50 }),
});

export const refDealerCommissionCodes = pgTable("ref_dealer_commission_codes", {
  dealerComCode: char("dealer_com_code", { length: 1 }).primaryKey().notNull(),
  commissionType: varchar("commission_type", { length: 50 }),
});

export const refRecordCodes = pgTable("ref_record_codes", {
  recordCode: varchar("record_code", { length: 10 }).primaryKey().notNull(),
  recordDescription: varchar("record_description", { length: 255 }),
});

export const psiOrders = pgTable(
  "psi_orders",
  {
    orderId: serial("order_id").notNull(),
    status: varchar({ length: 50 }),
    orderType: varchar("order_type", { length: 50 }).notNull(),
    ticketNo: varchar("ticket_no", { length: 50 }),
    accountId: varchar("account_id", { length: 50 }),
    accountSearchid: varchar("account_searchid", { length: 50 }),
    repNo: varchar("rep_no", { length: 50 }),
    fanRepName: varchar("fan_rep_name", { length: 50 }),
    branchNo: varchar("branch_no", { length: 50 }),
    productNo: varchar("product_no", { length: 50 }),
    productName: varchar("product_name", { length: 100 }),
    productFamily: varchar("product_family", { length: 50 }),
    shareClass: varchar("share_class", { length: 20 }),
    cusip: varchar({ length: 20 }),
    symbol: varchar({ length: 20 }),
    fan: varchar({ length: 50 }),
    tradeDate: date("trade_date"),
    settleDate: date("settle_date"),
    entryDate: date("entry_date"),
    cashDate: date("cash_date"),
    confirmDate: date("confirm_date"),
    eodDate: date("eod_date"),
    cncDate: date("cnc_date"),
    commDate: date("comm_date"),
    purchaseCode: varchar("purchase_code", { length: 20 }),
    units: numeric({ precision: 15, scale: 4 }),
    unitPrice: numeric("unit_price", { precision: 12, scale: 4 }),
    amountInvested: numeric("amount_invested", { precision: 18, scale: 2 }),
    actualCnc: numeric("actual_cnc", { precision: 18, scale: 2 }),
    cancelFlag: boolean("cancel_flag"),
    suspenseFlag: boolean("suspense_flag"),
    holdFlag: boolean("hold_flag"),
    totalCommissionPaid: numeric("total_commission_paid", {
      precision: 18,
      scale: 2,
    }),
    commBatch: text("comm_batch"),
    ordCancelTicketno: varchar("ord_cancel_ticketno", { length: 50 }),
    memo: text(),
    eodBatch: varchar("eod_batch", { length: 50 }),
    sourceOfFunds: varchar("source_of_funds", { length: 50 }),
    orderAction: varchar("order_action", { length: 50 }),
    invPayMethod: varchar("inv_pay_method"),
    accountTypeCode: varchar("account_type_code", { length: 50 }),
    transactionDescription: varchar("transaction_description"),
    fanmailBatch: varchar("fanmail_batch"),
    fanmailBatchDate: date("fanmail_batch_date"),
    checkNo: varchar("check_no"),
    resState: varchar("res_state"),
    underwriterCnc: numeric("underwriter_cnc", { precision: 18, scale: 2 }),
    dealerComCode: varchar("dealer_com_code", { length: 10 }),
    tin: integer(),
  },
  (table) => [
    index("idx_psi_orders_repsearchid").using(
      "btree",
      table.fanRepName.asc().nullsLast().op("text_ops"),
    ),
    index("idx_psi_orders_tradedate").using(
      "btree",
      table.tradeDate.asc().nullsLast().op("date_ops"),
    ),
  ],
);

export const refShareBalanceEffects = pgTable("ref_share_balance_effects", {
  effectCode: char("effect_code", { length: 1 }),
  description: varchar(),
});

export const repCommissionAdjustments = pgTable(
  "rep_commission_adjustments",
  {
    adjustmentId: serial("adjustment_id").primaryKey().notNull(),
    commissionId: integer("commission_id"),
    repId: integer("rep_id"),
    adjustmentType: varchar("adjustment_type", { length: 50 }).notNull(),
    adjustmentAmount: numeric("adjustment_amount", {
      precision: 15,
      scale: 2,
    }).notNull(),
    description: text(),
    createdOn: timestamp("created_on", { mode: "string" }).default(
      sql`CURRENT_TIMESTAMP`,
    ),
  },
  (table) => [
    check(
      "rep_commission_adjustments_adjustment_amount_check",
      sql`adjustment_amount >= (0)::numeric`,
    ),
  ],
);

export const refAccountTypeCodes = pgTable("ref_account_type_codes", {
  accountTypeCode: char("account_type_code", { length: 1 })
    .primaryKey()
    .notNull(),
  description: varchar().notNull(),
});

export const refMfPayMethods = pgTable("ref_mf_pay_methods", {
  mfPayCode: char("mf_pay_code", { length: 1 }).primaryKey().notNull(),
  mfPayDescription: varchar("mf_pay_description").notNull(),
});

export const repCommissionStatements = pgTable(
  "rep_commission_statements",
  {
    statementId: serial("statement_id").primaryKey().notNull(),
    repId: integer("rep_id"),
    commissionId: integer("commission_id"),
    statementDate: timestamp("statement_date", { mode: "string" }).notNull(),
    totalCommission: numeric("total_commission", {
      precision: 15,
      scale: 2,
    }).notNull(),
    totalDeductions: numeric("total_deductions", {
      precision: 15,
      scale: 2,
    }).default("0"),
    netPayout: numeric("net_payout", { precision: 15, scale: 2 }).notNull(),
    createdOn: timestamp("created_on", { mode: "string" }).default(
      sql`CURRENT_TIMESTAMP`,
    ),
  },
  (table) => [
    check(
      "rep_commission_statements_total_commission_check",
      sql`total_commission >= (0)::numeric`,
    ),
    check(
      "rep_commission_statements_net_payout_check",
      sql`net_payout >= (0)::numeric`,
    ),
  ],
);

export const refTransactionCodes = pgTable(
  "ref_transaction_codes",
  {
    transactionCode: numeric("transaction_code").notNull(),
    transactionSuffix: numeric("transaction_suffix").notNull(),
    transactionDescription: varchar("transaction_description", { length: 255 }),
  },
  (table) => [
    index("idx_transaction_codes").using(
      "btree",
      table.transactionCode.asc().nullsLast().op("numeric_ops"),
      table.transactionSuffix.asc().nullsLast().op("numeric_ops"),
    ),
    primaryKey({
      columns: [table.transactionCode, table.transactionSuffix],
      name: "ref_transaction_codes_pkey",
    }),
  ],
);
