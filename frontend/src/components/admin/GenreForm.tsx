import type React from "react";
import { useEffect, useState } from "react";
import { Button, Form, Input } from "antd";
import { useForm } from "antd/es/form/Form";
import { useAuth0 } from "@auth0/auth0-react";
import { FormType } from "@src/types/Enums";
import FormModal from "@src/components/admin/FormModal";
import { useGenreStore } from "@src/stores/useGenreStore";
import { Genre } from "@src/types/Genre";

type GenreFormProps =
  | {
      type: FormType.ADD;
    }
  | {
      type: FormType.UPDATE;
      genre: Genre;
    };

const GenreForm: React.FC<GenreFormProps> = (props) => {
  const { getAccessTokenSilently } = useAuth0();
  const { loading, createGenre, updateGenre } = useGenreStore();

  const [open, setOpen] = useState(false);
  const [form] = useForm();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    form.resetFields();
    setOpen(false);
  };

  const handleOk = async () => {
    await form.validateFields();
    const name = form.getFieldValue("name");
    const token = await getAccessTokenSilently();
    if (props.type === FormType.ADD) {
      await createGenre({ name }, token);
    } else {
      await updateGenre(props.genre.id, { name }, token);
    }
    handleClose();
  };

  useEffect(() => {
    if (props.type === FormType.UPDATE) {
      form.setFieldsValue({
        name: props.genre.name,
      });
    }
  }, [props.type]);

  return (
    <>
      <Button
        onClick={handleOpen}
        variant="solid"
        color={props.type === FormType.ADD ? "blue" : "orange"}
      >
        {props.type === FormType.ADD ? "Add new" : "Update info"}
      </Button>
      <FormModal
        open={open}
        onCancel={handleClose}
        onOk={handleOk}
        loading={loading}
        title={
          props.type === FormType.ADD ? "Add new genre" : "Update genre info"
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Genre name"
            rules={[{ required: true, message: "Name is required" }]}
            required
          >
            <Input placeholder="Enter genre name" />
          </Form.Item>
        </Form>
      </FormModal>
    </>
  );
};

export default GenreForm;
