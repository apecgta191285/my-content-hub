// นี่คือ Client Component เพราะต้องมีการ "คลิก"
'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase/client';
import { useRouter } from 'next/navigation';

// เราจะ "รับ" id ของบทความที่จะลบเข้ามา
export default function DeletePostButton({ postId }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

const handleDelete = async () => {
  // 1. "ยืนยัน" ก่อน (ถ้ากดยกเลิก ก็จบเลย)
  if (!confirm('คุณแน่ใจนะว่าจะลบบทความนี้? (ลบแล้วกู้คืนไม่ได้)')) {
    return; // ออกจากฟังก์ชัน
  }

  setIsLoading(true); // <--- 2. "เปิด" Loading (หลังจากกดยืนยันแล้ว)

  try {
    // 3. "ลอง" ลบ
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (error) {
      throw error; // "โยน" Error
    }

    // 4. ถ้า "สำเร็จ"
    router.refresh(); // รีเฟรชข้อมูล (เหมือนเดิม)

  } catch (error) {
    // 5. "จับ" Error
    alert(`เกิดข้อผิดพลาด: ${error.message}`);
  } finally {
    // 6. "สุดท้าย" (ไม่ว่าจะ สำเร็จ หรือ ล้มเหลว)
    setIsLoading(false); // <--- "ปิด" Loading
  }
};

  return (
<button
  onClick={handleDelete}
  disabled={isLoading} // <--- 1. "ปิด" ปุ่ม
  className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700
             disabled:bg-gray-400 disabled:cursor-not-allowed" // <--- 2. เพิ่ม Style ตอน "ปิด"
>
  {/* 3. "เปลี่ยนข้อความ" */}
  {isLoading ? 'กำลังลบ...' : 'ลบ'}
</button>
  );
}