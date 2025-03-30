import type React from "react";
import { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { Users, LibraryBig, Music } from "lucide-react";
import ArtistTable from "@src/components/admin/ArtistTable";
import GenreTable from "@src/components/admin/GenreTable";

const { Header, Sider, Content } = Layout;

const Admin: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [selectedKey, setSelectedKey] = useState("artists");

  const renderByKey = () => {
    switch (selectedKey) {
      case "genres":
        return <GenreTable />;
      case "artists":
        return <ArtistTable />;
      default:
        return <ArtistTable />;
    }
  };

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[selectedKey]}
          onClick={(item) => setSelectedKey(item.key)}
          items={[
            {
              key: "artists",
              icon: <Users />,
              label: "Nghệ sĩ",
            },
            {
              key: "genres",
              icon: <LibraryBig />,
              label: "Thể loại",
            },
            {
              key: "musics",
              icon: <Music />,
              label: "Bài hát",
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {renderByKey()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Admin;
