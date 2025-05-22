import { betterAuth } from "better-auth"
import { db } from '@/drizzle/db'
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { schema } from "@/drizzle/schema"
export const auth = betterAuth({
    database: drizzleAdapter(db, { provider: 'pg', schema })
})