import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

// นี่คือฟังก์ชัน "ยาม" (Middleware) เวอร์ชันอัปเกรดครับ
export async function middleware(request) {
  // 1. สร้าง "Response" (การตอบกลับ) เปล่าๆ ขึ้นมาก่อน
  // เราต้องใช้ "response" นี้เพื่อ "ส่งต่อ" คุกกี้ที่อัปเดตแล้ว
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 2. สร้าง "ตัวเชื่อมต่อ Supabase" เวอร์ชันเซิร์ฟเวอร์
  // ที่ผูกติดกับ "request" (ที่เข้ามา) และ "response" (ที่จะออกไป)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          // นี่คือส่วนที่สำคัญ: เราสั่งให้ "request" และ "response" อัปเดตคุกกี้
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value, ...options });
        },
remove(name, options) {
      // เหมือนกัน: เราสั่งให้ "request" และ "response" ลบคุกกี้
      request.cookies.set({ name, value: '', ...options }); // <--- (บรรทัด 36) แก้ไข
      response = NextResponse.next({
        request: {
          headers: request.headers,
        },
      });
      response.cookies.set({ name, value: '', ...options }); // <--- (บรรทัด 42) แก้ไข
    },
      },
    }
  );

  // 3. ดึงข้อมูล "ผู้ใช้ที่ล็อกอินอยู่" (สำคัญมาก)
  // *** บรรทัดนี้ ไม่ใช่แค่ "อ่าน" แต่ยัง "รีเฟรช" session ที่หมดอายุด้วย ***
  // และเมื่อมัน "รีเฟรช" มันจะเรียกใช้ฟังก์ชัน set/remove ที่เราเพิ่งเขียนไป
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 4. "ตรรกะ" การตัดสินใจของยาม (เหมือนเดิม)
  const requestedPath = request.nextUrl.pathname;

  // ถ้าผู้ใช้ "ยังไม่ได้ล็อกอิน" (ไม่มี session)
  // และกำลังพยายามจะเข้าหน้า "/admin"
  if (!session && requestedPath.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // ถ้าผู้ใช้ "ล็อกอินแล้ว" (มี session)
  // และกำลังพยายามจะเข้าหน้า "/login"
  if (session && requestedPath.startsWith('/login')) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // 5. "ปล่อยผ่าน"
  // แต่ไม่ใช่ปล่อยผ่านธรรมดา ต้อง "ส่งต่อ" response ที่มีคุกกี้ที่อัปเดตแล้วกลับไปด้วย
  return response; 
}

// "ขอบเขต" การทำงานของยาม (เหมือนเดิม)
export const config = {
  matcher: ['/login', '/admin/:path*'],
};