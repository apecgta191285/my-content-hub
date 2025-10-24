// นี่คือ Client Component เพราะต้องมีการ "กรอก" และ "คลิก"
'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase/client'; // ใช้ "ตัวเชื่อมต่อฝั่งเบราว์เซอร์"
import { useRouter } from 'next/navigation';

export default function CreatePostForm() {
  // สร้าง "กล่อง" (State) ไว้เก็บสิ่งที่ผู้ใช้พิมพ์
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // (Optional) สำหรับ URL รูปภาพ
  const [isPublished, setIsPublished] = useState(false); 
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // ฟังก์ชันที่จะทำงานเมื่อกดปุ่ม "Submit"
// ฟังก์ชัน handleSubmit เวอร์ชันอัปเกรด
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true); // <--- 1. "เปิด" Loading (ปุ่มจะถูกปิด)
  setMessage('กำลังบันทึก...');

  try {
    // 2. "ลอง" ทำงาน
    const { error } = await supabase
      .from('posts')
      .insert({ title, content, image_url: imageUrl || null, is_published: isPublished });

    // 3. ถ้า "ล้มเหลว" (เช่น เน็ตตัด)
    if (error) {
      throw error; // "โยน" Error ไปให้ "catch" จัดการ
    }

    // 4. ถ้า "สำเร็จ"
    setMessage('บันทึกบทความสำเร็จ!');
    // เคลียร์ฟอร์ม
    setTitle('');
    setContent('');
    setImageUrl('');
    setIsPublished(false);
    router.refresh(); // รีเฟรชข้อมูล (เหมือนเดิม)

  } catch (error) {
    // 5. "จับ" Error (ถ้า try ล้มเหลว)
    setMessage(`เกิดข้อผิดพลาด: ${error.message}`);

  } finally {
    // 6. "สุดท้าย" (ไม่ว่าจะ สำเร็จ หรือ ล้มเหลว)
    setIsLoading(false); // <--- "ปิด" Loading (ปุ่มจะกลับมากดได้)
  }
};

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl p-6 mt-8 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-800">เขียนบทความใหม่</h2>

      {/* ช่องกรอก Title */}
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          หัวข้อ (Title)
        </label>
        <input
          id="title"
          type="text"
          required
          value={title}
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
          value={content}
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
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* ช่องติ๊กถูก "เผยแพร่" */}
        <div className="mb-4">
        <label className="flex items-center text-sm font-medium text-gray-700">
            <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2">เผยแพร่บทความนี้ (Publish)</span>
        </label>
        </div>

      {/* ปุ่ม Submit */}
      <button
        type="submit"
        disabled={isLoading} // <--- 1. "ปิด" ปุ่ม ถ้า isLoading เป็น true
        className="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                  disabled:bg-gray-400 disabled:cursor-not-allowed" // <--- 2. เพิ่ม Style ตอน "ปิด"
      >
        {/* 3. "เปลี่ยนข้อความ" ตามสถานะ */}
        {isLoading ? 'กำลังบันทึก...' : 'บันทึกบทความ'}
      </button>

      {message && (
        <p className="mt-4 text-center text-sm text-green-500">{message}</p>
      )}
    </form>
  );
}