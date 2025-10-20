import { createSupabaseServerClient } from '../../../../lib/supabase/server';
import { notFound } from 'next/navigation';
import EditPostForm from './EditPostForm'; // เราจะสร้างไฟล์นี้ต่อไป

// นี่คือ Server Component ที่ "รอ" ข้อมูลก่อน
export default async function EditPostPage({ params }) {
  // 1. สร้างตัวเชื่อมต่อ Server
  const supabase = await createSupabaseServerClient();

  // 2. ดึงข้อมูล "ผู้ใช้ที่ล็อกอินอยู่" (เพื่อความปลอดภัย)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound(); // ถ้าแอบเข้า (ไม่น่าเป็นไปได้เพราะมี Middleware)
  }

  // 3. ดึงข้อมูลบทความ "ชิ้นเดียว" ที่จะแก้ไข
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', params.id) // เอาเฉพาะ id ที่ตรงกับ URL
    .eq('user_id', user.id) // "และ" ต้องเป็นของเจ้าของเท่านั้น (กันคนแอบแก้ของคนอื่น)
    .single(); // เอาแค่ 1 แถว

  // 4. ถ้าหาไม่เจอ (เช่น ID ผิด หรือพยายามแก้ของคนอื่น)
  if (error || !post) {
    notFound(); // โยน 404
  }

  // 5. ส่งข้อมูล "post" ที่ดึงได้ ไปให้ฟอร์ม (Client Component)
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">แก้ไขบทความ</h1>
      {/* ส่ง "post" ที่ดึงได้ ไปเป็น prop ให้ฟอร์ม */}
      <EditPostForm postData={post} /> 
    </div>
  );
}