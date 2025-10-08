## Node.js `http` vs Express

| Feature           | Node.js `http`                | Express |
|---------          |----------------               |---------|
| **Routing**       | ต้องตรวจสอบ `req.url` + regex  | ใช้ `app.get('/path/:param')` ได้เลย 
| **Params / Query**| ต้อง parse เอง                  | `req.params`, `req.query` ใช้งานง่าย 
| **JSON Response** | ต้อง `JSON.stringify()` | ใช้ `res.json()` อัตโนมัติ 
| **Middleware**    | ทำเองทั้งหมด | มีระบบ middleware รองรับ pre/post-processing 
| **404 Handling**  | เขียนเอง | `app.use()` จัดการง่าย   |
| **Code Readability** | ยาว / boilerplate มาก       | กระชับ / แบ่งไฟล์ง่าย 
| **Dependencies**  | ไม่มี                           | ต้องติดตั้ง `express` 

**สรุป:**  
- Node.js `http` → เหมาะสำหรับเรียนรู้พื้นฐาน, แอปเล็ก  
- Express → เหมาะสำหรับโปรเจกต์จริง, ลด boilerplate, มี middleware พร้อมใช้
