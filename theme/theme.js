import { Table } from 'antd';

export const lightTheme = {
  token: {
    colorPrimary: '#0067ff', // สีหลัก
    colorTextBase: '#000000', // สีข้อความหลัก
    colorTextSecondary: '#999999', // สีข้อความรอง
    colorBgContainer: '#ffffff', // พื้นหลังของคอนเทนเนอร์
    colorBgBase: '#ffffff', // พื้นหลังหลัก
    colorBgLayout: '#dadada', // พื้นหลังเลย์เอาต์
    colorLink: '#1890ff', // สีของลิงก์
    colorError: '#ff0000', // สีข้อความผิดพลาด
    colorSuccess: '#52c41a', // สีสำเร็จ
    colorWarning: '#fadb14', // สีคำเตือน
    colorInfo: '#0067ff', // สีข้อมูล
    fontSizeBase: '14px', // ขนาดฟอนต์พื้นฐาน
    borderRadiusBase: '4px', // มุมโค้งพื้นฐาน
    boxShadowBase: '0 2px 8px rgba(0, 0, 0, 0.15)', // เงาพื้นฐาน
    paddingBase: '8px', // ระยะห่างพื้นฐาน
    marginBase: '8px', // ระยะห่างจากขอบ
    siderWidth: 240, // ความกว้างของ Sider สำหรับ Dark Theme
    siderCollapsedWidth: 80, // ความกว้างเมื่อ Sider ถูกย่อ
  },
  components: {
    Menu: {
      itemBg: '#ffffff', // พื้นหลังของเมนู
    },
    Typography: {
      titleMarginBottom: 0,
      titleMarginTop: 0,
    },
  },
};
export const darkTheme = {
  token: {
    fontFamily: 'Prompt, sans-serif',
    colorPrimary: '#006964',
    colorTextBase: '#fff',
    colorTextSecondary: '#fff',
    colorBgContainer: '#212121',
    colorBgBase: '#5f5f5f',
    colorLink: '#1890ff',
    colorPrimaryBgHover: '#b7d433',
    colorSuccess: '#73ba4b',
    colorWarning: '#e1dd00',
    Layout: {
      headerBg: '#212121',
      siderBg: '#212121',
    },
    Menu: {
      itemBg: '#212121',
      itemHoverBg: '#006964',
      itemSelectedBg: '#006964',
      itemSelectedColor: 'rgb(255, 255, 255)',
    },
    Alert: {
      colorInfoBg: 'rgb(124, 124, 124)',
      colorText: 'rgb(0,0,0)',
      colorTextHeading: 'rgb(0,0,0)',
      colorInfoBorder: '#006964',
      colorInfo: '#006964',
    },
    Tooltip: {
      colorBgSpotlight: 'rgba(108,108,108,0.85)',
    },
  },
};
export const WSOLTheme = {
  token: {
    colorPrimary: '#ff0000',
    colorInfo: '#006964',
    colorPrimaryBgHover: '#b7d433',
    wireframe: false,
    colorSuccess: '#73ba4b',
    colorWarning: '#e1dd00',
    fontFamily: 'Prompt, sans-serif',
  },
  components: {
    Layout: {
      headerBg: '#ff0000',
      siderBg: '#fff',
    },
    Menu: {
      // itemBg: "#fff",
      itemHoverBg: 'rgb(183, 212, 51)',
      itemSelectedBg: 'rgb(0,105,100)',
      itemSelectedColor: 'rgb(255, 255, 255)',
    },
    Table: {
      rowSelectedBg: 'rgb(245, 245, 245)',
      rowSelectedHoverBg: 'rgb(240, 240, 240)',
      headerBg: '#b7d6f4',
      headerColor: '#1976d2',
      footerBg: '#b7d6f4',
      footerPadding: 0,
    },
  },
};
