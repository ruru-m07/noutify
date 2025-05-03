import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

export type BaseNotification =
  RestEndpointMethodTypes["activity"]["listNotificationsForAuthenticatedUser"]["response"]["data"][0];

export interface Notification extends BaseNotification {
  pullRequest?: RestEndpointMethodTypes["pulls"]["get"]["response"]["data"];
  issue?: RestEndpointMethodTypes["issues"]["get"]["response"]["data"];
}
