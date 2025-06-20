import React, { useEffect, useState } from "react";
import { Dropdown, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { useRouter } from 'next/navigation';
import Image from "next/image";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState("en");

  const languages = [
    { key: "en", label: "English", icon: "/flags/en.png" },
    { key: "th", label: "ไทย", icon: "/flags/th.png" },
  ];

  useEffect(() => {
    const savedLang = localStorage.getItem("preferredLanguage");
    const initialLang = savedLang || i18n.language || "en";
    setCurrentLanguage(initialLang);
    i18n.changeLanguage(initialLang);
  }, [i18n]);

  const handleMenuClick = ({ key }) => {
    setCurrentLanguage(key);
    i18n.changeLanguage(key);
    localStorage.setItem("preferredLanguage", key);

    if (typeof window !== "undefined" && router) {
      router.push(window.location.pathname);
    }
  };

  const menuItems = languages.map(lang => ({
    key: lang.key,
    label: (
      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Image src={lang.icon} alt={lang.label} width={26} height={26} />
        {lang.label}
      </span>
    )
  }));

  const currentLangData = languages.find(lang => lang.key === currentLanguage);

  return (
    <Dropdown
      menu={{ items: menuItems, onClick: handleMenuClick, selectedKeys: [currentLanguage] }}
      trigger={["hover"]}
    >
      <span style={{ cursor: "pointer", display: "inline-block" }}>
        <Image
          src={currentLangData?.icon || "/flags/en.png"}
          alt={currentLangData?.label || "Language"}
          width={26}
          height={26}
        />
      </span>
    </Dropdown>
  );
};

export default LanguageSwitcher;
