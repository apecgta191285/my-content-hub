// นี่คือ Server Component (default)
import LogoutButton from './LogoutButton'; // Import ปุ่มที่เราเพิ่งสร้าง

// หน้านี้จะทำงาน "บนเซิร์ฟเวอร์"
// "ยาม" (Middleware) ของเราจะทำงาน "ก่อน" หน้านี้เสมอ
// ดังนั้น เราการันตีได้เลยว่า "ถ้ามาถึงหน้านี้ได้ คือล็อกอินแล้วแน่นอน"
export default function AdminDashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-10 bg-white rounded-lg shadow-xl text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          ยินดีต้อนรับสู่ Dashboard!
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          คุณล็อกอินสำเร็จแล้ว นี่คือห้องทำงานของแอดมิน
        </p>

        {/* เอาปุ่ม Logout (Client Component) มาแปะ */}
        <LogoutButton /> 
      </div>
    </div>
  );
}