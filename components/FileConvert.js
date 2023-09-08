import axios from "axios";

const fileConvert = async (file) => {
  const formData = new FormData();

  if (file) {
    formData.append("image", file);
    formData.append("hex_color", "FF5733"); // 예시 색상 코드

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/myapp/upload_image/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "arraybuffer",
        }
      );

      const blob = new Blob([response.data], { type: "image/jpeg" });
      const imageUrl = URL.createObjectURL(blob);

      console.log("Image URL:", imageUrl);
      return imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  } else {
    console.error("No image selected");
  }
};

export default fileConvert;
