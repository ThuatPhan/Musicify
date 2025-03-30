import React, { useEffect } from "react";
import { Avatar, Button, Space, Table, type TableProps } from "antd";
import { Artist } from "@src/types/Artist";
import { useArtistStore } from "@src/stores/useArtistStore";
import ArtistForm from "@src/components/admin/ArtistForm";
import { FormType } from "@src/types/Enums";
import NotificationPopup from "@src/components/NotificationPopup";
import ActionConfirm from "@src/components/admin/ActionConfirm";
import { useAuth0 } from "@auth0/auth0-react";

const ArtistTable: React.FC = () => {
  const { getAccessTokenSilently } = useAuth0();
  const {
    artists,
    loading,
    notification,
    setNotification,
    getArtists,
    deleteArtist,
  } = useArtistStore();

  useEffect(() => {
    getArtists();
    return () => setNotification(null);
  }, []);

  const columns: TableProps<Artist>["columns"] = [
    {
      title: "Artist name",
      dataIndex: "name",
      key: "name",
      width: "50%",
    },
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatarUrl: string) => <Avatar src={avatarUrl} size={64} />,
    },
    {
      title: "Actions",
      key: "actions",
      render: (artist: Artist) => (
        <Space>
          <ArtistForm type={FormType.UPDATE} artist={artist} />
          <ActionConfirm
            description={`Are you sure to delete artist ${artist.name} ?`}
            onConfirm={async () =>
              await deleteArtist(artist.id, await getAccessTokenSilently())
            }
          >
            <Button variant="solid" color="red">
              Delete
            </Button>
          </ActionConfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      {notification && (
        <NotificationPopup
          message={notification.message}
          type={notification.type}
        />
      )}
      <ArtistForm type={FormType.ADD} />
      <Table
        columns={columns}
        dataSource={artists.map((arist) => ({ ...arist, key: arist.id }))}
        loading={loading}
      />
    </>
  );
};

export default ArtistTable;
