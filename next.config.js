/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    i18n: {
        locales: ['th', 'en'],
        defaultLocale: 'th',
        localeDetection: false, // ❗️ปิดการตรวจจับภาษาอัตโนมัติ
    },
};

module.exports = nextConfig;
