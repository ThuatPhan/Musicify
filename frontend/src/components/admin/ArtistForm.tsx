import { FormType, Sex } from "@src/types/Enums";
import { Button, DatePicker, Form, Input, Select } from "antd";
import type { UploadFile } from "antd";
import { useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";
import FormModal from "@src/components/admin/FormModal";
import ImageUploader from "@src/components/admin/ImageUpload";
import { useArtistStore } from "@src/stores/useArtistStore";
import { useAuth0 } from "@auth0/auth0-react";
import dayjs from "dayjs";
import { Artist } from "@src/types/Artist";

type ArtistFormProps =
  | {
      type: FormType.ADD;
    }
  | {
      type: FormType.UPDATE;
      artist: Artist;
    };

const ArtistForm: React.FC<ArtistFormProps> = (props) => {
  const { getAccessTokenSilently } = useAuth0();
  const { loading, createArtist, updateArtist } = useArtistStore();
  const [open, setOpen] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = useForm();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFileList([]);
    form.resetFields();
  };

  const handleOk = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();
    if (props.type === FormType.ADD) {
      await createArtist(
        {
          name: values.name,
          dateOfBirth: dayjs(values.dob).format("YYYY-MM-DD"),
          sex: values.sex,
        },
        fileList[0].originFileObj as File,
        await getAccessTokenSilently()
      );
    } else {
      await updateArtist(
        {
          id: props.artist.id,
          name: values.name,
          dateOfBirth: dayjs(values.dob).format("YYYY-MM-DD"),
          sex: values.sex,
        },
        await getAccessTokenSilently(),
        fileList.length > 0 ? (fileList[0].originFileObj as File) : undefined
      );
    }
    handleClose();
  };

  useEffect(() => {
    if (props.type === FormType.UPDATE) {
      const artist = props.artist;
      form.setFieldsValue({
        name: artist.name,
        dob: dayjs(artist.dateOfBirth),
        sex: artist.sex,
      });
    }
  }, [props.type]);

  return (
    <>
      <Button type="primary" onClick={handleOpen}>
        {props.type === FormType.ADD ? "Add new" : "Update info"}
      </Button>
      <FormModal
        open={open}
        loading={loading}
        onCancel={handleClose}
        onOk={handleOk}
        title={
          props.type === FormType.ADD ? "Add new artist" : "Update artist info"
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Artist Name"
            name="name"
            rules={[{ required: true, message: "Please enter artist name" }]}
          >
            <Input placeholder="Enter artist name" />
          </Form.Item>
          <Form.Item
            name="dob"
            label="Date of Birth"
            rules={[{ required: true, message: "Please select date of birth" }]}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item
            name="sex"
            label="Sex"
            rules={[{ required: true, message: "Please select sex" }]}
          >
            <Select placeholder="Select sex">
              {Object.values(Sex).map((sex) => (
                <Select.Option key={sex} value={sex}>
                  {sex}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Avatar Upload"
            name="avatar"
            rules={[
              {
                validator: async (_, value) => {
                  if (props.type === FormType.ADD && fileList.length === 0) {
                    return Promise.reject(new Error("Please upload an avatar"));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <ImageUploader
              fileList={fileList}
              setFileList={setFileList}
              listType="picture-circle"
            />
          </Form.Item>
        </Form>
      </FormModal>
    </>
  );
};

export default ArtistForm;
