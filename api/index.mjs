var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": '// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nenum Role {\n  STUDENT\n  ADMIN\n  TUTOR\n}\n\nenum UserStatus {\n  ACTIVE\n  INACTIVE\n  BLOCKED\n}\n\nmodel User {\n  id            String        @id @default(uuid())\n  email         String        @unique\n  name          String?\n  role          Role          @default(STUDENT)\n  status        UserStatus    @default(ACTIVE)\n  tutorProfile  TutorProfile?\n  reviews       Review[]\n  emailVerified Boolean       @default(false)\n  image         String?\n  createdAt     DateTime      @default(now())\n  updatedAt     DateTime      @updatedAt\n  sessions      Session[]\n  accounts      Account[]\n  students      Booking[]\n\n  @@map("user")\n}\n\nmodel TutorProfile {\n  id String @id @default(uuid())\n\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id])\n\n  title        String?\n  bio          String?     @db.Text\n  hourlyRate   Int\n  isFeatured   Boolean     @default(false)\n  experience   Int?\n  availability TutorStatus @default(AVAILABLE)\n  timeSlots    Json?\n\n  averageRating Float           @default(0.0)\n  totalReviews  Int             @default(0)\n  reviews       Review[]\n  bookings      Booking[]\n  categories    TutorCategory[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel Review {\n  id String @id @default(uuid())\n\n  tutorId String\n  tutor   TutorProfile @relation(fields: [tutorId], references: [id])\n\n  studentId String\n  student   User   @relation(fields: [studentId], references: [id])\n\n  rating  Int\n  comment String? @db.Text\n\n  createdAt DateTime @default(now())\n}\n\nmodel Booking {\n  id String @id @default(uuid())\n\n  tutorId String\n  tutor   TutorProfile @relation(fields: [tutorId], references: [id])\n\n  studentId     String\n  student       User    @relation(fields: [studentId], references: [id])\n  studentAttend Boolean @default(false)\n\n  slotId    String @default("temp-id")\n  day       String @default("temp-day")\n  startTime String\n  endTime   String\n\n  amount Int\n  status BookingStatus @default(CONFIRMED)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([tutorId, slotId, day])\n}\n\n// booking status\nenum BookingStatus {\n  CONFIRMED\n  COMPLETED\n  CANCELLED\n}\n\n// categories\n\nmodel Category {\n  id        String          @id @default(uuid())\n  name      String          @unique\n  icon      String?\n  tutors    TutorCategory[]\n  createdAt DateTime        @default(now())\n  updatedAt DateTime        @updatedAt\n}\n\nmodel TutorCategory {\n  tutorId    String\n  categoryId String\n\n  tutor    TutorProfile @relation(fields: [tutorId], references: [id])\n  category Category     @relation(fields: [categoryId], references: [id])\n\n  @@id([tutorId, categoryId])\n}\n\nenum TutorStatus {\n  AVAILABLE\n  UNAVAILABLE\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"TutorProfileToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"students","kind":"object","type":"Booking","relationName":"BookingToUser"}],"dbName":"user"},"TutorProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TutorProfileToUser"},{"name":"title","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"hourlyRate","kind":"scalar","type":"Int"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"experience","kind":"scalar","type":"Int"},{"name":"availability","kind":"enum","type":"TutorStatus"},{"name":"timeSlots","kind":"scalar","type":"Json"},{"name":"averageRating","kind":"scalar","type":"Float"},{"name":"totalReviews","kind":"scalar","type":"Int"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToTutorProfile"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToTutorProfile"},{"name":"categories","kind":"object","type":"TutorCategory","relationName":"TutorCategoryToTutorProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"ReviewToTutorProfile"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"student","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Booking":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"BookingToTutorProfile"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"student","kind":"object","type":"User","relationName":"BookingToUser"},{"name":"studentAttend","kind":"scalar","type":"Boolean"},{"name":"slotId","kind":"scalar","type":"String"},{"name":"day","kind":"scalar","type":"String"},{"name":"startTime","kind":"scalar","type":"String"},{"name":"endTime","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"BookingStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"icon","kind":"scalar","type":"String"},{"name":"tutors","kind":"object","type":"TutorCategory","relationName":"CategoryToTutorCategory"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"TutorCategory":{"fields":[{"name":"tutorId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"TutorCategoryToTutorProfile"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToTutorCategory"}],"dbName":null},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull2,
  BookingScalarFieldEnum: () => BookingScalarFieldEnum,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  JsonNullValueFilter: () => JsonNullValueFilter,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullableJsonNullValueInput: () => NullableJsonNullValueInput,
  NullsOrder: () => NullsOrder,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  TutorCategoryScalarFieldEnum: () => TutorCategoryScalarFieldEnum,
  TutorProfileScalarFieldEnum: () => TutorProfileScalarFieldEnum,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.3.0",
  engine: "9d6ad21cbbceab97458517b147a6a09ff43aa735"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  User: "User",
  TutorProfile: "TutorProfile",
  Review: "Review",
  Booking: "Booking",
  Category: "Category",
  TutorCategory: "TutorCategory",
  Session: "Session",
  Account: "Account",
  Verification: "Verification"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var UserScalarFieldEnum = {
  id: "id",
  email: "email",
  name: "name",
  role: "role",
  status: "status",
  emailVerified: "emailVerified",
  image: "image",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TutorProfileScalarFieldEnum = {
  id: "id",
  userId: "userId",
  title: "title",
  bio: "bio",
  hourlyRate: "hourlyRate",
  isFeatured: "isFeatured",
  experience: "experience",
  availability: "availability",
  timeSlots: "timeSlots",
  averageRating: "averageRating",
  totalReviews: "totalReviews",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ReviewScalarFieldEnum = {
  id: "id",
  tutorId: "tutorId",
  studentId: "studentId",
  rating: "rating",
  comment: "comment",
  createdAt: "createdAt"
};
var BookingScalarFieldEnum = {
  id: "id",
  tutorId: "tutorId",
  studentId: "studentId",
  studentAttend: "studentAttend",
  slotId: "slotId",
  day: "day",
  startTime: "startTime",
  endTime: "endTime",
  amount: "amount",
  status: "status",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CategoryScalarFieldEnum = {
  id: "id",
  name: "name",
  icon: "icon",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TutorCategoryScalarFieldEnum = {
  tutorId: "tutorId",
  categoryId: "categoryId"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var NullableJsonNullValueInput = {
  DbNull: DbNull2,
  JsonNull: JsonNull2
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var JsonNullValueFilter = {
  DbNull: DbNull2,
  JsonNull: JsonNull2,
  AnyNull: AnyNull2
};
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  emailAndPassword: {
    enabled: true
  },
  trustedOrigins: [process.env.TRUSTED_URL || "http://localhost:3000"],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false
      },
      phone: {
        type: "string",
        required: false
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false
      }
    }
  }
});

// src/route.ts
import { Router as Router6 } from "express";

// src/modules/tutor/tutor.route.ts
import { Router } from "express";

// src/modules/tutor/tutor.service.ts
var allTutors = async (query) => {
  const {
    searchTerm,
    rating,
    minPrice,
    maxPrice,
    category,
    page = 1,
    limit = 10
  } = query;
  const skip = (Number(page) - 1) * Number(limit);
  const whereConditions = {
    user: { status: "ACTIVE" }
  };
  if (category && category !== "all") {
    whereConditions.categories = {
      some: {
        category: {
          name: category
        }
      }
    };
  }
  if (searchTerm) {
    whereConditions.OR = [
      { title: { contains: searchTerm, mode: "insensitive" } },
      { bio: { contains: searchTerm, mode: "insensitive" } },
      { user: { name: { contains: searchTerm, mode: "insensitive" } } }
    ];
  }
  if (rating) {
    whereConditions.averageRating = {
      gte: Number(rating)
    };
  }
  if (minPrice || maxPrice) {
    whereConditions.hourlyRate = {
      ...minPrice && { gte: Number(minPrice) },
      ...maxPrice && { lte: Number(maxPrice) }
    };
  }
  const result = await prisma.tutorProfile.findMany({
    where: whereConditions,
    include: {
      user: true,
      reviews: true
    },
    skip,
    take: Number(limit),
    orderBy: {
      createdAt: "desc"
    }
  });
  const total = await prisma.tutorProfile.count({ where: whereConditions });
  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPage: Math.ceil(total / Number(limit))
    },
    data: result
  };
};
var featuredTutors = async () => {
  const response = await prisma.tutorProfile.findMany({
    where: { isFeatured: true },
    take: 6,
    include: {
      user: {
        select: {
          name: true,
          email: true,
          status: true,
          image: true
        }
      },
      categories: {
        include: {
          category: {
            select: {
              name: true,
              icon: true
            }
          }
        }
      }
    }
  });
  return response;
};
var createTutorProfile = async (payload, userId) => {
  const { bio, hourlyRate, categories, timeSlots, title } = payload;
  const existProfile = await prisma.tutorProfile.findUnique({
    where: { userId }
  });
  if (existProfile) {
    throw new Error("Tutor profile already exists");
  }
  const data = await prisma.tutorProfile.create({
    data: {
      userId,
      title,
      bio,
      timeSlots,
      hourlyRate,
      categories: {
        create: categories.map((id) => ({
          category: {
            connect: { id }
          }
        }))
      }
    },
    include: {
      categories: {
        include: {
          category: true
        }
      }
    }
  });
  return data;
};
var tutorDetails = async (tutorId) => {
  const data = await prisma.tutorProfile.findUnique({
    where: { id: tutorId },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          status: true,
          image: true
        }
      },
      reviews: {
        take: 4,
        select: {
          comment: true,
          rating: true,
          student: {
            select: {
              name: true,
              email: true,
              image: true
            }
          }
        }
      }
    }
  });
  return data;
};
var updateVisibility = async (id, userId, newStatus) => {
  const existTutorProfile = await prisma.tutorProfile.findUnique({
    where: { id }
  });
  if (!existTutorProfile) {
    throw new Error("Tutor profile not found");
  }
  if (existTutorProfile.userId !== userId) {
    throw new Error("You can only update your own profile");
  }
  const data = await prisma.tutorProfile.update({
    where: { id },
    data: { availability: newStatus }
  });
  return data;
};
var updateTutorProfile = async (id, payload) => {
  const { title, bio, hourlyRate, categories, experience, timeSlots } = payload;
  const existProfile = await prisma.tutorProfile.findUnique({
    where: {
      userId: id
    }
  });
  if (!existProfile) {
    throw new Error("Tutor profile not found");
  }
  await prisma.tutorProfile.update({
    where: { id: existProfile?.id },
    data: {
      ...title !== void 0 && { title },
      ...bio !== void 0 && { bio },
      ...hourlyRate !== void 0 && { hourlyRate },
      ...experience !== void 0 && { experience },
      ...timeSlots !== void 0 && { timeSlots },
      ...categories && {
        categories: {
          deleteMany: {},
          create: categories.map((catId) => ({
            category: {
              connect: { id: catId }
            }
          }))
        }
      }
    },
    include: {
      categories: true
    }
  });
};
var getTutorProfile = async (id) => {
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: {
      userId: id
    },
    select: {
      title: true,
      hourlyRate: true,
      experience: true,
      bio: true,
      timeSlots: true,
      categories: {
        select: {
          category: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    }
  });
  if (!tutorProfile) {
    throw new Error("Tutor profile not found");
  }
  return tutorProfile;
};
var TutorService = {
  allTutors,
  featuredTutors,
  createTutorProfile,
  tutorDetails,
  updateVisibility,
  updateTutorProfile,
  getTutorProfile
};

// src/modules/tutor/tutor.controller.ts
var allTutors2 = async (req, res, next) => {
  try {
    const queries = req.query;
    const data = await TutorService.allTutors(queries);
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};
var featuredTutors2 = async (req, res, next) => {
  try {
    const data = await TutorService.featuredTutors();
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};
var createTutorProfile2 = async (req, res, next) => {
  try {
    const payload = req.body;
    const userId = req.user?.id;
    const data = await TutorService.createTutorProfile(
      payload,
      userId
    );
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};
var tutorDetails2 = async (req, res, next) => {
  try {
    const tutorId = req.params.id;
    const data = await TutorService.tutorDetails(tutorId);
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};
var updateVisibility2 = async (req, res, next) => {
  try {
    const newStatus = req.body.availability;
    const id = req.params.id;
    const userId = req.user?.id;
    const data = await TutorService.updateVisibility(
      id,
      userId,
      newStatus
    );
    res.status(200).json({
      success: true,
      message: "Visibility update successfully"
    });
  } catch (error) {
    next(error);
  }
};
var updateTutorProfile2 = async (req, res, next) => {
  try {
    const payload = req.body;
    const id = req.user?.id;
    await TutorService.updateTutorProfile(id, payload);
    res.status(200).json({
      success: true,
      message: "Profile update successfully"
    });
  } catch (error) {
    next(error);
  }
};
var getTutorProfile2 = async (req, res, next) => {
  try {
    const id = req.user?.id;
    const data = await TutorService.getTutorProfile(id);
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};
var TutorController = {
  allTutors: allTutors2,
  createTutorProfile: createTutorProfile2,
  tutorDetails: tutorDetails2,
  updateVisibility: updateVisibility2,
  updateTutorProfile: updateTutorProfile2,
  featuredTutors: featuredTutors2,
  getTutorProfile: getTutorProfile2
};

// src/middlewares/auth.middleware.ts
import { fromNodeHeaders } from "better-auth/node";
var middleware = (...roles) => {
  return async (req, res, next) => {
    const token = req.headers.cookie;
    if (!token) {
      return res.send("you are not authenticate");
    }
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers)
    });
    req.user = {
      id: session?.user.id,
      name: session?.user.email,
      email: session?.user.email,
      role: session?.user.role,
      emailVerified: session?.user.emailVerified
    };
    if (roles.length && !roles.includes(req.user.role)) {
      return res.send("Forbidden access");
    }
    next();
  };
};

// src/modules/tutor/tutor.route.ts
var router = Router();
router.get("/", TutorController.allTutors);
router.get("/featured", TutorController.featuredTutors);
router.get("/:id", TutorController.tutorDetails);
router.post(
  "/create-profile",
  middleware("TUTOR" /* TUTOR */),
  TutorController.createTutorProfile
);
router.patch(
  "/:id/availability",
  middleware("TUTOR" /* TUTOR */),
  TutorController.updateVisibility
);
router.get(
  "/tutor/profile",
  middleware("TUTOR" /* TUTOR */),
  TutorController.getTutorProfile
);
router.patch(
  "/update/profile",
  middleware("TUTOR" /* TUTOR */),
  TutorController.updateTutorProfile
);
var TutorRoute = router;

// src/modules/category/category.route.ts
import { Router as Router2 } from "express";

// src/modules/category/category.service.ts
var createCategory = async (payload) => {
  const data = await prisma.category.create({ data: payload });
  return data;
};
var updateCategory = async (id, payload) => {
  const isExist = await prisma.category.findUnique({
    where: { id }
  });
  if (!isExist) {
    throw new Error("Category not found!");
  }
  await prisma.category.update({
    where: {
      id
    },
    data: payload
  });
};
var getCategories = async (query) => {
  const data = await prisma.category.findMany({
    where: {
      name: { contains: query, mode: "insensitive" }
    }
  });
  return data;
};
var deleteCategories = async (catId) => {
  const data = await prisma.category.delete({ where: { id: catId } });
  return data;
};
var CategoryService = {
  createCategory,
  getCategories,
  deleteCategories,
  updateCategory
};

// src/modules/category/category.controller.ts
var createCategory2 = async (req, res, next) => {
  try {
    const payload = req.body;
    const data = await CategoryService.createCategory(payload);
    res.status(201).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};
var updateCategory2 = async (req, res, next) => {
  try {
    const payload = req.body;
    const catId = req.params.id;
    await CategoryService.updateCategory(catId, payload);
    res.status(201).json({
      success: true,
      message: "Category update successfully"
    });
  } catch (error) {
    next(error);
  }
};
var getCategories2 = async (req, res, next) => {
  try {
    const searchValue = typeof req.query.search === "string" ? req.query.search : "";
    const data = await CategoryService.getCategories(searchValue);
    res.status(201).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};
var deleteCategory = async (req, res, next) => {
  try {
    const catId = req.params.id;
    const data = await CategoryService.deleteCategories(catId);
    res.status(200).json({
      success: true,
      message: "category delete successfully"
    });
  } catch (error) {
    next(error);
  }
};
var CategoryController = {
  createCategory: createCategory2,
  getCategories: getCategories2,
  deleteCategory,
  updateCategory: updateCategory2
};

// src/modules/category/category.route.ts
var router2 = Router2();
router2.post("/", middleware("ADMIN" /* ADMIN */), CategoryController.createCategory);
router2.patch(
  "/:id/update",
  middleware("ADMIN" /* ADMIN */),
  CategoryController.updateCategory
);
router2.get(
  "/",
  CategoryController.getCategories
);
router2.delete(
  "/:id",
  middleware("ADMIN" /* ADMIN */),
  CategoryController.deleteCategory
);
var categoryRouter = router2;

// src/modules/admin/admin.route.ts
import { Router as Router3 } from "express";

// src/modules/admin/admin.service.ts
var allUsers = async () => {
  const users = await prisma.user.findMany({
    where: {
      role: {
        in: ["TUTOR", "STUDENT"]
      }
    },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      image: true,
      role: true,
      createdAt: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return users;
};
var statistics = async () => {
  const [
    totalUsers,
    totalTutors,
    totalBookings,
    revenueData,
    bookingStats,
    recentBookings
  ] = await Promise.all([
    prisma.user.count(),
    prisma.tutorProfile.count(),
    prisma.booking.count(),
    prisma.booking.aggregate({
      where: { status: "COMPLETED" },
      _sum: { amount: true }
    }),
    prisma.booking.groupBy({
      by: ["status"],
      _count: true
    }),
    prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        student: { select: { name: true } },
        tutor: { select: { user: { select: { name: true } } } }
      }
    })
  ]);
  return {
    overview: {
      totalUsers,
      totalTutors,
      totalBookings,
      totalRevenue: revenueData._sum.amount || 0
    },
    bookingStats,
    recentBookings
  };
};
var updateUserStatus = async (id, status) => {
  const response = await prisma.user.update({
    where: { id },
    data: { status }
  });
  return response;
};
var AdminServices = {
  allUsers,
  updateUserStatus,
  statistics
};

// src/modules/admin/admin.controller.ts
var allUsers2 = async (req, res, next) => {
  try {
    const data = await AdminServices.allUsers();
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};
var statistics2 = async (req, res, next) => {
  try {
    const data = await AdminServices.statistics();
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};
var updateUserStatus2 = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    const data = await AdminServices.updateUserStatus(id, status);
    res.status(200).json({
      success: true,
      message: "User status update successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};
var AdminController = {
  allUsers: allUsers2,
  updateUserStatus: updateUserStatus2,
  statistics: statistics2
};

// src/modules/admin/admin.route.ts
var router3 = Router3();
router3.get("/users", middleware("ADMIN" /* ADMIN */), AdminController.allUsers);
router3.get(
  "/statistics",
  middleware("ADMIN" /* ADMIN */),
  AdminController.statistics
);
router3.patch(
  "/:id",
  middleware("ADMIN" /* ADMIN */),
  AdminController.updateUserStatus
);
var AdminRoutes = router3;

// src/modules/booking/booking.route.ts
import { Router as Router4 } from "express";

// src/modules/booking/booking.service.ts
var bookings = async (studentId) => {
  const response = await prisma.booking.findMany({
    where: { studentId },
    include: { tutor: true }
  });
  return response;
};
var tutorBookings = async (tutorId) => {
  const response = await prisma.booking.findMany({
    where: { tutor: { userId: tutorId } },
    include: { student: { select: { email: true, name: true } } }
  });
  return response;
};
var adminBooking = async () => {
  const response = await prisma.booking.findMany({
    include: {
      student: { select: { email: true, name: true } }
    }
  });
  return response;
};
var createBooking = async (payload) => {
  const { tutorId, day, slotId, studentId } = payload;
  const tutor = await prisma.tutorProfile.findUnique({
    where: { id: tutorId },
    select: { timeSlots: true, hourlyRate: true }
  });
  if (!tutor) throw new Error("Tutor not found");
  const timeSlots = tutor.timeSlots;
  const dayKey = day.toLowerCase().slice(0, 3);
  const targetSlot = timeSlots[dayKey].find((s) => s.id === slotId);
  if (!targetSlot || targetSlot.isBooked) throw new Error("Slot not available");
  await prisma.$transaction([
    prisma.tutorProfile.update({
      where: { id: tutorId },
      data: {
        timeSlots: {
          ...timeSlots,
          [dayKey]: timeSlots[dayKey].map(
            (s) => s.id === slotId ? { ...s, isBooked: true } : s
          )
        }
      }
    }),
    prisma.booking.create({
      data: {
        studentId,
        tutorId,
        slotId,
        day,
        startTime: targetSlot.start,
        endTime: targetSlot.end,
        amount: tutor.hourlyRate
      }
    })
  ]);
  return { success: true };
};
var bookingDetails = async (id) => {
  const response = await prisma.booking.findUnique({
    where: { id }
  });
  return response;
};
var updateBookingStatus = async (bookingId, userId, newStatus) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { tutor: true }
  });
  if (!booking) throw new Error("Booking not found");
  const shouldReleaseSlot = newStatus === "CANCELLED" || newStatus === "COMPLETED";
  return await prisma.$transaction(async (tx) => {
    const updatedBooking = await tx.booking.update({
      where: { id: bookingId },
      data: { status: newStatus }
    });
    if (shouldReleaseSlot) {
      const timeSlots = booking.tutor.timeSlots;
      const dayKey = booking.day.toLowerCase().slice(0, 3);
      const updatedDaySlots = timeSlots[dayKey].map((slot) => {
        if (slot.id === booking.slotId) {
          return { ...slot, isBooked: false };
        }
        return slot;
      });
      await tx.tutorProfile.update({
        where: { id: booking.tutorId },
        data: {
          timeSlots: {
            ...timeSlots,
            [dayKey]: updatedDaySlots
          }
        }
      });
    }
    return updatedBooking;
  });
};
var attendBooking = async (bookingId, userId, isAttending) => {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      studentId: userId
    }
  });
  if (!booking) {
    throw new Error("Booking not found or unauthorized");
  }
  return await prisma.booking.update({
    where: { id: bookingId },
    data: {
      studentAttend: isAttending
    }
  });
};
var bookingService = {
  bookings,
  createBooking,
  bookingDetails,
  updateBookingStatus,
  tutorBookings,
  adminBooking,
  attendBooking
};

// src/modules/booking/booking.controller.ts
var bookings2 = async (req, res, next) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      return res.status(400).json({ message: "Student id not found" });
    }
    const data = await bookingService.bookings(studentId);
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};
var tutorBooking = async (req, res, next) => {
  try {
    const tutorId = req.user?.id;
    if (!tutorId) {
      return res.status(400).json({ message: "Tutor id not found" });
    }
    const data = await bookingService.tutorBookings(tutorId);
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};
var adminBooking2 = async (req, res, next) => {
  try {
    const data = await bookingService.adminBooking();
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};
var createBooking2 = async (req, res, next) => {
  try {
    if (req.body.studentId !== req.user?.id) {
      return res.status(400).json({ message: "user not match" });
    }
    await bookingService.createBooking(req.body);
    res.status(200).json({
      success: true,
      data: "booking create successfully"
    });
  } catch (error) {
    next(error);
  }
};
var bookingDetails2 = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!req.params.id) {
      return res.status(400).json({ message: "id is required" });
    }
    const data = await bookingService.bookingDetails(id);
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};
var updateBookingStatus2 = async (req, res, next) => {
  const userId = req.user?.id;
  const bookingId = req.params.id;
  const { status: newStatus } = req.body;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!newStatus) {
    return res.status(400).json({ message: "Status is required" });
  }
  try {
    const data = await bookingService.updateBookingStatus(
      bookingId,
      userId,
      newStatus
    );
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error?.message || "something went wrong"
    });
  }
};
var attendBooking2 = async (req, res, next) => {
  const userId = req.user?.id;
  const bookingId = req.params.id;
  const { isAttending } = req.body;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    await bookingService.attendBooking(
      bookingId,
      userId,
      isAttending
    );
    res.status(200).json({
      success: true,
      message: isAttending ? "Student attended" : "Student left the session"
    });
  } catch (error) {
    next(error);
  }
};
var bookingController = {
  bookings: bookings2,
  createBooking: createBooking2,
  bookingDetails: bookingDetails2,
  updateBookingStatus: updateBookingStatus2,
  tutorBooking,
  adminBooking: adminBooking2,
  attendBooking: attendBooking2
};

// src/modules/booking/booking.route.ts
var router4 = Router4();
router4.get(
  "/student",
  middleware("STUDENT" /* STUDENT */),
  bookingController.bookings
);
router4.get(
  "/tutor",
  middleware("TUTOR" /* TUTOR */),
  bookingController.tutorBooking
);
router4.get(
  "/admin",
  middleware("ADMIN" /* ADMIN */),
  bookingController.adminBooking
);
router4.post("/", middleware("STUDENT" /* STUDENT */), bookingController.createBooking);
router4.get("/:id", bookingController.bookingDetails);
router4.put(
  "/:id",
  middleware("STUDENT" /* STUDENT */, "TUTOR" /* TUTOR */),
  bookingController.updateBookingStatus
);
router4.patch(
  "/:id/attend",
  middleware("STUDENT" /* STUDENT */),
  bookingController.attendBooking
);
var BookingRoutes = router4;

// src/modules/reviews/review.route.ts
import { Router as Router5 } from "express";

// src/modules/reviews/reviews.service.ts
var postReviewAndCloseBooking = async (payload) => {
  const { tutorId, studentId, comment, rating, bookingId } = payload;
  await prisma.$transaction(async (tx) => {
    await tx.review.create({
      data: {
        tutorId,
        studentId,
        comment,
        rating
      }
    });
    const booking = await tx.booking.findUnique({
      where: { id: bookingId }
    });
    if (!booking) throw new Error("Booking not found");
    const tutor = await tx.tutorProfile.findUnique({
      where: { id: tutorId }
    });
    if (tutor) {
      const timeSlots = tutor.timeSlots;
      const dayKey = booking.day.toLowerCase().slice(0, 3);
      const updatedDaySlots = timeSlots[dayKey].map((slot) => {
        if (slot.id === booking.slotId) {
          return { ...slot, isBooked: false };
        }
        return slot;
      });
      await tx.tutorProfile.update({
        where: { id: tutorId },
        data: {
          timeSlots: {
            ...timeSlots,
            [dayKey]: updatedDaySlots
          }
        }
      });
    }
    await tx.booking.delete({
      where: { id: bookingId }
    });
    return { success: true, message: "Review posted and booking closed." };
  });
};
var ReviewService = {
  postReviewAndCloseBooking
};

// src/modules/reviews/reviews.controller.ts
var postReviewAndCloseBooking2 = async (req, res, next) => {
  const payload = req.body;
  try {
    await ReviewService.postReviewAndCloseBooking(payload);
    res.status(201).json({
      success: true,
      message: "Review successfully created"
    });
  } catch (error) {
    next(error);
  }
};
var ReviewController = {
  postReviewAndCloseBooking: postReviewAndCloseBooking2
};

// src/modules/reviews/review.route.ts
var router5 = Router5();
router5.post(
  "/",
  middleware("STUDENT" /* STUDENT */),
  ReviewController.postReviewAndCloseBooking
);
var ReviewRouter = router5;

// src/route.ts
var router6 = Router6();
router6.use("/api/tutors", TutorRoute);
router6.use("/api/student", TutorRoute);
router6.use("/api/category", categoryRouter);
router6.use("/api/admin", AdminRoutes);
router6.use("/api/bookings", BookingRoutes);
router6.use("/api/review", ReviewRouter);
var route_default = router6;

// src/middlewares/error.middleware.ts
var errorHandler = (err, req, res, next) => {
  if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        return res.status(409).json({
          success: false,
          message: "Duplicate value. This already exists.",
          fields: err.meta?.target
        });
      case "P2003":
        return res.status(400).json({
          success: false,
          message: "Invalid reference. Related record not found."
        });
      case "P2025":
        return res.status(404).json({
          success: false,
          message: "Record not found."
        });
      default:
        return res.status(400).json({
          success: false,
          message: "Database error.",
          code: err.code
        });
    }
  }
  if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    return res.status(400).json({
      success: false,
      message: "Invalid request data. Please check your input fields."
    });
  }
  if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    return res.status(500).json({
      success: false,
      message: "Database connection failed."
    });
  }
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong!";
  if (err.data?.code === "P2002") {
    return res.status(400).json({ success: false, message: "Category already exists!" });
  }
  return res.status(statusCode).json({
    success: false,
    message
  });
};

// src/app.ts
var app = express();
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      process.env.BETTER_AUTH_URL || "http://localhost:5000"
    ],
    credentials: true
  })
);
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());
app.use(route_default);
app.use(errorHandler);
app.get("/", (req, res) => {
  res.send("hello world dddd");
});
var app_default = app;

// src/index.ts
var index_default = app_default;
export {
  index_default as default
};
