"use client";

import React, { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import { Presets, Client } from "userop";
import { AppContext } from "../layout";
import c_abi from "../c_abi.json";
import TopNavigationBar from "../components/TopNavigationBar";
import styled from "styled-components";
import { useRef } from "react";
import { useRecoilState } from "recoil";
import { registerStepState } from "../states";
import { useRouter } from "next/navigation";
import { TopNavigationBarPlaceholder } from "../placeholder";
import axios from "axios";

const c_add = "0x525C1af37185CC58c68D5a57dC38eA7900c378e3";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { account, setAccount, web3 } = useContext(AppContext);
  const [print, setPrint] = useState(0);
  const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_RPC_URL
  );
  const c_a = new ethers.Contract(c_add, c_abi, provider);
  const c_a2 = new web3.eth.Contract(c_abi, c_add);
  const router = useRouter();

  let t_signer;

  const [result, setResult] = useState(0);
  const [imageFile, setImageFile] = useState();
  const [skey, setSkey] = useState();

  const [signer, setSigner] = useState();
  const [builder, setBuilder] = useState();
  const [hash, setHash] = useState();
  const [registerStep, setRegisterStep] = useRecoilState(registerStepState);

  const [selectedImage, setSelectedImage] = useState(null);

  // const downloadImage = (dataUrl, filename) => {
  //   const anchor = document.createElement("a");
  //   anchor.href = dataUrl;
  //   anchor.download = filename;
  //   document.body.appendChild(anchor);
  //   anchor.click();
  //   document.body.removeChild(anchor);
  // };
  const downloadImage = async (dataUrl, filename) => {
    const anchor = document.createElement("a");
    anchor.href = dataUrl;
    anchor.download = filename;
    anchor.style.display = "none"; // anchor를 DOM에 보이지 않게 설정
    document.body.appendChild(anchor);

    // 다운로드를 위한 클릭 이벤트를 프로그래밍적으로 발생
    const clickEvent = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: false,
    });
    anchor.dispatchEvent(clickEvent);

    // anchor 요소 제거
    setTimeout(() => {
      document.body.removeChild(anchor);
    }, 0);
  };

  const connect = async () => {
    const paymasterMiddleware = Presets.Middleware.verifyingPaymaster(
      process.env.NEXT_PUBLIC_PAYMASTER_URL,
      {
        type: "payg",
      }
    );

    const t_builder = await Presets.Builder.Kernel.init(signer, rpcUrl, {
      paymasterMiddleware: paymasterMiddleware,
    });

    setBuilder(t_builder);
  };

  const register = async () => {
    setIsLoading(true);
    try {
      // destination_add : NFT 받을 주소
      const register = {
        to: c_add,
        value: ethers.constants.Zero,
        data: c_a.interface.encodeFunctionData("set_hash", [hash]), // 여기 들어감
      };

      console.log("set tx");

      builder.executeBatch([register]);

      console.log("set builder");

      // Send the user operation
      const client = await Client.init(rpcUrl);
      const res = await client.sendUserOperation(builder, {
        onBuild: (op) => console.log("ing~"),
      });

      console.log("Waiting for transaction...");
      const ev = await res.wait();
      console.log(`Transaction hash: ${ev?.transactionHash ?? null}`);
      let count = await c_a2.methods.get_count().call();
      count = Number(count);
      setPrint(Number(count));
      downloadImage(selectedImage, "modified_image.png");
      setRegisterStep(3);

      console.log("db record");

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/history/`,
        {
          userId: account.id,
          result: true,
          imgurl: String(count),
        }
      );

      console.log("db complete");
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  const del = () => {
    setImageFile();
    setResult(0);
  };

  const inputRef = useRef();

  const handleClick = () => {
    // input 엘리먼트가 클릭되었을 때 input 버튼을 클릭하기 위해 click() 메서드를 사용
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const onChangeImageFile = async (e) => {
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
        console.log("Original hash : ", ab);
        setImageFile(file);

        const img = new Image();
        img.src = event.target.result;

        img.onload = async () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;

          ctx.drawImage(img, 0, 0);

          const imageData = ctx.getImageData(0, 0, 1, 1);
          const data = imageData.data;
          let count = await c_a2.methods.get_count().call();
          count = Number(count) + 1;

          const R_price = parseInt(count / (256 * 256));
          const G_price = parseInt((count % (256 * 256)) / 256);
          const B_price = count % 256;

          // console.log(R_price, G_price, B_price);

          data[0] = R_price; // R 채널
          data[1] = G_price; // G 채널
          data[2] = B_price; // B 채널

          ctx.putImageData(imageData, 0, 0);

          const modifiedImageDataUrl = canvas.toDataURL("image/png");

          const modifiedFileBuffer = Buffer.from(modifiedImageDataUrl);
          const modifiedHash = crypto
            .createHash("sha512")
            .update(modifiedFileBuffer)
            .digest("hex");
          console.log("Modified hash : ", modifiedHash);

          setSelectedImage(modifiedImageDataUrl);
          setHash(modifiedHash);
        };
      }
    };
    setRegisterStep(2);
  };

  useEffect(() => {
    setPrint(0);
    if (account) {
      setSkey(account.pvk);
      t_signer = new ethers.Wallet(account.pvk);
      setSigner(t_signer);
    }
  }, [account]);

  useEffect(() => {
    if (signer) {
      //   console.log('signer : ', signer);
      connect();
      console.log("ready");
    }
  }, [signer]);

  useEffect(() => {
    setRegisterStep(1);
    console.log("처음 레지스터");
  }, []);

  return (
    <>
      <TopNavigationBar />
      <TopNavigationBarPlaceholder />
      {registerStep === 2 && <Title>이 사진을 등록할까요?</Title>}
      <div className="flex justify-center items-center  h-screen">
        {!imageFile ? (
          <StyledUploadImageButton onClick={handleClick}>
            <img src="/register/LGcamera.svg" alt="camera" />
            <input
              ref={inputRef}
              accept="image/*"
              type="file"
              onChange={onChangeImageFile}
              style={{ display: "none" }}
              capture="camera"
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
            {isLoading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100vh",
                }}
              >
                <img src="https://github.com/arypte/toy_project_1/blob/main/1.png?raw=true"></img>
              </div>
            ) : (
              <>
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
                  <RemoveButton onClick={register}>원본 등록</RemoveButton>
                  {print !== 0 ? <div>{print}</div> : null}
                  <RegisterButton onClick={del}>이미지 제거</RegisterButton>
                </div>
              </>
            )}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              src="/register/blueCheck.svg"
              alt="complete"
              width={125}
              s
              style={{ marginTop: "-50px" }}
            />
            <Title style={{ fontSize: 34 }}>업로드를 완료했어요.</Title>
            <div
              style={{
                fontSize: 20,
                textAlign: "center",
                color: "white",
                fontWeight: 400,
                marginTop: "10px",
              }}
            >
              업로드한 사진은 히스토리 탭에서 <br />
              확인할 수 있어요.
            </div>
            <CompleteButton
              onClick={() => {
                router.push("/");
              }}
            >
              확인
            </CompleteButton>
          </div>
        )}
      </div>
    </>
  );
};
export default Register;

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

const RemoveButton = styled.button`
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

const RegisterButton = styled.button`
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
  margin-top: 50px;
`;
