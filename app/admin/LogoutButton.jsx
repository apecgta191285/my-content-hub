// นี่คือ Client Component เพราะต้องมีการ "คลิก"
'use client'; 

import { useState } from 'react';
import { supabase } from '../../lib/supabase/client';
import { useRouter } from 'next/navigation'; // ใช้สำหรับ "ผลัก" ผู้ใช้ไปหน้าอื่น

export default function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
  setIsLoading(true); // <--- 1. "เปิด" Loading

  // (Logout มักจะไม่ Error เราเลยไม่ต้องใช้ try...catch ก็ได้)
  await supabase.auth.signOut();

  // (เราไม่ต้องปิด Loading เพราะหน้านี้กำลังจะถูกทำลายทิ้งอยู่แล้ว)
  router.push('/login');
};

  return (
    <button
  onClick={handleLogout}
  disabled={isLoading} // <--- 1. "ปิด" ปุ่ม
  className="px-4 py-2 font-medium text-white bg-red-600 rounded-md hover:bg-red-700
             disabled:bg-gray-400 disabled:cursor-not-allowed" // <--- 2. เพิ่ม Style ตอน "ปิด"
>
  {/* 3. "เปลี่ยนข้อความ" */}
  {isLoading ? 'กำลังออกจากระบบ...' : 'ออกจากระบบ'}
    </button>
  );
}