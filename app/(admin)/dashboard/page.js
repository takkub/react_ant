'use client';
import { useTranslation } from 'react-i18next';
import '../../i18n'; // นำเข้า i18n ก่อนใช้งาน useTranslation

export default function DashboardPage() {
    const { t } = useTranslation('common'); // ตรงกับการตั้งค่า namespace ใน i18n.js
    
    return <h1>{t('welcome')}</h1>;
}