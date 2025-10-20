// บรรทัดนี้บอกว่าไฟล์นี้สำหรับ "ฝั่งเบราว์เซอร์" เท่านั้น
'use client'; 

import { createBrowserClient } from '@supabase/ssr';

// สร้างตัวเชื่อมต่อ Supabase สำหรับ "เบราว์เซอร์"
// มันจะอ่านกุญแจลับจาก .env.local ให้อัตโนมัติ
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);