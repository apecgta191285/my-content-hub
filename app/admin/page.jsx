import LogoutButton from './LogoutButton';
import CreatePostForm from './CreatePostForm'; // Import ฟอร์มที่เราเพิ่งสร้าง
import { createSupabaseServerClient } from '../../lib/supabase/server'; // Import "ตัวเชื่อมต่อ Server"

// "ไม้เด็ด": เปลี่ยนฟังก์ชันนี้ให้เป็น "async"
// เพื่อให้มัน "รอ" (await) ข้อมูลจากฐานข้อมูลก่อน
export default async function AdminDashboard() {
  // 1. สร้างตัวเชื่อมต่อ Supabase ฝั่ง Server
  const supabase = await createSupabaseServerClient(); // <--- 1. เพิ่ม await


  // 2. ดึงข้อมูล "ผู้ใช้ที่ล็อกอินอยู่" (จำเป็น!)
  // เพื่อที่เราจะรู้ว่าต้องดึงบทความของ "ใคร"
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 3. ดึงข้อมูล "บทความ" (posts)
  // โดย "กรอง (filter)" เอาเฉพาะบทความที่ user_id
  // ตรงกับ ID ของผู้ใช้ที่ล็อกอินอยู่
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*') // เอามาทุกคอลัมน์
    .eq('user_id', user.id) // "eq" = "เท่ากับ" (เอาเฉพาะที่ user_id ตรงกัน)
    .order('created_at', { ascending: false }); // "order" = "จัดเรียง" (เอาอันใหม่สุดขึ้นก่อน)

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 py-10">
      <div className="w-full max-w-4xl p-6">

        {/* ส่วนหัว Dashboard */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-lg text-gray-600">
              ยินดีต้อนรับ, {user.email}
            </p>
          </div>
          <LogoutButton />
        </div>

        {/* ฟอร์มสำหรับเขียนบทความ (Client Component) */}
        <CreatePostForm />

        {/* ส่วนแสดง "รายการบทความ" (Server Component) */}
        <div className="w-full max-w-2xl mx-auto mt-10">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            บทความของคุณ
          </h2>
          <div className="space-y-4">
            {error && <p className="text-red-500">{error.message}</p>}

            {posts && posts.length > 0 ? (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="p-4 bg-white rounded-lg shadow-md"
                >
                  <h3 className="text-xl font-semibold text-gray-900">{post.title}</h3>
                  <p className="text-gray-600 mt-2 truncate">{post.content}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {/* แปลงเวลาให้สวยงาม */}
                    {new Date(post.created_at).toLocaleString()} 
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">คุณยังไม่มีบทความ</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}