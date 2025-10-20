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
  const [message, setMessage] = useState('');

  const router = useRouter();

  // ฟังก์ชันที่จะทำงานเมื่อกดปุ่ม "Submit"
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('กำลังบันทึก...');

    // "ไม้เด็ด" ที่เราวางไว้ใน Phase 1
    // เราแค่ "insert" title, content, image_url
    // ส่วน "user_id" ... Supabase จะใส่ให้เรา "อัตโนมัติ"
    // เพราะเราตั้ง Default Value ของ user_id เป็น auth.uid()
    const { error } = await supabase
      .from('posts') // ไปที่ตาราง 'posts'
      .insert({ title, content, image_url: imageUrl || null }); // "เพิ่ม" ข้อมูลนี้

    if (error) {
      setMessage(`เกิดข้อผิดพลาด: ${error.message}`);
    } else {
      setMessage('บันทึกบทความสำเร็จ!');
      // เคลียร์ฟอร์ม
      setTitle('');
      setContent('');
      setImageUrl('');
      // สั่งให้หน้าเว็บ "รีเฟรช" (เพื่อดึงรายการบทความใหม่)
      router.refresh(); 
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

      {/* ปุ่ม Submit */}
      <button
        type="submit"
        className="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        บันทึกบทความ
      </button>

      {message && (
        <p className="mt-4 text-center text-sm text-green-500">{message}</p>
      )}
    </form>
  );
}