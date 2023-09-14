"use client";

import React, { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import { AppContext } from "../layout";
import c_abi from "../c_abi.json";
import axios from "axios";
import styled from "styled-components";
import TopNavigationBar from "../components/TopNavigationBar";
import { TopNavigationBarPlaceholder } from "../placeholder";

const History = () => {
  const { account, setAccount, web3 } = useContext(AppContext);
  const [data, setData] = useState();

  const [isLoading, setIsLoading] = useState(true);

  const get_history_data = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/history?signeky=${account.id}`
      );

      setData(response.data);
      setIsLoading(false);
      console.log("data :", response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log("account : ", account);
    get_history_data();
  }, []);

  // return ({isLoading == true ? <div> Loading ~ </div> : <div> 아아 </div>});
  return (
    // <>
    //   <TopNavigationBar />
    //   <TopNavigationBarPlaceholder />
    //   <PhotoGrid>
    //     {Array.from({ length: 12 }, (_, index) => (
    //       <PhotoBlock key={index}>{index + 1}</PhotoBlock>
    //     ))}
    //   </PhotoGrid>
    // </>
    <PhotoDetail />
  );

  // return (
  //   <>
  //     <TopNavigationBar />
  //     <TopNavigationBarPlaceholder />
  //     <PhotoGrid>
  //       {Array.from({ length: 12 }, (_, index) => {
  //         if (index === 0) {
  //           return <ImageBlock key={index} />;
  //         }
  //         if (index === 1) {
  //           return <ImageBlock1 key={index} />;
  //         }
  //         return <PhotoBlock key={index}></PhotoBlock>;
  //       })}
  //     </PhotoGrid>
  //   </>
  // );
};

export default History;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
`;

const PhotoBlock = styled.div`
  width: 100px;
  height: 100px;
  background-color: lightgray;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
`;

/////////
const PhotoDetail = () => {
  return (
    <div>
      <TopNavigationBar />
      <TopNavigationBarPlaceholder />
      <HistoryTime>2023/9/8 23:11</HistoryTime>
      <HistoryVerification>
        <img src="/history/blueCheckHistory.svg" alt="bluecheck" width={34} />
        <VerifiedBadge isOrigin={true}>원본 인증됨</VerifiedBadge>
      </HistoryVerification>
      <HistoryImage src="/history/IMG_5517.JPG" />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "312px",
          marginTop: "20px",
        }}
      >
        <ListButton>목록</ListButton>
        <DownloadButton>다운로드</DownloadButton>
      </div>
    </div>
  );
};

const HistoryTime = styled.div`
  width: 320px;
  font-size: 16px;

  /* border: 1px solid white;
  box-sizing: border-box; */
`;

const HistoryVerification = styled.div`
  width: 320px;
  height: 34px;
  display: flex;
  align-items: center;
  margin-top: 10px;

  /* border: 1px solid white;
  box-sizing: border-box; */
`;

const VerifiedBadge = styled.div`
  width: 102px;
  height: 28px;
  border-radius: 100px;

  font-size: 14;
  font-weight: 400;

  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  margin-left: 10px;

  background-color: ${(props) => (props.isOrigin ? "#2B9BDA" : "#DA792D")};
  color: white;
`;

const HistoryImage = styled.img`
  width: 250px;
  margin-top: 20px;
`;

const ListButton = styled.button`
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

const DownloadButton = styled.button`
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

// const PhotoGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(3, 1fr);
//   gap: 16px;
// `;

// const PhotoBlock = styled.div`
//   width: 100px;
//   height: 100px;
//   background-color: lightgray;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   font-size: 24px;
// `;

const ImageBlock = styled.div`
  width: 100px;
  height: 100px;
  background-image: url("/history/Hugging_Face_Emoji_2028ce8b-c213-4d45-94aa-21e1a0842b4d_large.webp");
  background-size: cover;
  background-position: center;
`;
const ImageBlock1 = styled.div`
  width: 100px;
  height: 100px;
  background-image: url("/history/IMG_5517.JPG");
  background-size: cover;
  background-position: center;
`;
