import {Layout, Menu} from "antd";
import {DashboardOutlined, LogoutOutlined, SettingOutlined, UserOutlined} from "@ant-design/icons";
import {useSession, signOut} from 'next-auth/react';
import {useRouter} from "next/navigation";

const {Sider} = Layout;
export default function SidebarComponent({collapsed, setCollapsed}) {
    const {data: session, status} = useSession();
    const router = useRouter();
    const handleSignOut = async () => {
        await signOut({redirect: false});
        router.push('/login');
    };
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
    
    const items = [
        {
            key: '1',
            icon: <DashboardOutlined/>,
            label: 'Dashboard',
            onClick: () => router.push('/dashboard')
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
    ]
    
    return (
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
                
                <div onClick={() => router.push('/')}>
                    {session?.user?.username || 'ADMIN'}
                </div>
            </div>
            <Menu
                defaultSelectedKeys={['1']}
                mode="inline"
                items={items}
            />
        </Sider>
    )
}
