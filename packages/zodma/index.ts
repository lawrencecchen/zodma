import z, { type ZodRawShape } from "zod";

declare module "zod" {
  interface ZodString {
    primaryKey(): ZodString;
    unique(): ZodString;
    generated(): ZodString;
  }

  interface ZodOptional<T> {
    unique(): ZodString;
  }
}

type IndexTypes = "Brin" | "BTree" | "Gin" | "Gist" | "Hash" | "SpGist";
type ConstraintFields<T> = Array<keyof T>;
type ConstraintAdditionalOptions = {
  map?: string;
  type?: IndexTypes;
};
type ConstraintFullOptions<T> = {
  fields: ConstraintFields<T>;
} & ConstraintAdditionalOptions;

class ConstraintBuilder<T> {
  constructor() { }

  index(
    fields: ConstraintFields<T>,
    opts?: ConstraintAdditionalOptions
  ): ConstraintBuilder<T>;
  index(opts: ConstraintFullOptions<T>): ConstraintBuilder<T>;
  index(
    arg1: ConstraintFields<T> | ConstraintFullOptions<T>,
    arg2?: ConstraintAdditionalOptions
  ) {
    if ("fields" in arg1) {
    }
    return new ConstraintBuilder<T>();
  }

  unique(
    fields: ConstraintFields<T>,
    opts?: ConstraintAdditionalOptions
  ): ConstraintBuilder<T>;
  unique(opts: ConstraintFullOptions<T>): ConstraintBuilder<T>;
  unique(
    arg1: ConstraintFields<T> | ConstraintFullOptions<T>,
    arg2?: ConstraintAdditionalOptions
  ) {
    return new ConstraintBuilder<T>();
  }
}

class TableBuilder {
  constructor() { }

  columns<T extends ZodRawShape>(columns: T) {
    const zodObject = z.object(columns);

    return new ConstraintBuilder<z.infer<typeof zodObject>>();
  }
}

class ZodmaBuilder {
  constructor() { }

  config(opts: { databaseUrl: string }) {
    return {
      schema<T>(definition: T) { },
    };
  }
}

export const table = new TableBuilder();
export const zodma = new ZodmaBuilder();

zodma
  .config({
    databaseUrl: "postgres://localhost:5432",
  })
  .schema({
    account: table
      .columns({
        id: z.string().uuid().primaryKey(),
        userId: z.string().unique(),
        type: z.string(),
        provider: z.string(),
        providerAccountId: z.string(),
        refresh_token: z.string().optional(),
        access_token: z.string().optional(),
        expires_at: z.number().optional(),
        token_type: z.string().optional(),
        scope: z.string().optional(),
        id_token: z.string().optional(),
        session_state: z.string().optional(),
      })
      .unique(["provider", "providerAccountId"]),
    session: table.columns({
      id: z.string().uuid().primaryKey(),
      sessionToken: z.string().unique(),
      userId: z.string(),
      expires: z.string(),
    }),
    user: table.columns({
      id: z.string().uuid().primaryKey(),
      name: z.string(),
      email: z.string().optional().unique(),
      emailVerified: z.date().optional(),
      image: z.string().optional(),
    }),
    verificationToken: table
      .columns({
        identifier: z.string(),
        token: z.string().unique(),
        expires: z.date(),
      })
      .unique(["identifier", "token"]),
  });

