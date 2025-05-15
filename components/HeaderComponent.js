import { Button, Layout, Space } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import ProfileDropdown from "./ProfileDropdown";
import LanguageSwitcher from "./LanguageSwitcher";

const { Header } = Layout;

export default function HeaderComponent({ collapsed, setCollapsed }) {
    return (
        <Header 
            style={{
                padding: "0 24px", 
                background: '#f0f2f5', 
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
                    style={{
                        fontSize: '16px',
                        width: 48,
                        height: 48,
                        color: '#1890ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                />
            </div>
            
            <Space className="header-right" size={16}>
                <LanguageSwitcher />
                <ProfileDropdown />
            </Space>
        </Header>
    );
}