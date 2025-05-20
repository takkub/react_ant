import React, { useState, useEffect } from "react";
import { Select, Tooltip } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import { useRouter } from 'next/navigation';
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();
    const { i18n } = useTranslation();
    const [currentLanguage, setCurrentLanguage] = useState("en");

    // Language options
    const languages = [
        { value: "en", label: "English" },
        { value: "th", label: "ไทย" },
    ];

    useEffect(() => {
        // Mark component as mounted
        setIsMounted(true);
        
        // Initialize with current language from i18n
        if (i18n.language) {
            setCurrentLanguage(i18n.language);
        }
    }, [i18n.language]);

    const handleLanguageChange = (value) => {
        if (!isMounted) return;
        
        setCurrentLanguage(value);
        
        // Change language in i18n
        i18n.changeLanguage(value);
        
        // Only use router when component is mounted (client-side)
        if (typeof window !== "undefined" && router) {
            try {
                // In Next.js 13 app router, we don't have pathname, query, or asPath
                // We can use simple push with locale parameter
                const currentPath = window.location.pathname;
                // Using the new router.push format for Next.js App Router
                router.push(currentPath);
                
                // Store language preference in localStorage for persistence
                localStorage.setItem('preferredLanguage', value);
            } catch (error) {
                console.error("Error changing language:", error);
            }
        }
    };

    // If not mounted yet (server-side), render a simpler version
    if (!isMounted) {
        return (
            <Tooltip title="Change Language">
                <Select
                    value={currentLanguage}
                    options={languages}
                    variant={'outlined'}
                    style={{ width: 100 }}
                    suffixIcon={<GlobalOutlined style={{ color: "black" }} />}
                    dropdownStyle={{ minWidth: 120 }}
                    disabled
                />
            </Tooltip>
        );
    }

    return (
        <Tooltip title="Change Language">
            <Select
                value={currentLanguage}
                onChange={handleLanguageChange}
                options={languages}
                variant={'outlined'}
                style={{ width: 100 }}
                suffixIcon={<GlobalOutlined style={{ color: "black" }} />}
                dropdownStyle={{ minWidth: 120 }}
            />
        </Tooltip>
    );
}
