import { pgTable, unique, varchar, timestamp, foreignKey, text, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const users = pgTable("users", {
	id: varchar().primaryKey().notNull(),
	email: varchar().notNull(),
	name: varchar(),
	avatar: varchar(),
	googleId: varchar("google_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("users_email_unique").on(table.email),
	unique("users_google_id_unique").on(table.googleId),
]);

export const notes = pgTable("notes", {
	id: varchar().primaryKey().notNull(),
	userId: varchar("user_id").notNull(),
	content: text(),
	isTorn: boolean("is_torn").default(false),
	isTrashed: boolean("is_trashed").default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "notes_user_id_users_id_fk"
		}),
]);
