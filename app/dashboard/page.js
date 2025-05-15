'use client';

import {Button, Layout, Menu, theme} from 'antd';
import {
    DashboardOutlined,
    UserOutlined,
    SettingOutlined,
    LogoutOutlined, MenuUnfoldOutlined, MenuFoldOutlined
} from '@ant-design/icons';
import {useState} from 'react';
import {useSession, signOut} from 'next-auth/react';
import {useRouter} from 'next/navigation';
const {Header, Sider, Content} = Layout;

export default function DashboardPage() {
    const [collapsed, setCollapsed] = useState(false);
    const {data: session, status} = useSession();
    const router = useRouter();
    
    const {
        token: {colorBgContainer, borderRadiusLG}
    } = theme.useToken();
    
    if (status === 'unauthenticated') {
        router.push('/login');
        return null;
    }
    
    if (status === 'loading') {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                Loading...
            </div>
        );
    }
    
    const handleSignOut = async () => {
        await signOut({redirect: false});
        router.push('/login');
    };
    
    return (
        <Layout style={{minHeight: '100vh'}}>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
            >
                <div style={{
                    height: 32,
                    margin: 16,
                    background: 'rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                }}>
                    {session?.user?.username || 'ADMIN'}
                </div>
                <Menu
                    theme="dark"
                    defaultSelectedKeys={['1']}
                    mode="inline"
                    items={[
                        {
                            key: '1',
                            icon: <DashboardOutlined/>,
                            label: 'Dashboard'
                        },
                        {
                            key: '2',
                            icon: <UserOutlined/>,
                            label: 'Users'
                        },
                        {
                            key: '3',
                            icon: <SettingOutlined/>,
                            label: 'Settings'
                        },
                        {
                            key: '4',
                            icon: <LogoutOutlined/>,
                            label: 'Logout',
                            onClick: handleSignOut
                        }
                    ]}
                />
            </Sider>
            <Layout>
                <Header style={{padding: 0, background: colorBgContainer}}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}/>
                </Header>
                <Content style={{margin: '16px'}}>
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG
                        }}
                    >
                        Welcome {session?.user?.username}!
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
}