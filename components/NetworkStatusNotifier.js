'use client';

import { useEffect, useState } from 'react';
import { notification } from 'antd';

export default function NetworkStatusNotifier() {
    const [isOnline, setIsOnline] = useState(true);
    
    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            notification.success({
                message: 'เชื่อมต่ออินเทอร์เน็ตแล้ว',
                description: 'ขณะนี้คุณกลับมาออนไลน์',
            });
        };
        
        const handleOffline = () => {
            setIsOnline(false);
            notification.error({
                message: 'อินเทอร์เน็ตหลุด',
                description: 'ตรวจสอบการเชื่อมต่อของคุณ',
                duration: 0, // ค้างไว้จนกว่าจะปิด
            });
        };
        
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        
        // เช็กสถานะตอน mount
        if (!navigator.onLine) {
            handleOffline();
        }
        
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);
    
    return null; // component นี้ไม่ต้อง render อะไร
}
