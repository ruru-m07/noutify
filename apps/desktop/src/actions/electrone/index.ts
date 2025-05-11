"use server";

import { app } from "electron";

export async function getUserDataPath() {
  const userDataPath = app.getPath("userData");
  console.log(userDataPath);
  return userDataPath;
}
