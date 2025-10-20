// บรรทัดนี้บอก Next.js ว่าหน้านี้ต้องทำงานฝั่ง Client (เบราว์เซอร์)
// เพราะเราต้องรอให้ผู้ใช้กรอกข้อมูล
'use client'; 

import React, { useState } from 'react';
// Import "ตัวกลาง" Supabase ที่เราเพิ่งสร้าง
import { supabase } from '../../lib/supabase/client'; 

export default function Login() {
  // สร้าง "กล่อง" (State) ไว้เก็บสิ่งที่ผู้ใช้พิมพ์
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // กล่องเก็บข้อความแจ้งเตือน

  // ฟังก์ชันที่จะทำงานเมื่อกดปุ่ม "Login"
  const handleLogin = async (e) => {
    e.preventDefault(); // หยุดไม่ให้ฟอร์มรีเฟรชหน้า
    setMessage('กำลังเข้าระบบ...');

    // นี่คือ "ไม้เด็ด" ของ Supabase ครับ
    // สั่งให้ Supabase เข้าระบบด้วยอีเมลและรหัสผ่าน
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('เข้าสู่ระบบสำเร็จ! กำลังพาไปหน้า Dashboard...');
      // ถ้าสำเร็จ ให้พาไปหน้า /admin (ที่เรากำลังจะสร้าง)
      window.location.href = '/admin';
    }
  };

  // นี่คือหน้าตาของเว็บ (HTML + Tailwind CSS)
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          เข้าสู่ระบบ (Admin)
        </h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              อีเมล
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              รหัสผ่าน
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            เข้าสู่ระบบ
          </button>
          {message && (
            <p className="text-center text-sm text-red-500">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
}