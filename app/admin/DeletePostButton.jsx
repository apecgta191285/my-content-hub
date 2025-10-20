// นี่คือ Client Component เพราะต้องมีการ "คลิก"
'use client';

import { supabase } from '../../lib/supabase/client';
import { useRouter } from 'next/navigation';

// เราจะ "รับ" id ของบทความที่จะลบเข้ามา
export default function DeletePostButton({ postId }) {
  const router = useRouter();

  const handleDelete = async () => {
    // "หน้าต่างยืนยัน" (กันมือกดพลาด)
    if (confirm('คุณแน่ใจนะว่าจะลบบทความนี้? (ลบแล้วกู้คืนไม่ได้)')) {
      // สั่ง Supabase ให้ "ลบ"
      const { error } = await supabase
        .from('posts')
        .delete() // คำสั่ง "ลบ"
        .eq('id', postId); // "เฉพาะ" id นี้

      if (error) {
        alert(`เกิดข้อผิดพลาด: ${error.message}`);
      } else {
        // สั่งให้หน้า Admin รีเฟรชข้อมูล (เพื่อเอาอันที่ลบไปแล้วออก)
        router.refresh();
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
    >
      ลบ
    </button>
  );
}