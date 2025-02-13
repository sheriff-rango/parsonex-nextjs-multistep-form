import { relations } from "drizzle-orm/relations";
import {
  clients,
  psiAccounts,
  wfItem,
  wfItemStatusHistory,
  wfStatus,
  wfItemQueue,
  summaryProductType,
  pasHoldings,
  wfType,
  psiSubmissions,
  psiBlotter,
} from "./schema";

export const psiAccountsRelations = relations(psiAccounts, ({ one }) => ({
  client: one(clients, {
    fields: [psiAccounts.clientIdPrimary],
    references: [clients.clientId],
  }),
}));

export const clientsRelations = relations(clients, ({ many }) => ({
  psiAccounts: many(psiAccounts),
}));

export const wfItemStatusHistoryRelations = relations(
  wfItemStatusHistory,
  ({ one }) => ({
    wfItem: one(wfItem, {
      fields: [wfItemStatusHistory.workItemId],
      references: [wfItem.workItemId],
    }),
    wfStatus: one(wfStatus, {
      fields: [wfItemStatusHistory.statusId],
      references: [wfStatus.statusId],
    }),
  }),
);

export const wfItemRelations = relations(wfItem, ({ one, many }) => ({
  wfItemStatusHistories: many(wfItemStatusHistory),
  wfStatus: one(wfStatus, {
    fields: [wfItem.statusId],
    references: [wfStatus.statusId],
  }),
  wfItemQueues: many(wfItemQueue),
}));

export const wfStatusRelations = relations(wfStatus, ({ one, many }) => ({
  wfItemStatusHistories: many(wfItemStatusHistory),
  wfItems: many(wfItem),
  wfItemQueues: many(wfItemQueue),
  wfType: one(wfType, {
    fields: [wfStatus.typeId],
    references: [wfType.workTypeId],
  }),
}));

export const wfItemQueueRelations = relations(wfItemQueue, ({ one }) => ({
  wfItem: one(wfItem, {
    fields: [wfItemQueue.workItemId],
    references: [wfItem.workItemId],
  }),
  wfStatus: one(wfStatus, {
    fields: [wfItemQueue.statusId],
    references: [wfStatus.statusId],
  }),
}));

export const pasHoldingsRelations = relations(pasHoldings, ({ one }) => ({
  summaryProductType: one(summaryProductType, {
    fields: [pasHoldings.productId],
    references: [summaryProductType.productid],
  }),
}));

export const summaryProductTypeRelations = relations(
  summaryProductType,
  ({ many }) => ({
    pasHoldings: many(pasHoldings),
  }),
);

export const wfTypeRelations = relations(wfType, ({ many }) => ({
  wfStatuses: many(wfStatus),
}));

export const psiBlotterRelations = relations(psiBlotter, ({ one }) => ({
  psiSubmission: one(psiSubmissions, {
    fields: [psiBlotter.submissionsId],
    references: [psiSubmissions.submissionId],
  }),
}));

export const psiSubmissionsRelations = relations(
  psiSubmissions,
  ({ many }) => ({
    psiBlotters: many(psiBlotter),
  }),
);
