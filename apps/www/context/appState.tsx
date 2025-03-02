"use client";

import { getAuthenticatedUser, listNotifications } from "@/actions/gh";
import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";
import React, {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useSession } from "next-auth/react";

export type BaseNotification =
  RestEndpointMethodTypes["activity"]["listNotificationsForAuthenticatedUser"]["response"]["data"][0];

export interface Notification extends BaseNotification {
  pullRequest?: RestEndpointMethodTypes["pulls"]["get"]["response"]["data"];
  issue?: RestEndpointMethodTypes["issues"]["get"]["response"]["data"];
}

export type User =
  RestEndpointMethodTypes["users"]["getAuthenticated"]["response"]["data"];

interface AppStateContextType {
  notifications: Notification[];
  selectedNotification?: Notification | null;
  setSelectedNotification: React.Dispatch<
    React.SetStateAction<Notification | null>
  >;
  user: User | null;
  isNotificationsLoading: boolean;
}

export const AppStateContext = createContext<AppStateContextType | undefined>(
  undefined
);

export const AppStateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // ! All centralized states
  const [notifications, setNotifications] = useState<Notification[]>([]);
  // ! Is Notification Loading
  const [isNotificationsLoading, setIsNotificationsLoading] =
    useState<boolean>(true);

  // ! Selected notification
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

  // ! user state
  const [user, setUser] = useState<User | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    // ! Fetch notifications
    (async () => {
      if (!session || !session.user.accessToken) {
        return;
      }

      const [notificationsList, activeUser] = await Promise.all([
        listNotifications(),
        getAuthenticatedUser(),
      ]);
      setUser(activeUser);
      setNotifications(notificationsList);
      setIsNotificationsLoading(false);
    })();
  }, [session]);

  return (
    <AppStateContext.Provider
      value={{
        notifications,
        selectedNotification,
        setSelectedNotification,
        user,
        isNotificationsLoading,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export type { AppStateContextType };
