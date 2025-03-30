import { PlusOutlined } from "@ant-design/icons";
import { Upload, Image } from "antd";
import type { UploadFile, UploadProps } from "antd";
import { UploadListType } from "antd/es/upload/interface";
import { useState } from "react";

const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

interface ImageUploaderProps {
  fileList: UploadFile[];
  setFileList: (files: UploadFile[]) => void;
  listType?: UploadListType;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  fileList,
  setFileList,
  listType = "picture-card",
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  return (
    <>
      <Upload
        listType={listType}
        fileList={fileList}
        beforeUpload={() => false}
        onPreview={handlePreview}
        onChange={handleChange}
        maxCount={1}
      >
        {fileList.length < 1 && (
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        )}
      </Upload>

      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </>
  );
};

export default ImageUploader;
