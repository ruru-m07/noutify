
// This file helps Electron find the Prisma client
const path = require('path');
const { app } = require('electron');

// Determine if we're in development or production
const isDev = process.env.NODE_ENV === 'development';

// In development, use the regular node_modules path
// In production, use the special electron-prisma directory
const prismaClientPath = isDev 
  ? path.join(process.cwd(), 'node_modules', '.prisma', 'client')
  : path.join(app.getAppPath(), 'electron-prisma', 'client');

process.env.PRISMA_QUERY_ENGINE_LIBRARY = path.join(
  prismaClientPath,
  'libquery_engine'
);

// Export the path for use in the app
module.exports = {
  prismaClientPath
};
