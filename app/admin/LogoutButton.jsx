// นี่คือ Client Component เพราะต้องมีการ "คลิก"
'use client'; 

import { supabase } from '../../lib/supabase/client';
import { useRouter } from 'next/navigation'; // ใช้สำหรับ "ผลัก" ผู้ใช้ไปหน้าอื่น

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    // สั่ง Supabase ให้ออกจากระบบ
    await supabase.auth.signOut();
    // ผลักผู้ใช้กลับไปหน้า Login
    router.push('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
    >
      ออกจากระบบ
    </button>
  );
}