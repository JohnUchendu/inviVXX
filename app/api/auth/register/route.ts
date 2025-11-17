// app/api/auth/register/route.ts
import db  from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { email, password } = await req.json()
  const hashed = await bcrypt.hash(password, 10)

  try {
    await db.user.create({
      data: { email, password: hashed, plan: 'free' },
    })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'User exists' }, { status: 400 })
  }
}
