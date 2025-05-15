'use client';
import { useTranslation } from 'react-i18next';

export default function DashboardPage() {
    const { t } = useTranslation('common');
    
    return <h1>{t('welcome')}</h1>;
}