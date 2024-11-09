import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'asdf';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('authToken')?.value || req.headers.get('Authorization')?.replace('Bearer ', ''); 
  if (token) {
    try {
      jwt.verify(token, JWT_SECRET);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }
  return NextResponse.redirect(new URL('/login', req.url));
}

export const config = {
  matcher: ['/protected/*'], 
};
