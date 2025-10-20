import { createSupabaseServerClient } from '../../lib/supabase/server';
import Link from 'next/link'; // Import ตัวช่วยทำ Link ของ Next.js

// หน้านี้ "ทุกคน" เข้าได้ ไม่ต้องล็อกอิน
export default async function BlogIndex() {
  // 1. สร้างตัวเชื่อมต่อ (เราจะใช้ "ยาม" RLS ที่เราเพิ่งสร้าง)
  const supabase = await createSupabaseServerClient();

  // 2. ดึงข้อมูล
  // "ยาม" RLS จะกรองให้เราอัตโนมัติ
  // มันจะคืนค่ามา "เฉพาะ" อันที่ is_published = true
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return <p className="text-red-500">{error.message}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">
        Our Blog
      </h1>
      <div className="space-y-6">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            // สร้าง "Link" พาไปหน้าอ่านบทความเดี่ยว
            <Link
              href={`/blog/${post.id}`} // <--- ลิงก์ไปยังหน้า [id]
              key={post.id}
              className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-2xl font-semibold text-blue-600 hover:underline">
                {post.title}
              </h2>
              <p className="text-gray-600 mt-2 truncate">{post.content}</p>
              <p className="text-xs text-gray-400 mt-4">
                {new Date(post.created_at).toLocaleString()}
              </p>
            </Link>
          ))
        ) : (
          <p className="text-gray-500">ยังไม่มีบทความที่เผยแพร่</p>
        )}
      </div>
    </div>
  );
}