// types/next-auth.d.ts

/**
 * EXTENDS NEXT-AUTH TYPES
 * 
 * Problem: NextAuth's default User type only includes basic fields (name, email, image)
 * Our app needs custom fields like 'plan', 'businessName' for billing & invoicing
 * 
 * This file tells TypeScript about our custom user properties
 * Without this, you get TypeScript errors when accessing session.user.plan
 */

import NextAuth from "next-auth"

// Augment NextAuth's built-in types
declare module "next-auth" {
  
  /**
   * ADD CUSTOM FIELDS TO USER OBJECT
   * These are the extra properties stored in our database
   */
  interface User {
    id: string           // User ID from database
    email: string        // User's email
    name?: string | null // Optional display name
    plan: string         // REQUIRED: 'free' | 'starter' | 'growth' | 'premium'
    businessName?: string // Optional: For invoice branding
    businessEmail?: string // Optional: Business contact email
  }

  /**
   * EXTEND SESSION OBJECT  
   * Session includes the enhanced User type above
   */
  interface Session {
    user: User  // Now session.user has all our custom fields
  }
}

/**
 * RESULT: No more TypeScript errors when you write:
 * 
 * const userPlan = session.user.plan
 * const business = session.user.businessName
 * 
 * TypeScript now knows these properties exist
 */