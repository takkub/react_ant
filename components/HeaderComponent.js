import {Button, Layout} from "antd";
import {MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";
const {Header} = Layout;
export default function HeaderComponent({collapsed, setCollapsed}) {
    return (
        <Header style={{padding: 0}}>
            <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                    fontSize: '16px',
                    width: 64,
                    height: 64
                }}/>
        </Header>
    );
}