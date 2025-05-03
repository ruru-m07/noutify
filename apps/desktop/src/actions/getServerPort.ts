"use server";

export async function getServerPort() {
  return { port: process.env.PORT };
}
