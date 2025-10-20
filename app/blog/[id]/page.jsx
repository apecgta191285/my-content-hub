import { createSupabaseServerClient } from '../../../lib/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation'; // Import ตัวช่วยสำหรับ 404

// "ไม้เด็ด" ของ Dynamic Route:
// เราจะได้รับ "params" (พารามิเตอร์) จาก URL โดยอัตโนมัติ
// ถ้า URL คือ /blog/123 ... params จะคือ { id: '123' }
export default async function BlogPost({ params }) {
  // 1. สร้างตัวเชื่อมต่อ Server
  const supabase = await createSupabaseServerClient();

  // 2. ดึงข้อมูลบทความ "แค่ชิ้นเดียว"
  const { data: post, error } = await supabase
    .from('posts')
    .select('*') // เอามาทุกคอลัมน์
    .eq('id', params.id) // "eq" = "เท่ากับ" (เอาเฉพาะ id ที่ตรงกับ params.id)
    .single(); // "single" = "เอามาแค่ 1 แถว" (ถ้าไม่เจอ หรือเจอมากกว่า 1 ให้ Error)

  // 3. จัดการ Error (สำคัญมาก)
  // "ยาม" (RLS) ของเราจะทำงานตรงนี้
  // ถ้ามีคนพยายาม "เดาสุ่ม" ID ของบทความที่ "ยังไม่เผยแพร่" (is_published = false)
  // RLS จะ "ไม่อนุญาต" (Forbidden) และ Supabase จะส่ง "error" กลับมา
  // หรือ .single() จะส่ง "error" ถ้าหา ID นั้นไม่เจอ
  if (error || !post) {
    notFound(); // สั่งให้ Next.js โชว์หน้า 404 Not Found ที่สวยงาม
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      {/* ปุ่ม "กลับไปหน้า Blog" */}
      <Link
        href="/blog"
        className="text-blue-600 hover:underline mb-6 inline-block"
      >
        &larr; กลับไปหน้า Blog
      </Link>

      {/* รูปภาพประกอบ (ถ้ามี) */}
      {post.image_url && (
        <img
          src={post.image_url}
          alt={post.title}
          className="w-full h-auto max-h-96 object-cover rounded-lg mb-6 shadow-lg"
        />
      )}

      {/* หัวข้อ */}
      <h1 className="text-4xl font-bold mb-4 text-gray-900">
        {post.title}
      </h1>

      {/* วันที่เผยแพร่ */}
      <p className="text-sm text-gray-500 mb-6">
        เผยแพร่เมื่อ: {new Date(post.created_at).toLocaleString()}
      </p>

      {/* เนื้อหา (สำคัญ!) */}
      <div
        className="prose prose-lg max-w-none text-gray-800"
        // "prose" คือคลาสจาก Tailwind ที่ช่วยจัดหน้าบทความให้อ่านง่าย
        // "dangerouslySetInnerHTML" คือวิธีที่ React ใช้แสดงผล HTML ที่มาจากฐานข้อมูล
        // (เราต้องใช้ เพราะ "content" อาจมี <p> หรือ <b>... แต่ต้องระวังถ้าข้อมูลไม่ปลอดภัย)
        // (แต่ในที่นี้ เราเชื่อถือ "content" ที่มาจาก "ตัวเราเอง" ในฐานะ Admin)
        dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
      />
    </div>
  );
}