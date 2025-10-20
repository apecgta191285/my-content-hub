import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers'; // Import 'cookies' จาก 'next/headers'

// สร้างตัวเชื่อมต่อ Supabase สำหรับ "Server Components"
// มันจะอ่าน Cookie ที่ถูกส่งมาใน "request"
export const createSupabaseServerClient = async () => { // <--- 1. เพิ่ม async
  const cookieStore = await cookies(); // <--- 2. เพิ่ม await
  // ... (ที่เหลือเหมือนเดิม)

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        // สร้างฟังก์ชัน "get" เพื่อให้ Supabase "อ่าน" คุกกี้จาก "โหล" ได้
        get(name) {
          return cookieStore.get(name)?.value;
        },
        // (เราไม่ต้องใช้ set/remove ใน Server Component เพราะเราจะ "อ่าน" อย่างเดียว)
      },
    }
  );
};