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
      const blueMarkAddedImageUrl = await addBlueMark(imageUrl);
      console.log("Bluemark Image URL", blueMarkAddedImageUrl);
      return blueMarkAddedImageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  } else {
    console.error("No image selected");
  }
};

export default fileConvert;

// Blob URL로부터 이미지 로드
const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
};

// 블루마크 추가 함수
const addBlueMark = async (imageURL) => {
  return new Promise(async (resolve, reject) => {
    try {
      const img = await loadImage(imageURL);

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(img, 0, 0);

      ctx.fillStyle = "blue";
      ctx.font = "48px serif";
      ctx.fillText("LG", 50, 50);

      canvas.toBlob((blob) => {
        const newImageURL = URL.createObjectURL(blob);
        resolve(newImageURL); // Blob URL을 반환
      });
    } catch (error) {
      reject(error);
    }
  });
};
