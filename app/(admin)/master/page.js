'use client';
import React, { useEffect } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { useTitleContext } from '@/components/TitleContext';
import { DatabaseOutlined, TagsOutlined } from '@ant-design/icons';

export default function MasterPage() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const contentType = params?.type || 'branch';

  // Redirect from /master to /master/master-branch-detail
  useEffect(() => {
    if (pathname === '/master') {
      router.replace('/master/master-branch-detail');
    }
  }, [pathname, router]);

  // Set title based on content type
  const getTitleConfig = () => {
    switch (contentType) {
      case 'category':
        return { title: 'ข้อมูลหมวดหมู่สินค้า', icon: <TagsOutlined /> };
      case 'branch':
        return { title: 'ข้อมูลสาขา', icon: <DatabaseOutlined /> };
      case 'sub-category':
        return { title: 'ข้อมูลหมวดหมู่ย่อยสินค้า', icon: <TagsOutlined /> };
      case 'product':
        return { title: 'ข้อมูลสินค้า', icon: <TagsOutlined /> };
      default:
        return { title: 'ข้อมูลสาขา', icon: <DatabaseOutlined /> };
    }
  };

  useTitleContext(getTitleConfig());

  return <div></div>;
}
