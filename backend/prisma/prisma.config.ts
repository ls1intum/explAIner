// Prisma 7.x: Connection URLs for Migrate moved here from schema.prisma
// This file is used by migration commands (prisma migrate, prisma db push, etc.)
export default {
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
};
