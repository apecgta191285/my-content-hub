// นี่คือ Client Component เพราะต้องมีการ "กรอก" และ "คลิก"
'use client';

import { useState } from 'react';
import { supabase } from '../../../../lib/supabase/client';
import { useRouter } from 'next/navigation';

// "รับ" ข้อมูลบทความเก่า (postData) มาจาก Server Component (page.jsx)
export default function EditPostForm({ postData }) {
  const router = useRouter();

  // "เติม" ข้อมูลเก่าลงใน "กล่อง" (State)
  const [title, setTitle] = useState(postData.title);
  const [content, setContent] = useState(postData.content);
  const [imageUrl, setImageUrl] = useState(postData.image_url || '');
  const [isPublished, setIsPublished] = useState(postData.is_published);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

// ฟังก์ชัน handleSubmit เวอร์ชันอัปเกรด (มี try...catch...finally)
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true); // <--- 1. "เปิด" Loading
  setMessage('กำลังอัปเดต...');

  try {
    // 2. "ลอง" ทำงาน (Update)
    const { error } = await supabase
      .from('posts')
      .update({
        title: title,
        content: content,
        image_url: imageUrl || null,
        is_published: isPublished,
      })
      .eq('id', postData.id);

    // 3. ถ้า "ล้มเหลว"
    if (error) {
      throw error; // "โยน" Error ไปให้ "catch"
    }

    // 4. ถ้า "สำเร็จ"
    setMessage('อัปเดตบทความสำเร็จ!');
    // พาผู้ใช้กลับไปหน้า Admin
    router.push('/admin');
    router.refresh();

  } catch (error) {
    // 5. "จับ" Error
    setMessage(`เกิดข้อผิดพลาด: ${error.message}`);
    setIsLoading(false); // <--- หยุด Loading (ถ้า Error)

  } 
  // 6. "finally" (สุดท้าย)
  // โค้ชจงใจไม่ใส่ "finally" ที่นี่ เพราะถ้า "สำเร็จ" (try)
  // เรา "ต้องการ" ให้ปุ่มค้างสถานะ Loading ไว้
  // ในขณะที่ `router.push` กำลังพาเราย้ายหน้าครับ
  // เราจะหยุด Loading เฉพาะตอนที่ "ล้มเหลว" (catch) เท่านั้น
  };

  return (
    // ฟอร์มนี้เหมือน "CreatePostForm" เป๊ะๆ
    <form
      onSubmit={handleSubmit}
      className="w-full p-6 bg-white rounded-lg shadow-md"
    >
      {/* ช่องกรอก Title */}
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          หัวข้อ (Title)
        </label>
        <input
          id="title"
          type="text"
          required
          value={title} // <--- มีค่าเดิมอยู่
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* ช่องกรอก Content */}
      <div className="mb-4">
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          เนื้อหา (Content)
        </label>
        <textarea
          id="content"
          required
          rows="6"
          value={content} // <--- มีค่าเดิมอยู่
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* ช่องกรอก Image URL */}
      <div className="mb-4">
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
          ลิงก์รูปภาพประกอบ (Image URL)
        </label>
        <input
          id="imageUrl"
          type="text"
          value={imageUrl} // <--- มีค่าเดิมอยู่
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* ช่องติ๊กถูก "เผยแพร่" */}
      <div className="mb-4">
        <label className="flex items-center text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            checked={isPublished} // <--- มีค่าเดิมอยู่
            onChange={(e) => setIsPublished(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="ml-2">เผยแพร่บทความนี้ (Publish)</span>
        </label>
      </div>

      {/* ปุ่ม Submit*/}
      <button
        type="submit"
        disabled={isLoading} // <--- 1. "ปิด" ปุ่ม ถ้า isLoading เป็น true
        className="w-full px-4 py-2 font-medium text-white bg-green-600 rounded-md hover:bg-green-700
                  disabled:bg-gray-400 disabled:cursor-not-allowed" // <--- 2. เพิ่ม Style ตอน "ปิด"
      >
        {/* 3. "เปลี่ยนข้อความ" ตามสถานะ */}
        {isLoading ? 'กำลังอัปเดต...' : 'บันทึกการเปลี่ยนแปลง'}
      </button>

      {message && (
        <p className="mt-4 text-center text-sm text-green-500">{message}</p>
      )}
    </form>
  );
}