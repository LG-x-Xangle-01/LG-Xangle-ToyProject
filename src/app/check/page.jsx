"use client";

import React, { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import { AppContext } from "../layout";
import c_abi from "../c_abi.json";
import styled from "styled-components";
import { useRef } from "react";
import TopNavigationBar from "../components/TopNavigationBar";
import { useRouter } from "next/navigation";
import { TopNavigationBarPlaceholder } from "../placeholder";
import { registerStepState } from "../states";
import { useRecoilState } from "recoil";
import axios from "axios";

const c_add = "0x525C1af37185CC58c68D5a57dC38eA7900c378e3";

const Check = () => {
  const { account, setAccount, web3 } = useContext(AppContext);
  const c_a2 = new web3.eth.Contract(c_abi, c_add);
  const [result, setResult] = useState(0);
  const [imageFile, setImageFile] = useState();
  const [hash, setHash] = useState();
  const [selectedImage, setSelectedImage] = useState(null);
  const [idx, setIdx] = useState();
  const router = useRouter();

  const [registerStep, setRegisterStep] = useRecoilState(registerStepState);

  const handleClick = async () => {
    const bool = await c_a2.methods.check_hash(hash, idx).call();

    // console.log(`${process.env.NEXT_PUBLIC_BACK_URL}/api/history/`);

    try {
      if (bool === true) setResult(1);
      else setResult(2);
      setRegisterStep(3);
    } catch (error) {
      console.log(error);
    }

    // const res = await axios.post(
    //   `${process.env.NEXT_PUBLIC_BACK_URL}/api/user`,
    //   {
    //     auth: suser.id,
    //     pvk: newAccount.privateKey,
    //     nickname: 'test',
    //     login_type: 'test',
    //   }
    // );
  };

  const getImagePixelColor = (imageData) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = imageData.width;
    canvas.height = imageData.height;

    ctx.drawImage(imageData, 0, 0);

    const pixelData = ctx.getImageData(0, 0, 1, 1).data;
    return {
      r: pixelData[0],
      g: pixelData[1],
      b: pixelData[2],
    };
  };

  const del = () => {
    setImageFile();
    setResult(0);
  };

  const inputRef = useRef();

  const handleButtonClick = () => {
    // input 엘리먼트가 클릭되었을 때 input 버튼을 클릭하기 위해 click() 메서드를 사용
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const onChangeImageFile = (e) => {
    if (!e.target.files) return;

    const crypto = require("crypto");
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);

    reader.onload = (event) => {
      if (event.target && event.target.result) {
        const fileData = event.target.result;
        const fileBuffer = Buffer.from(fileData);
        const ab = crypto.createHash("sha512").update(fileBuffer).digest("hex");

        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          const color = getImagePixelColor(img);
          let temp = color.r * 256 * 256 + color.g * 256 + color.b;
          setIdx(temp);
          console.log(temp);
        };

        console.log("hash : ", ab);
        setHash(ab);
        setImageFile(file);
      }
    };

    setSelectedImage(URL.createObjectURL(file));
    console.log("url : ", URL.createObjectURL(file));
    setRegisterStep(2);
  };

  useEffect(() => {
    if (account) {
      setRegisterStep(1);
      console.log("account : ", account);
    }
  }, [account]);
  return (
    <>
      <TopNavigationBar />
      <TopNavigationBarPlaceholder />
      {registerStep == 2 && <Title>이 사진을 검증할까요?</Title>}
      {registerStep == 3 && <Title>검증을 완료했어요</Title>}
      <div className="flex justify-center items-center h-screen">
        {!imageFile ? (
          <StyledUploadImageButton onClick={handleButtonClick}>
            <img src="/register/LGcamera.svg" alt="camera" />
            <input
              ref={inputRef}
              accept="image/*"
              type="file"
              onChange={onChangeImageFile}
              style={{ display: "none" }}
            />
          </StyledUploadImageButton>
        ) : registerStep === 2 ? (
          <div
            className="flex flex-col"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {selectedImage && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <UploadedImage src={selectedImage} alt="Uploaded" />
              </div>
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "312px",
                marginTop: "20px",
              }}
            >
              <VerifyButton onClick={handleClick}>원본 검증</VerifyButton>
              <RemoveButton onClick={del}>이미지 제거</RemoveButton>
            </div>
          </div>
        ) : (
          <>
            <div
              className="flex flex-col"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {result != 0 &&
                  (result === 1 ? (
                    <VerifiedBadge isOrigin={true}>원본 인증됨</VerifiedBadge>
                  ) : (
                    <VerifiedBadge isOrigin={false}>원본이 아님</VerifiedBadge>
                  ))}
                <UploadedImage src={selectedImage} alt="Uploaded" />
              </div>
              <CompleteButton
                onClick={() => {
                  router.push("/");
                }}
              >
                확인
              </CompleteButton>
            </div>
          </>
        )}
      </div>
    </>
  );
};
export default Check;

const StyledUploadImageButton = styled.div`
  width: 250px;
  height: 250px;
  background-color: #6b6b6b;
  color: white;
  border-radius: 5px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  font-size: 15.6;
`;

const UploadedImage = styled.img`
  width: 80%;
`;

const VerifyButton = styled.button`
  width: 148px;
  height: 50px;
  border-radius: 50px;
  background-color: white;
  color: #2b9bda;

  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  font-size: 20px;
  font-weight: 400;
  border: 4px solid #2b9bda;
  box-sizing: border-box;
`;

const RemoveButton = styled.button`
  width: 148px;
  height: 50px;
  border-radius: 50px;
  background-color: #2b9bda;
  color: white;

  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  font-size: 20px;
  font-weight: 400;
`;

const Title = styled.div`
  font-size: 28px;
  margin-top: 30px;
  color: white;

  text-align: center;
`;

const VerifiedBadge = styled.div`
  position: absolute;
  top: 200px;

  width: 124px;
  height: 38px;
  border-radius: 100px;

  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  background-color: ${(props) => (props.isOrigin ? "#2B9BDA" : "#DA792D")};
  color: white;
`;

const CompleteButton = styled.button`
  width: 148px;
  height: 50px;
  border-radius: 50px;
  background-color: #2b9bda;
  color: white;

  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  font-size: 20px;
  font-weight: 400;
  margin-top: 70px;
`;
