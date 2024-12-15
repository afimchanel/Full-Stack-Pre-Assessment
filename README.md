# Back-end Questions
1.
    ``` 1.)ใช้ Async/Await หรือ Promise ในการดึงข้อมูลจาก microservices ทั้งสามนั้นจะช่วยให้ระบบ, 

    ``` 2.)ใช้ Kafka หรือ RabbitMQ เพื่อส่ง event ระหว่าง microservices ในการแจ้งเตือนการอัปเดตข้อมูล 
    ``` 3.)ใช้ API Gateway เช่น AWS API Gateway, Kong, หรือ NGINX
2.
    1. เข้าใจความต้องการทางธุรกิจ (Business Requirements)
        เป้าหมาย: เข้าใจว่าระบบต้องรองรับจำนวนผู้ใช้งานและปริมาณคำขอ (requests) ในระดับไหน เช่น รองรับผู้ใช้พร้อมกัน 1,000 คน, ตอบสนองภายใน 2 วินาที เป็นต้น
    2. เลือกประเภทการทดสอบประสิทธิภาพ
        Load Testing: ทดสอบการรับภาระจากผู้ใช้ที่คาดหวัง
        Stress Testing: ทดสอบระบบเมื่อมีการโหลดเกินขีดจำกัด
        Soak Testing: ทดสอบการทำงานในระยะยาว
        Spike Testing: ทดสอบการเพิ่มจำนวนผู้ใช้กระทันหัน
    3. วางแผนการทดสอบ Frontend (React) และ Backend (NestJS)
        Frontend (React): ทดสอบเวลาโหลดหน้า, ความเร็วในการ render UI และการเชื่อมต่อกับ API
        Backend (NestJS): ทดสอบการตอบสนองของ API, การจัดการฐานข้อมูล, 
    4. กำหนดเป้าหมายประสิทธิภาพ (Performance Goals)
        Response Time: ตอบสนองภายใน 300ms
        Throughput: รองรับคำขอได้ 5000 RPS
        Scalability: รองรับผู้ใช้ได้ 10,000 คนพร้อมกัน
    5. เครื่องมือที่ใช้ในการทดสอบ
        Frontend: Google Lighthouse, Web Vitals
        Backend:  Artillery
    6. เตรียมสภาพแวดล้อมการทดสอบ
        ทดสอบในสภาพแวดล้อมที่ใกล้เคียงกับ production
        ใช้ CI/CD เพื่อทดสอบอัตโนมัติทุกครั้งที่มีการ deploy
    7. ติดตามผลและปรับปรุง
        ใช้เครื่องมือเช่น Prometheus และ Grafana ในการติดตามผลการทดสอบ
        วิเคราะห์ผลเพื่อหาจุดที่ต้องปรับปรุง เช่น การใช้ caching, การขยายระบบ
    8. ทดสอบในสภาพแวดล้อมจริง
        ทำ canary release หรือ blue-green deployment เพื่อลดความเสี่ยงในการเปิดตัว


3. cd multilingual-product-api
``` npm install 
``` create file .env
``` npm run start:dev
``` npm run test

# React Questions 
1.  useCallback ใช้เพื่อ "จดจำ" ฟังก์ชันที่สร้างขึ้นในคอมโพเนนต์ เพื่อไม่ให้ฟังก์ชันนั้นถูกสร้างใหม่ทุกครั้งที่คอมโพเนนต์ re-render, โดยการใช้ dependency ที่กำหนดไว้ให้มันสร้างใหม่เฉพาะเมื่อ dependency เปลี่ยนแปลง.
2. cd my-app