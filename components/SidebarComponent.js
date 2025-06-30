import { Layout, Menu } from 'antd';
import {
  CaretRightOutlined,
  DashboardOutlined,
  InfoCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

const { Sider } = Layout;

export default function SidebarComponent({ collapsed, setCollapsed }) {
  const { t } = useTranslation();
  const { data: session, status } = useSession();
  const [logoDetail, setLogoDetail] = useState({
    path: '/assets/wsol-logo.png',
    width: '110',
    height: '32',
  });
  const [selectedKeys, setSelectedKeys] = useState(['1']);
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (!collapsed) {
      setLogoDetail({
        path: '/assets/wsol-logo.png',
        width: '110',
        height: '32',
      });
    } else {
      setLogoDetail({
        path: '/assets/wsol-logo2.png',
        width: '32',
        height: '32',
      });
    }
  }, [collapsed]);

  if (status === 'unauthenticated') return null;

  if (status === 'loading') {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        Loading...
      </div>
    );
  }

  const items = [
    {
      key: '1',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => {
        setSelectedKeys(['1']);
        router.push('/dashboard');
      },
    },
    {
      key: '2',
      icon: <InfoCircleOutlined />,
      label: 'ข้อมูลหลัก',
      children: [
        {
          key: 'master-branch-detail',
          label: 'ข้อมูลสาขา',
          icon: selectedKeys.includes('master-branch-detail') ? (
            <CaretRightOutlined />
          ) : null,
          onClick: () => {
            setSelectedKeys(['master-branch-detail']);
            router.push('/master/master-branch-detail');
          },
        },
        {
          key: 'master-category',
          label: 'ข้อมูลหมวดหมู่สินค้า',
          icon: selectedKeys.includes('master-category') ? <CaretRightOutlined /> : null,
          onClick: () => {
            setSelectedKeys(['master-category']);
            router.push('/master/master-category');
          },
        },
        {
          key: 'master-sub-category',
          label: 'ข้อมูลหมวดหมู่ย่อยสินค้า',
          icon: selectedKeys.includes('master-sub-category') ? (
            <CaretRightOutlined />
          ) : null,
          onClick: () => {
            setSelectedKeys(['master-sub-category']);
            router.push('/master/master-sub-category');
          },
        },
        {
          key: 'master-product',
          label: 'ข้อมูลสินค้า',
          icon: selectedKeys.includes('master-product') ? <CaretRightOutlined /> : null,
          onClick: () => {
            setSelectedKeys(['master-product']);
            router.push('/master/master-product');
          },
        },
      ],
    },
    {
      key: '3',
      icon: <UserOutlined />,
      label: 'Users',
      onClick: () => {
        setSelectedKeys(['3']);
        router.push('/form-builder');
      },
    },
    {
      key: '4',
      icon: <UserOutlined />,
      label: 'Auto Form',
      onClick: () => {
        setSelectedKeys(['4']);
        router.push('/autoform/test');
      },
    },

    //{
    //    key: '3',
    //    icon: <SettingOutlined />,
    //    label: 'Settings',
    //    children: [
    //        { key: 'setting1', label: 'Sub Setting', icon: <SettingOutlined />, },
    //    ]
    //},
    //{
    //    key: '4',
    //    icon: <LogoutOutlined />,
    //    label: t('UserManagement'),
    //    children: [
    //        { key: 'users', label: 'Users', icon: <SettingOutlined />,onClick: () => router.push('/user-management/users')},
    //        { key: 'roles', label: 'Roles', icon: <SettingOutlined />,onClick: () => router.push('/user-management/roles') },
    //        { key: 'permissions', label: 'Permissions', icon: <SettingOutlined />,onClick: () => router.push('/user-management/permissions') },
    //    ],
    //},
  ];

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      onCollapse={value => setCollapsed(value)}
      width={240}
      collapsedWidth={80}
    >
      <div
        style={{
          height: 32,
          margin: 16,
          // background: 'rgba(255, 255, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        <div style={{ color: 'black' }} onClick={() => router.push('/')}>
          {/* {session?.user?.username || 'ADMIN'} */}
          <Image
            src={logoDetail.path}
            alt="test-logo"
            width={logoDetail.width}
            height={logoDetail.height}
          />
        </div>
      </div>
      <Menu selectedKeys={selectedKeys} mode="inline" items={items} />
    </Sider>
  );
}
