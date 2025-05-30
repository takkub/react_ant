import {Button, Layout, Space, Typography} from "antd";
import {DashboardOutlined, MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";
import ProfileDropdown from "./ProfileDropdown";
import LanguageSwitcher from "./LanguageSwitcher";
import {useTranslation} from "react-i18next";
import { useTitle } from "./TitleContext";
const {Title} = Typography;
const { Header } = Layout;

export default function HeaderComponent({ collapsed, setCollapsed }) {
    const {t} = useTranslation();
    const { title } = useTitle();
    const colorText = "white"
    
    return (
        <Header 
            style={{
                padding: "0 24px",
                // background: '#f0f2f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
            }}
        >
            <div className="header-left">
                <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={() => setCollapsed(!collapsed)}
                    style={{color: colorText}}
                />
            </div>
            <div className="header-left">
                <Typography >
                    <Title style={{color: colorText}} level={3} className={'mb-5'}>{title.icon} {t(title.title)}</Title>
                </Typography>
            </div>
            <Space className="header-right" size={16}>
                <LanguageSwitcher />
                <ProfileDropdown />
            </Space>
        </Header>
    );
}