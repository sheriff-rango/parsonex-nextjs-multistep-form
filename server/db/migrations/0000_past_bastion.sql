-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE SEQUENCE "public"."users_userid_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."psi_holdings_holding_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "public"."reps_rep_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE TABLE "giftblotter" (
	"giftid" serial PRIMARY KEY NOT NULL,
	"repid" integer NOT NULL,
	"fundcompany" varchar(100) NOT NULL,
	"fundcompanycontact" varchar(100),
	"giftdescription" varchar(200) NOT NULL,
	"gifttype" varchar(50) NOT NULL,
	"dollarvalue" numeric(12, 2) NOT NULL,
	"datereceived" date NOT NULL,
	"datecreated" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "psi_accounts" (
	"account_id" varchar PRIMARY KEY DEFAULT nextval('psi_accounts_psiaccountid_seq'::regclass) NOT NULL,
	"searchid" varchar(50),
	"est_date" date DEFAULT CURRENT_DATE,
	"tin" varchar(20),
	"lastupdated" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"account_type" varchar(50),
	"date_17a3" date,
	"method_17a3" varchar(100),
	"email_auth" boolean,
	"client_id_primary" varchar,
	"client_id_joint" varchar,
	"status" varchar,
	"term_date" date,
	"inv_objective" varchar,
	"risk_tolerance" varchar,
	"time_horizon" varchar,
	"pcm" varchar,
	"branch" varchar,
	"registration_1" varchar,
	"registration_2" varchar,
	"registration_3" varchar,
	"client_res_state" varchar,
	"account_email" varchar
);
--> statement-breakpoint
CREATE TABLE "wf_item_status_history" (
	"historyid" serial PRIMARY KEY NOT NULL,
	"work_item_id" integer,
	"status_id" integer,
	"changed_by" varchar,
	"changed_on" timestamp DEFAULT CURRENT_TIMESTAMP,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "rep_registrations" (
	"registration_id" integer PRIMARY KEY NOT NULL,
	"rep_id" integer NOT NULL,
	"registration_type" varchar(50) NOT NULL,
	"registration_number" varchar(20),
	"status" varchar(20) NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date,
	"npn" varchar(50),
	"crd" varchar(50),
	"iard" varchar(50),
	CONSTRAINT "chk_registration_status" CHECK ((status)::text = ANY ((ARRAY['Active'::character varying, 'Pending'::character varying, 'Terminated'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE "rep_commissions" (
	"commission_id" serial PRIMARY KEY NOT NULL,
	"order_id" integer,
	"account_id" integer,
	"rep_id" integer,
	"product_type" varchar(50) NOT NULL,
	"type" varchar(50) NOT NULL,
	"rate_id" integer,
	"calculated_amount" numeric(15, 2) NOT NULL,
	"payout_date" timestamp NOT NULL,
	"payout_status" varchar DEFAULT 'Pending',
	"created_on" timestamp DEFAULT CURRENT_TIMESTAMP,
	"last_updated" timestamp DEFAULT CURRENT_TIMESTAMP,
	"commission_type" varchar(20) DEFAULT 'Initial',
	"batch_id" integer,
	CONSTRAINT "payout_status_check" CHECK ((payout_status)::text = ANY ((ARRAY['Pending'::character varying, 'Paid'::character varying])::text[])),
	CONSTRAINT "rep_commissions_calculated_amount_check" CHECK (calculated_amount >= (0)::numeric)
);
--> statement-breakpoint
CREATE TABLE "psi_suitability_mf" (
	"mfsuitabilityid" serial PRIMARY KEY NOT NULL,
	"accountid" integer NOT NULL,
	"liquidatedinvestmentname" varchar(100),
	"originalpurchasedate" date,
	"originalinvestmentamount" numeric(12, 2),
	"lastdepositdate" date,
	"last36motransfer" boolean,
	"previoussurrendercharge" numeric(12, 2),
	"intendeduseofaccount" text,
	"distributionmethods" text,
	"anticipatedfirstdistribution" varchar(20),
	"shareclass" varchar(50),
	"csharetimehorizonover3years" boolean,
	"asharetimehorizonover3years" boolean,
	"shareclasssuitabilitydetails" text,
	"sharecomparisoninitial" numeric(12, 2),
	"sharecomparisonror" numeric(5, 2),
	"sharecomparisonperiod" varchar(20),
	"asharefuturevalue" numeric(12, 2),
	"ashareannualoperatingexpenses" numeric(12, 2),
	"asharesalescharge" numeric(5, 2),
	"asharecdsc" numeric(12, 2),
	"asharetotalcost" numeric(12, 2),
	"csharefuturevalue" numeric(12, 2),
	"cshareannualoperatingexpenses" numeric(12, 2),
	"csharesalescharge" numeric(5, 2),
	"csharecdsc" numeric(12, 2),
	"csharetotalcost" numeric(12, 2),
	"additionalinformation" text,
	"previousfundexperience" boolean,
	"initialinvestmentamount" numeric(12, 2),
	"surrenderperiod" varchar(50),
	"createdon" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "emails" (
	"email_id" serial PRIMARY KEY NOT NULL,
	"ref_table" varchar(50) NOT NULL,
	"ref_id" varchar NOT NULL,
	"email_address" varchar(255),
	"email_type" varchar(50),
	"is_primary" boolean DEFAULT false,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "products" (
	"item" serial PRIMARY KEY NOT NULL,
	"add_date" timestamp NOT NULL,
	"cusip" varchar(20),
	"product_family" varchar(50) NOT NULL,
	"last_updated" timestamp,
	"product_name" varchar(255) NOT NULL,
	"product_no" varchar(50),
	"product_other_id" varchar(50),
	"symbol" varchar(20),
	"type" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "phones" (
	"phone_id" serial PRIMARY KEY NOT NULL,
	"ref_table" varchar(50) NOT NULL,
	"ref_id" varchar NOT NULL,
	"phone_type" varchar(50),
	"phone_number" varchar(20),
	"is_primary" boolean DEFAULT false,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "phones_phone_type_check" CHECK ((phone_type)::text = ANY ((ARRAY['mobile'::character varying, 'home'::character varying, 'work'::character varying, 'other'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE "ad_detail" (
	"advertisingdetailid" serial PRIMARY KEY NOT NULL,
	"workitemid" integer,
	"hostname" varchar(100) NOT NULL,
	"issponsoredevent" boolean NOT NULL,
	"sponsorname" varchar(100),
	"reimbursementamount" numeric,
	"eventdate" date,
	"location" varchar(200),
	"issocialmediahosted" boolean
);
--> statement-breakpoint
CREATE TABLE "signatures" (
	"signatureid" serial PRIMARY KEY NOT NULL,
	"envelopeid" varchar(100) NOT NULL,
	"relatedid" integer NOT NULL,
	"relatedentitytype" varchar(50) NOT NULL,
	"signaturedate" timestamp NOT NULL,
	"isverified" boolean NOT NULL,
	"verificationmethod" varchar(100),
	"provider" varchar(50) DEFAULT 'DocuSign' NOT NULL,
	CONSTRAINT "chk_signatures_relatedentitytype" CHECK ((relatedentitytype)::text = ANY ((ARRAY['account'::character varying, 'rep'::character varying, 'compliance'::character varying, 'client'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE "wf_item" (
	"work_item_id" serial PRIMARY KEY NOT NULL,
	"title" varchar(150) NOT NULL,
	"work_type_id" integer NOT NULL,
	"rep_id" integer NOT NULL,
	"created_on" timestamp NOT NULL,
	"assigned_to" integer,
	"is_void" boolean NOT NULL,
	"created_by" integer NOT NULL,
	"updated_on" timestamp NOT NULL,
	"status_id" integer
);
--> statement-breakpoint
CREATE TABLE "wf_item_queue" (
	"wi_queue_id" serial PRIMARY KEY NOT NULL,
	"work_item_id" integer NOT NULL,
	"role_id" integer,
	"user_id" integer,
	"queue_status" boolean NOT NULL,
	"created_on" timestamp NOT NULL,
	"updated_on" timestamp,
	"version" timestamp NOT NULL,
	"status_id" integer
);
--> statement-breakpoint
CREATE TABLE "psi_com_rates" (
	"payout_id" serial PRIMARY KEY NOT NULL,
	"rep_id" varchar NOT NULL,
	"payee_id" varchar NOT NULL,
	"payout_pct" numeric(5, 2) NOT NULL,
	"created_on" timestamp DEFAULT CURRENT_TIMESTAMP,
	"last_updated" timestamp DEFAULT CURRENT_TIMESTAMP,
	"type" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "reps_archived" (
	"pcm" varchar(15) PRIMARY KEY NOT NULL,
	"fullname" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bank_info" (
	"bank_id" serial PRIMARY KEY NOT NULL,
	"account_id" integer,
	"bankname" varchar(100) NOT NULL,
	"accounttype" varchar(50) NOT NULL,
	"addressid" integer,
	"routingnumber" varchar(20),
	"accountnumber" varchar(50),
	"phonenumber" varchar(20),
	"createdon" timestamp NOT NULL,
	"lastupdated" timestamp NOT NULL,
	"related_entity_type" varchar(20) NOT NULL,
	"related_entity_id" integer NOT NULL,
	CONSTRAINT "bank_info_related_entity_type_check" CHECK ((related_entity_type)::text = ANY ((ARRAY['Rep'::character varying, 'Contact'::character varying, 'Client'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"notificationid" serial PRIMARY KEY NOT NULL,
	"userid" integer NOT NULL,
	"message" text NOT NULL,
	"createdon" timestamp NOT NULL,
	"isread" boolean NOT NULL,
	"notificationtype" varchar(50) DEFAULT 'General',
	"relatedid" integer,
	"relatedtype" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "summary_production" (
	"id" serial NOT NULL,
	"biz_date" date NOT NULL,
	"rep_searchid" varchar(50) NOT NULL,
	"product_code" varchar(50) NOT NULL,
	"product_type" varchar(50) NOT NULL,
	"investment_amt" numeric(15, 2) NOT NULL,
	"production" numeric(15, 2) NOT NULL,
	"commissions" numeric(15, 2) NOT NULL,
	"pcm" varchar,
	"isarr" boolean
);
--> statement-breakpoint
CREATE TABLE "audit_log" (
	"auditid" serial PRIMARY KEY NOT NULL,
	"tablename" varchar(100) NOT NULL,
	"recordid" integer NOT NULL,
	"changedby" integer NOT NULL,
	"changedate" timestamp NOT NULL,
	"operation" varchar(20) NOT NULL,
	"oldvalue" text,
	"newvalue" text
);
--> statement-breakpoint
CREATE TABLE "product_family" (
	"family_id" serial PRIMARY KEY NOT NULL,
	"family_name" varchar(100) NOT NULL,
	"is_active" boolean NOT NULL,
	"website" varchar(200),
	"phone" varchar(25),
	"created_on" timestamp DEFAULT now() NOT NULL,
	"last_updated" timestamp,
	"fan_code" varchar(5),
	"fan_product_type" varchar
);
--> statement-breakpoint
CREATE TABLE "wf_roles" (
	"role_id" serial PRIMARY KEY NOT NULL,
	"rolename" varchar(50) NOT NULL,
	"description" text,
	"wf_type" varchar
);
--> statement-breakpoint
CREATE TABLE "pas_holdings" (
	"holding_id" serial PRIMARY KEY NOT NULL,
	"account_id" integer NOT NULL,
	"product_id" integer,
	"holding_type" varchar(50),
	"security_name" varchar(100),
	"security_ticker" varchar(10),
	"units" numeric(18, 4) DEFAULT '0',
	"unit_price" numeric(18, 4) DEFAULT '0',
	"market_value" numeric(18, 4) GENERATED ALWAYS AS ((units * unit_price)) STORED,
	"cost_basis" numeric(18, 4),
	"created_on" timestamp DEFAULT CURRENT_TIMESTAMP,
	"last_updated" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "reporting_metrics" (
	"metricid" serial PRIMARY KEY NOT NULL,
	"metricname" varchar(100) NOT NULL,
	"metricvalue" numeric(18, 2) NOT NULL,
	"recordeddate" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"documentid" serial PRIMARY KEY NOT NULL,
	"relatedid" integer NOT NULL,
	"relatedtype" varchar(50) NOT NULL,
	"documenttype" varchar(50) NOT NULL,
	"documentname" varchar(150) NOT NULL,
	"filepath" varchar(255) NOT NULL,
	"uploadedby" integer NOT NULL,
	"uploadedon" timestamp NOT NULL,
	"lastupdated" timestamp,
	"isactive" boolean,
	"version" timestamp NOT NULL,
	"signature_id" integer,
	CONSTRAINT "chk_documents_relatedtype" CHECK ((relatedtype)::text = ANY ((ARRAY['account'::character varying, 'rep'::character varying, 'compliance'::character varying, 'client'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE "pas_com_rates" (
	"payout_id" serial PRIMARY KEY NOT NULL,
	"rep_id" varchar(50) NOT NULL,
	"payee_id" varchar(50) NOT NULL,
	"payout_pct" numeric NOT NULL,
	"type" varchar(255),
	"created_on" timestamp DEFAULT CURRENT_TIMESTAMP,
	"last_updated" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "pas_billing" (
	"billing_id" serial PRIMARY KEY NOT NULL,
	"account_id" integer,
	"household_id" integer,
	"rep_id" integer,
	"bill_type" varchar(20) NOT NULL,
	"bill_date_range" varchar(50),
	"bill_date" timestamp NOT NULL,
	"account_name" varchar(100),
	"mgmt_style" varchar(50),
	"subadvisor" varchar(100),
	"custodian_account" varchar(50),
	"pay_method" varchar(20),
	"billed_value" numeric NOT NULL,
	"net_fees" numeric,
	"adjustments" numeric,
	"net_due" numeric NOT NULL,
	"fee_schedule" varchar(20),
	"pay_schedule" varchar(20),
	"sub_fee" numeric,
	"sub_adj" numeric,
	"ria_fee" numeric NOT NULL,
	"ria_adj" numeric,
	"manager_fee" numeric,
	"manager_adj" numeric,
	"created_on" timestamp DEFAULT CURRENT_TIMESTAMP,
	"last_updated" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "rep_oba" (
	"obaid" serial PRIMARY KEY NOT NULL,
	"repid" integer NOT NULL,
	"obatype" varchar(50) NOT NULL,
	"startdate" date NOT NULL,
	"stopdate" date,
	"hours" integer,
	"description" text NOT NULL,
	"documentid" integer,
	"compliancecheckid" integer,
	"createdon" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"lastupdated" timestamp
);
--> statement-breakpoint
CREATE TABLE "user_permissions" (
	"permissionid" integer PRIMARY KEY NOT NULL,
	"userid" integer NOT NULL,
	"role" varchar(50),
	"user_group" varchar(50),
	"permissiontype" varchar(50) NOT NULL,
	"isactive" boolean NOT NULL,
	"granteddate" timestamp NOT NULL,
	"revokeddate" timestamp
);
--> statement-breakpoint
CREATE TABLE "fanmail_downloads" (
	"file_id" serial PRIMARY KEY NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"file_path" varchar(255) NOT NULL,
	"file_type" varchar(50) NOT NULL,
	"upload_date" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"processed_date" timestamp,
	"status" varchar(50) DEFAULT 'Pending' NOT NULL,
	"error_message" text,
	CONSTRAINT "chk_fanmail_status" CHECK ((status)::text = ANY ((ARRAY['Pending'::character varying, 'Processed'::character varying, 'Failed'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE "rep_licenses" (
	"licenseid" serial PRIMARY KEY NOT NULL,
	"repid" integer NOT NULL,
	"licensetype" varchar(50) NOT NULL,
	"licensenumber" varchar(20),
	"state" varchar(2) NOT NULL,
	"status" varchar(20) NOT NULL,
	"issuedate" date,
	"expirationdate" date,
	"linkedsource" varchar(100),
	"createdon" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"lastupdated" timestamp
);
--> statement-breakpoint
CREATE TABLE "product_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar DEFAULT 'Unknown' NOT NULL,
	"isarr" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"client_id" varchar PRIMARY KEY DEFAULT nextval('clients_clientid_seq'::regclass) NOT NULL,
	"createdon" date DEFAULT CURRENT_TIMESTAMP,
	"lastupdated" date DEFAULT CURRENT_TIMESTAMP,
	"is_active" boolean DEFAULT true,
	"name_suffix" varchar(10),
	"entityname" varchar(100),
	"name_full" text,
	"name_salutation" varchar(10),
	"name_first" varchar(50),
	"name_middle" varchar(50),
	"name_last" varchar(50),
	"household_id" text,
	"termination_date" date,
	"address_id" integer,
	"finprofile_id" integer,
	"ofac_id" integer,
	"dob" date,
	"tin" varchar(50),
	"gender" varchar(20),
	"maritalstatus" varchar(20),
	"employment_status" varchar(50),
	"employment_occupation" varchar(100),
	"employer" varchar(100),
	"employer_business_type" varchar(100),
	"id_number" varchar,
	"id_issuer" varchar,
	"id_issuedate" date,
	"id_expires" date,
	"id_citizenship" varchar,
	"is_uscitizen" boolean,
	"id_verifiedby" varchar,
	"id_type" varchar,
	"ria_client" boolean DEFAULT false,
	"bd_client" boolean DEFAULT false,
	"ofac_resource" text,
	"ofac_result" varchar,
	"ofac_by" varchar,
	"ofac_date" date,
	"pcm" varchar,
	"rep_fullname" varchar,
	CONSTRAINT "unique_clientid" UNIQUE("client_id")
);
--> statement-breakpoint
CREATE TABLE "summary_product_type" (
	"productid" serial PRIMARY KEY NOT NULL,
	"productname" varchar(100) NOT NULL,
	"productcode" varchar(50),
	"category" varchar(20) NOT NULL,
	"isactive" boolean,
	"isarr" boolean
);
--> statement-breakpoint
CREATE TABLE "psi_heldaway" (
	"heldawayassetid" serial PRIMARY KEY NOT NULL,
	"accountid" integer NOT NULL,
	"accounttype" varchar(50) NOT NULL,
	"institution" varchar(100) NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"createdon" timestamp NOT NULL,
	"lastupdated" timestamp NOT NULL,
	"ownership_type" varchar(50),
	"asset_classification" varchar(50),
	"is_liquid" boolean
);
--> statement-breakpoint
CREATE TABLE "pas_sis" (
	"sisid" serial PRIMARY KEY NOT NULL,
	"accountid" integer NOT NULL,
	"goalname" varchar(150) NOT NULL,
	"investmenttimeframe" varchar(50) NOT NULL,
	"investmentobjective" varchar(50) NOT NULL,
	"portfoliostrategy" varchar(100) NOT NULL,
	"percentage" numeric(5, 2) NOT NULL,
	"submanagerfee" numeric(10, 2),
	"lastupdated" timestamp,
	"signeddocumentid" integer,
	"createdon" timestamp NOT NULL,
	CONSTRAINT "chk_pas_sis_percentage" CHECK ((percentage >= (0)::numeric) AND (percentage <= (100)::numeric))
);
--> statement-breakpoint
CREATE TABLE "addresses" (
	"address_id" serial PRIMARY KEY NOT NULL,
	"ref_table" varchar(50) NOT NULL,
	"ref_id" varchar NOT NULL,
	"address_type" varchar(50) NOT NULL,
	"address1" varchar(255),
	"address2" varchar(255),
	"city" varchar(100),
	"state" varchar(50),
	"zip" varchar(20),
	"created_on" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"last_updated" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"is_primary" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "compliance_checks" (
	"checkid" serial PRIMARY KEY NOT NULL,
	"workitemid" integer NOT NULL,
	"checktype" varchar(50) NOT NULL,
	"status" varchar(20) NOT NULL,
	"checkedby" integer NOT NULL,
	"datechecked" timestamp NOT NULL,
	"comments" text,
	"priority" varchar(20),
	"due_date" timestamp,
	"triggered_by" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "rep_fees" (
	"fee_id" serial PRIMARY KEY NOT NULL,
	"rep_id" integer,
	"service_id" integer,
	"fee_amount" numeric(15, 2) NOT NULL,
	"fee_date" date NOT NULL,
	"payment_method" varchar(20) NOT NULL,
	"is_custom_fee" boolean DEFAULT false,
	"description" text,
	"created_on" timestamp DEFAULT CURRENT_TIMESTAMP,
	"last_updated" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "rep_fees_fee_amount_check" CHECK (fee_amount >= (0)::numeric),
	CONSTRAINT "rep_fees_payment_method_check" CHECK ((payment_method)::text = ANY ((ARRAY['Deduct from Commission'::character varying, 'Pre-pay'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE "client_finprofile" (
	"finprofile_id" serial PRIMARY KEY NOT NULL,
	"client_id" varchar NOT NULL,
	"profile_type" varchar(20),
	"networth" numeric,
	"networth_liquid" numeric,
	"income_annual" numeric,
	"taxbracket" varchar(50),
	"income_source" varchar(50),
	"invest_experience" varchar(50),
	"invest_experience_years" numeric,
	"total_heldaway_assets" numeric,
	"updated_date" text,
	"updated_by" text,
	"income_source_type" varchar(50),
	"income_description" varchar(255),
	"income_source_additional" varchar(255),
	"created_on" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"last_updated" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"joint_client_id" varchar
);
--> statement-breakpoint
CREATE TABLE "psi_holdings_staging" (
	"id" integer,
	"file_name" varchar,
	"line_number" integer,
	"raw_line" text
);
--> statement-breakpoint
CREATE TABLE "psi_submissions" (
	"submission_id" serial PRIMARY KEY NOT NULL,
	"work_item_id" integer,
	"pcm" varchar NOT NULL,
	"account_type" varchar(50) NOT NULL,
	"account_description" varchar NOT NULL,
	"trade_amount" numeric(15, 2) NOT NULL,
	"date_received" date NOT NULL,
	"ship_method" varchar(50),
	"tracking_number" varchar(50),
	"date_sent" date,
	"status_id" integer,
	"holdings_funds" text NOT NULL,
	"est_gdc" numeric(10, 2) NOT NULL,
	"entered_on" timestamp NOT NULL,
	"entered_by" varchar NOT NULL,
	"edited_by" varchar,
	"edited_date" timestamp,
	"version" timestamp NOT NULL,
	"notes" text,
	"client_last_name" varchar,
	"client_first_name" varchar
);
--> statement-breakpoint
CREATE TABLE "psi_holdings_temp" (
	"holding_id" varchar,
	"account_id" varchar,
	"holding_type" varchar,
	"security_name" varchar,
	"security_ticker" varchar,
	"cusip" varchar,
	"units" numeric,
	"unit_price" numeric,
	"market_value" numeric,
	"cost_basis" numeric,
	"last_updated" date,
	"created_on" date,
	"holding_fan" varchar,
	"product_no" varchar,
	"product_family" varchar,
	"hold_price_date" date,
	"branch_no" varchar,
	"rep_no" varchar
);
--> statement-breakpoint
CREATE TABLE "rep_1099_summary" (
	"summary_id" serial PRIMARY KEY NOT NULL,
	"rep_id" varchar,
	"tax_year" integer NOT NULL,
	"total_commission" numeric(18, 2) NOT NULL,
	"total_deductions" numeric(18, 2) DEFAULT '0',
	"net_income" numeric(18, 2) NOT NULL,
	"adjustments" numeric(18, 2) DEFAULT '0',
	"created_on" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "rep_1099_summary_tax_year_check" CHECK (tax_year > 2000),
	CONSTRAINT "rep_1099_summary_total_commission_check" CHECK (total_commission >= (0)::numeric),
	CONSTRAINT "rep_1099_summary_net_income_check" CHECK (net_income >= (0)::numeric)
);
--> statement-breakpoint
CREATE TABLE "households" (
	"household_id" text PRIMARY KEY DEFAULT nextval('pas_households_householdid_seq'::regclass) NOT NULL,
	"household_name" varchar(150) NOT NULL,
	"createdon" timestamp NOT NULL,
	"active" boolean,
	"repname" text
);
--> statement-breakpoint
CREATE TABLE "email_tracking" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contact_id" uuid,
	"email_subject" text,
	"email_body" text,
	"sent_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"opened_at" timestamp,
	"clicked_at" timestamp,
	"tracking_pixel_url" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "ref_codes" (
	"id" serial PRIMARY KEY NOT NULL,
	"list_name" text NOT NULL,
	"code" text NOT NULL,
	"description" text,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "list_values" (
	"id" serial PRIMARY KEY NOT NULL,
	"list_name" varchar(50) NOT NULL,
	"name" varchar NOT NULL,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "psi_orders_temp" (
	"order_id" integer,
	"status" varchar,
	"order_type" varchar,
	"ticket_no" varchar,
	"account_id" varchar,
	"account_searchid" varchar,
	"rep_no" varchar,
	"fan_rep_name" varchar,
	"branch_no" varchar,
	"product_no" varchar,
	"product_name" varchar,
	"product_family" varchar,
	"share_class" varchar,
	"cusip" varchar,
	"symbol" varchar,
	"fan" varchar,
	"trade_date" date,
	"settle_date" date,
	"entry_date" date,
	"cash_date" date,
	"confirm_date" date,
	"eod_date" date,
	"cnc_date" date,
	"comm_date" date,
	"purchase_code" varchar,
	"units" numeric,
	"unit_price" numeric,
	"amount_invested" numeric,
	"actual_cnc" numeric(18, 2),
	"cancel_flag" boolean,
	"suspense_flag" boolean,
	"hold_flag" boolean,
	"total_commission_paid" numeric,
	"comm_batch" text,
	"ord_cancel_ticketno" varchar,
	"memo" text,
	"eod_batch" varchar,
	"source_of_funds" varchar,
	"order_action" varchar,
	"inv_pay_method" varchar,
	"account_type_code" varchar,
	"transaction_description" varchar,
	"fanmail_batch" varchar,
	"fanmail_batch_date" date,
	"check_no" varchar,
	"res_state" varchar,
	"underwriter_cnc" numeric(18, 2),
	"dealer_com_code" varchar,
	"tin" integer,
	"record_code" integer
);
--> statement-breakpoint
CREATE TABLE "wf_status" (
	"status_id" serial PRIMARY KEY NOT NULL,
	"status_key" varchar(10) NOT NULL,
	"status" varchar(50) NOT NULL,
	"orderno" smallint NOT NULL,
	"updated_on" timestamp NOT NULL,
	"transition_to" jsonb,
	"type_id" integer,
	"public_status" varchar,
	CONSTRAINT "unique_statuskey" UNIQUE("status_key")
);
--> statement-breakpoint
CREATE TABLE "user_activity" (
	"activity_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"session_id" uuid NOT NULL,
	"login_timestamp" timestamp NOT NULL,
	"logout_timestamp" timestamp,
	"ip_address" varchar(45),
	"device" varchar(100),
	"browser_info" varchar(255),
	"activity_duration" interval,
	"actions_performed" text,
	"created_on" timestamp DEFAULT CURRENT_TIMESTAMP,
	"password_last_updated" timestamp,
	"failed_login_attempts" integer DEFAULT 0,
	"last_failed_login" timestamp
);
--> statement-breakpoint
CREATE TABLE "pas_registrations" (
	"registration_id" integer,
	"active" boolean,
	"last_name" varchar,
	"first_name" varchar,
	"full_name" varchar,
	"account_type" varchar,
	"curr_val" numeric,
	"tin" varchar,
	"dob" date,
	"household_id" integer,
	"date_created" timestamp,
	"custodian_acct_no" varchar,
	"has_sleeves" boolean,
	"reg_type" integer,
	"rep_name" varchar,
	"repnumber" varchar,
	"type_code" varchar
);
--> statement-breakpoint
CREATE TABLE "wf_type" (
	"work_type_id" serial PRIMARY KEY NOT NULL,
	"work_type_name" varchar(100) NOT NULL,
	"parentworktypeid" integer,
	"updated_on" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "instructions" (
	"instruction_id" serial PRIMARY KEY NOT NULL,
	"accountid" integer NOT NULL,
	"contactid" integer NOT NULL,
	"instructiontype" varchar(50) NOT NULL,
	"instructiondetails" text,
	"createdby" varchar(100) NOT NULL,
	"createdon" timestamp NOT NULL,
	"effectivedate" date,
	"signeddate" date,
	"status" varchar(50) NOT NULL,
	"lastupdated" timestamp,
	"lastupdatedby" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "psi_suitability_annuity" (
	"annuitysuitabilityid" serial PRIMARY KEY NOT NULL,
	"accountid" integer NOT NULL,
	"annuitytype" varchar(50) NOT NULL,
	"investmentswitchtype" varchar(100),
	"companyproduct" varchar(100),
	"shareclass" varchar(50),
	"initialinvestmentamount" numeric(12, 2) NOT NULL,
	"livingbenefitbase" numeric(12, 2),
	"surrenderschedule" text,
	"ridername" varchar(100),
	"riderfee" numeric(5, 2),
	"liquidityoptions" numeric(5, 2),
	"otheroptions" numeric(5, 2),
	"managementexpensefee" numeric(5, 2),
	"adminfee" numeric(5, 2),
	"totalexpenses" numeric(12, 2),
	"upfrontgdc" numeric(5, 2),
	"oldcompanyproduct" varchar(100),
	"oldshareclass" varchar(50),
	"oldinvestmentamount" numeric(12, 2),
	"oldlivingbenefitbase" numeric(12, 2),
	"oldsurrenderschedule" text,
	"oldridername" varchar(100),
	"oldriderfee" numeric(5, 2),
	"oldliquidityoptions" numeric(5, 2),
	"oldotheroptions" numeric(5, 2),
	"oldmanagementexpensefee" numeric(5, 2),
	"oldadminfee" numeric(5, 2),
	"oldtotalexpenses" numeric(12, 2),
	"oldupfrontgdc" numeric(5, 2),
	"oldrrpaid" boolean,
	"oldrrpaypercentage" numeric(5, 2),
	"replacementreason" text,
	"exchangebenefit" text,
	"exchangeinlast36months" boolean,
	"exchange36monthreason" text,
	"surrenderchargeexplanation" text,
	"distributionplan" varchar(100),
	"minimumholdingperiod" varchar(50),
	"firstdistribution" varchar(50),
	"currentfundsliquid" boolean,
	"percentageliquid" varchar(20),
	"postpurchaseliquidity" numeric(12, 2),
	"postsufficientliquidity" boolean,
	"planneduseofaccount" varchar(100),
	"planneduseofaccountother" text,
	"purchasereasons" varchar(100),
	"purchasereasonsother" text,
	"benefitvsotherproducts" text,
	"timehorizonandsurrenderconsistent" boolean,
	"reducedsurrendercharge" boolean,
	"reducedsurrenderchargebasetext" text,
	"livingbenefitwithin5years" varchar(20),
	"livingbenefitwithin5yearsexplain" text,
	"additionalnotes" text,
	"createdon" timestamp NOT NULL,
	"reducedsurrb" numeric(5, 2),
	"reducedsurrl" numeric(5, 2),
	"reducedsurrtextexplain" text,
	"lb5year" varchar(20),
	"lb5yearexplain" text,
	"addnotes" text,
	"surrenderperiod" varchar(50),
	"planneduseaccountother" text,
	"purchasereasonother" text,
	"benefitotherproducts" text
);
--> statement-breakpoint
CREATE TABLE "psi_suitability" (
	"suitabilityid" serial PRIMARY KEY NOT NULL,
	"accountid" integer NOT NULL,
	"producttype" varchar(50) NOT NULL,
	"otherproducttype" varchar(100),
	"issolicited" boolean NOT NULL,
	"investmenttype" varchar(50) NOT NULL,
	"sourceoffunds" varchar(100),
	"investmentamount" numeric(12, 2) NOT NULL,
	"productfamilyid" integer,
	"additionalinfo" text,
	"investmentobjective" varchar(50) NOT NULL,
	"investmenttimehorizon" varchar(20),
	"risktolerancelevel" varchar(20),
	"liquidityneedslevel" varchar(20),
	"createdon" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "psi_holdings" (
	"account_id" varchar NOT NULL,
	"holding_type" varchar(50) NOT NULL,
	"security_name" varchar(150),
	"security_ticker" varchar(20),
	"cusip" varchar(20),
	"units" numeric,
	"unit_price" numeric,
	"market_value" numeric,
	"cost_basis" numeric,
	"last_updated" date DEFAULT CURRENT_TIMESTAMP,
	"created_on" date DEFAULT CURRENT_TIMESTAMP,
	"holding_fan" varchar(50),
	"product_no" varchar,
	"product_family" varchar,
	"hold_price_date" date,
	"branch_no" varchar,
	"rep_no" varchar,
	"holding_id" integer PRIMARY KEY DEFAULT nextval('psi_holdings_holding_id_seq'::regclass) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "psi_blotter" (
	"blotter_id" serial PRIMARY KEY NOT NULL,
	"submissions_id" integer NOT NULL,
	"transfer_type" varchar(50) NOT NULL,
	"check_no" varchar(50),
	"transaction_amount" numeric(15, 2) NOT NULL,
	"est_gdc" numeric(15, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "list_order_types" (
	"order_type_id" serial PRIMARY KEY NOT NULL,
	"order_name" varchar(100) NOT NULL,
	"order_code" varchar(20) NOT NULL,
	"product_type" varchar(100) NOT NULL,
	"is_arr" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "psi_orders_staging" (
	"id" serial PRIMARY KEY NOT NULL,
	"file_name" varchar(255),
	"line_number" integer,
	"raw_line" text
);
--> statement-breakpoint
CREATE TABLE "reps" (
	"pcm" varchar(15) PRIMARY KEY NOT NULL,
	"firstname" varchar(50),
	"lastname" varchar(50),
	"fullname" varchar,
	"is_active" boolean DEFAULT true,
	"rep_type" varchar(50) DEFAULT 'Unassigned' NOT NULL,
	"is_branch_mgr" boolean DEFAULT false,
	"pw_hash" varchar(255),
	"profile_picture_url" varchar(255),
	"dob" date,
	"marital_status" varchar(50),
	"gender" varchar(10),
	"tin" varchar(50),
	"shirt_size" varchar(10),
	"crd" varchar(20),
	"npn" varchar(20)
);
--> statement-breakpoint
CREATE TABLE "pas_accounts" (
	"account_id" integer,
	"active" boolean,
	"full_name" varchar,
	"account_no" varchar,
	"custodian" varchar,
	"account_type" varchar,
	"model" varchar,
	"date_created" timestamp,
	"source" varchar,
	"fee_schedule" varchar,
	"fee_schedule_id" integer,
	"household_name" varchar,
	"model_agg_id" integer,
	"payout_schedule" varchar,
	"rep_name" varchar,
	"rep_no" varchar,
	"date_start" date,
	"sub_advisor" varchar
);
--> statement-breakpoint
CREATE TABLE "notes" (
	"noteid" serial PRIMARY KEY NOT NULL,
	"relatedid" integer NOT NULL,
	"relatedtype" varchar(50) NOT NULL,
	"notetype" varchar(50) NOT NULL,
	"addedby" varchar(100) NOT NULL,
	"addeddate" timestamp NOT NULL,
	"notemessage" text NOT NULL,
	"lastupdated" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "psi_orders_raw" (
	"id" serial PRIMARY KEY NOT NULL,
	"file_name" varchar(255),
	"raw_data" text,
	"uploaded_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "rep_commission_adjustments" (
	"adjustment_id" serial PRIMARY KEY NOT NULL,
	"commission_id" integer,
	"rep_id" integer,
	"adjustment_type" varchar(50) NOT NULL,
	"adjustment_amount" numeric(15, 2) NOT NULL,
	"description" text,
	"created_on" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "rep_commission_adjustments_adjustment_amount_check" CHECK (adjustment_amount >= (0)::numeric)
);
--> statement-breakpoint
CREATE TABLE "psi_orders" (
	"order_id" serial NOT NULL,
	"status" varchar(50),
	"order_type" varchar(50) NOT NULL,
	"ticket_no" varchar(50),
	"account_id" varchar(50),
	"account_searchid" varchar(50),
	"rep_no" varchar(50),
	"fan_rep_name" varchar(50),
	"branch_no" varchar(50),
	"product_no" varchar(50),
	"product_name" varchar(100),
	"product_family" varchar(50),
	"share_class" varchar(20),
	"cusip" varchar(20),
	"symbol" varchar(20),
	"fan" varchar(50),
	"trade_date" date,
	"settle_date" date,
	"entry_date" date,
	"cash_date" date,
	"confirm_date" date,
	"eod_date" date,
	"cnc_date" date,
	"comm_date" date,
	"purchase_code" varchar(20),
	"units" numeric(15, 4),
	"unit_price" numeric(12, 4),
	"amount_invested" numeric(18, 2),
	"actual_cnc" numeric(18, 2),
	"cancel_flag" boolean,
	"suspense_flag" boolean,
	"hold_flag" boolean,
	"total_commission_paid" numeric(18, 2),
	"comm_batch" text,
	"ord_cancel_ticketno" varchar(50),
	"memo" text,
	"eod_batch" varchar(50),
	"source_of_funds" varchar(50),
	"order_action" varchar(50),
	"inv_pay_method" varchar,
	"account_type_code" varchar(50),
	"transaction_description" varchar,
	"fanmail_batch" varchar,
	"fanmail_batch_date" date,
	"check_no" varchar,
	"res_state" varchar,
	"underwriter_cnc" numeric(18, 2),
	"dealer_com_code" varchar(10),
	"tin" integer,
	"record_code" integer
);
--> statement-breakpoint
CREATE TABLE "rep_commission_statements" (
	"statement_id" serial PRIMARY KEY NOT NULL,
	"rep_id" integer,
	"commission_id" integer,
	"statement_date" timestamp NOT NULL,
	"total_commission" numeric(15, 2) NOT NULL,
	"total_deductions" numeric(15, 2) DEFAULT '0',
	"net_payout" numeric(15, 2) NOT NULL,
	"created_on" timestamp DEFAULT CURRENT_TIMESTAMP,
	"batch_id" integer,
	CONSTRAINT "rep_commission_statements_total_commission_check" CHECK (total_commission >= (0)::numeric),
	CONSTRAINT "rep_commission_statements_net_payout_check" CHECK (net_payout >= (0)::numeric)
);
--> statement-breakpoint
ALTER TABLE "psi_accounts" ADD CONSTRAINT "fk_client_primary" FOREIGN KEY ("client_id_primary") REFERENCES "public"."clients"("client_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wf_item_status_history" ADD CONSTRAINT "wf_item_status_history_workitemid_fkey" FOREIGN KEY ("work_item_id") REFERENCES "public"."wf_item"("work_item_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wf_item_status_history" ADD CONSTRAINT "wf_item_status_history_statusid_fkey" FOREIGN KEY ("status_id") REFERENCES "public"."wf_status"("status_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wf_item" ADD CONSTRAINT "wf_item_statusid_fkey" FOREIGN KEY ("status_id") REFERENCES "public"."wf_status"("status_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wf_item_queue" ADD CONSTRAINT "fk_wf_item_queue_workitemid" FOREIGN KEY ("work_item_id") REFERENCES "public"."wf_item"("work_item_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wf_item_queue" ADD CONSTRAINT "wf_item_queue_statusid_fkey" FOREIGN KEY ("status_id") REFERENCES "public"."wf_status"("status_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pas_holdings" ADD CONSTRAINT "pas_account_holdings_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."summary_product_type"("productid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wf_status" ADD CONSTRAINT "wf_status_typeid_fkey" FOREIGN KEY ("type_id") REFERENCES "public"."wf_type"("work_type_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "psi_blotter" ADD CONSTRAINT "fk_submissions" FOREIGN KEY ("submissions_id") REFERENCES "public"."psi_submissions"("submission_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_rep_registrations_repid" ON "rep_registrations" USING btree ("rep_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_rep_registrations_type" ON "rep_registrations" USING btree ("registration_type" text_ops);--> statement-breakpoint
CREATE INDEX "idx_rep_commissions_account_id" ON "rep_commissions" USING btree ("account_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_rep_commissions_rep_id" ON "rep_commissions" USING btree ("rep_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_rep_commissions_transaction_id" ON "rep_commissions" USING btree ("order_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_signatures_provider" ON "signatures" USING btree ("provider" text_ops);--> statement-breakpoint
CREATE INDEX "idx_wf_item_assignedto" ON "wf_item" USING btree ("assigned_to" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_wf_item_queue_roleid" ON "wf_item_queue" USING btree ("role_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_wf_item_queue_userid" ON "wf_item_queue" USING btree ("user_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_bank_info_accountid" ON "bank_info" USING btree ("account_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_notifications_userid" ON "notifications" USING btree ("userid" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_audit_log_tablename" ON "audit_log" USING btree ("tablename" text_ops);--> statement-breakpoint
CREATE INDEX "idx_product_family_familyname" ON "product_family" USING btree ("family_name" text_ops);--> statement-breakpoint
CREATE INDEX "idx_documents_relatedid" ON "documents" USING btree ("relatedid" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_user_permissions_role" ON "user_permissions" USING btree ("role" text_ops);--> statement-breakpoint
CREATE INDEX "idx_user_permissions_userid_role" ON "user_permissions" USING btree ("userid" int4_ops,"role" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_fanmail_file_name" ON "fanmail_downloads" USING btree ("file_name" text_ops);--> statement-breakpoint
CREATE INDEX "idx_fanmail_upload_date" ON "fanmail_downloads" USING btree ("upload_date" timestamp_ops);--> statement-breakpoint
CREATE INDEX "idx_rep_licenses_state" ON "rep_licenses" USING btree ("state" text_ops);--> statement-breakpoint
CREATE INDEX "idx_psi_heldaway_financialprofileid" ON "psi_heldaway" USING btree ("accountid" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_pas_sis_accountid" ON "pas_sis" USING btree ("accountid" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_compliance_checks_checktype" ON "compliance_checks" USING btree ("checktype" text_ops);--> statement-breakpoint
CREATE INDEX "idx_ref_codes_list_name" ON "ref_codes" USING btree ("list_name" text_ops);--> statement-breakpoint
CREATE INDEX "idx_list_values_list_name" ON "list_values" USING btree ("list_name" text_ops);--> statement-breakpoint
CREATE INDEX "idx_user_activity_login_timestamp" ON "user_activity" USING btree ("login_timestamp" timestamp_ops);--> statement-breakpoint
CREATE INDEX "idx_user_activity_user_id" ON "user_activity" USING btree ("user_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_instructions_accountid" ON "instructions" USING btree ("accountid" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_instructions_contactid" ON "instructions" USING btree ("contactid" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_instructions_instructiontype" ON "instructions" USING btree ("instructiontype" text_ops);--> statement-breakpoint
CREATE INDEX "idx_psi_suitability_investmenttype" ON "psi_suitability" USING btree ("investmenttype" text_ops);--> statement-breakpoint
CREATE INDEX "idx_reps_pcm" ON "reps" USING btree ("pcm" text_ops);--> statement-breakpoint
CREATE INDEX "idx_notes_related" ON "notes" USING btree ("relatedid" int4_ops,"relatedtype" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_psi_orders_repsearchid" ON "psi_orders" USING btree ("fan_rep_name" text_ops);--> statement-breakpoint
CREATE INDEX "idx_psi_orders_tradedate" ON "psi_orders" USING btree ("trade_date" date_ops);
*/