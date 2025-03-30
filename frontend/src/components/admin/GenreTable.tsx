import { useGenreStore } from "@src/stores/useGenreStore";
import { Genre } from "@src/types/Genre";
import type React from "react";
import { FormType } from "@src/types/Enums";
import { Button, Space, Table, TableProps } from "antd";
import GenreForm from "@src/components/admin/GenreForm";
import ActionConfirm from "@src/components/admin/ActionConfirm";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import NotificationPopup from "@src/components/NotificationPopup";

const GenreTable: React.FC = () => {
  const { getAccessTokenSilently } = useAuth0();
  const {
    loading,
    genres,
    notification,
    setNotification,
    getGenres,
    deleteGenre,
  } = useGenreStore();

  const columns: TableProps<Genre>["columns"] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "50%",
    },
    {
      title: "Actions",
      key: "actions",
      render: (genre: Genre) => (
        <Space>
          <ActionConfirm
            description={`Are you sure to delete genre ${genre.name} ?`}
            onConfirm={async () =>
              await deleteGenre(genre.id, await getAccessTokenSilently())
            }
          >
            <Button variant="solid" color="red">
              Delete
            </Button>
          </ActionConfirm>
          <GenreForm type={FormType.UPDATE} genre={genre} />
        </Space>
      ),
    },
  ];

  useEffect(() => {
    getGenres();
    return () => setNotification(null);
  }, []);

  return (
    <>
      {notification && (
        <NotificationPopup
          message={notification.message}
          type={notification.type}
        />
      )}
      <GenreForm type={FormType.ADD} />
      <Table
        columns={columns}
        loading={loading}
        dataSource={genres.map((gen) => ({ ...gen, key: gen.id }))}
        pagination={{
          pageSize: 5,
          position: ["topRight"],
        }}
      />
    </>
  );
};

export default GenreTable;
