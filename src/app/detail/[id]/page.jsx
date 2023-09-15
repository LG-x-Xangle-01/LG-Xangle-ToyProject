"use client";

import React, { useState, useEffect, useContext } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { AppContext } from "../../layout";
import TopNavigationBar from "../../components/TopNavigationBar";
import { TopNavigationBarPlaceholder } from "../../placeholder";
import styled from "styled-components";
import Link from "next/link";

const History = () => {
  const { account, setAccount, web3 } = useContext(AppContext);
  const [data, setData] = useState();

  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  const get_history_data = async () => {
    try {
      setIsLoading(true);
      console.log("loading", id);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/history?hid=${id}`
      );

      setData(response.data.res_h[0]);
      setIsLoading(false);
      console.log(response.data.res_h[0]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    get_history_data();
  }, []);

  // isLoading이 true일 때 로딩 화면을, 그렇지 않으면 컨텐츠를 보여줍니다.
  return isLoading ? (
    <div> Loading ~ </div>
  ) : (
    <div>
      <TopNavigationBar />
      <TopNavigationBarPlaceholder />
      <HistoryTime>등록 시간 : {data.createdAt}</HistoryTime>
      <HistoryVerification>
        <div src="/history/blueCheckHistory.svg" alt="bluecheck" width={34} />
        <VerifiedBadge isOrigin={data.bool}>
          {data.bool == true ? "원본 이미지" : "원본 이미지"}{" "}
        </VerifiedBadge>
      </HistoryVerification>
      <div className="mx-auto w-[100px] text-[30px]">{data.imgurl}</div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "312px",
          marginTop: "20px",
        }}
      >
        <Link href="/history">
          <ListButton>목록</ListButton>
        </Link>
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

export default History;
