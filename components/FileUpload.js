import React, { useState } from "react";
import fileConvert from "./FileConvert";

const FileUpload = () => {
  const [imageUrl, setImageUrl] = useState(null);

  const onChangeHandler = async (e) => {
    const file = e.target.files[0];
    const receivedImageUrl = await fileConvert(file);
    setImageUrl(receivedImageUrl);
  };

  return (
    <>
      <div style={{ marginTop: "10px" }}>
        <input
          type="file"
          accept="image/*"
          name="img"
          onChange={onChangeHandler}
        />
      </div>
      {imageUrl && <img src={imageUrl} alt="Modified Image" width={100} />}
    </>
  );
};

export default FileUpload;
