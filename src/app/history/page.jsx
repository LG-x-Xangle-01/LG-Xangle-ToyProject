"use client";

import React, { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import { AppContext } from "../layout";
import c_abi from "../c_abi.json";
import axios from "axios";
import styled from "styled-components";
import TopNavigationBar from "../components/TopNavigationBar";
import { TopNavigationBarPlaceholder } from "../placeholder";
import Link from "next/link";

const History = () => {
  const { account, setAccount, web3 } = useContext(AppContext);
  const [data, setData] = useState();

  const [isLoading, setIsLoading] = useState(true);

  const get_history_data = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/history?signkey=${account.id}`
      );

      setData(response.data.res_h);
      setIsLoading(false);
      console.log("data :", response.data.res_h);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (account) {
      console.log("account : ", account);
      get_history_data();
    }
  }, [account]);

  // return ({isLoading == true ? <div> Loading ~ </div> : <div> 아아 </div>});
  return (
    <>
      <TopNavigationBar />
      <TopNavigationBarPlaceholder />
      <PhotoGrid>
        {data?.map((v, i) => (
          <Link
            href={`/detail/${v.id}`}
            key={i}
            className="w-[100px] h-[100px] flex justify-center"
          >
            <div classname="text-[40px]"> {v.imgurl} </div>
          </Link>
        ))}
      </PhotoGrid>
    </>
  );
};

export default History;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
`;

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
