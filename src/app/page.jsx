"use client";

import { useContext, useEffect, useState } from "react";
import "./globals.css";
import SignInButton from "./components/SignInButton";
import { AppContext } from "./layout";
import styled from "styled-components";

export default function Home() {
  const { account, setAccount } = useContext(AppContext);

  return (
    // <Container>
    <>
      <div
        style={{ 
          marginTop: "110px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TextContainer>신뢰할 수 있는 이미지</TextContainer>
        <TextContainer>
          <div>오직</div>
          <BlueText>블루체크에서만</BlueText>
        </TextContainer>
        <div
          style={{
            display: "flex",
            width: "250px",
            justifyContent: "space-between",
            marginTop: "30px",
          }}
        >
          <img
            src="/onboarding/icon _check-circle_.svg"
            alt="check"
            width={100}
          />
          <img
            src="/onboarding/icon _x circle fill_.svg"
            alt="check"
            width={100}
          />
        </div>
        <TextContainer
          style={{
            fontSize: "20px",
            color: "#D9DADB",
            fontWeight: 300,
            marginTop: "20px",
          }}
        >
          블루체크는 블록체인을 이용한 <br /> 이미지 검증 서비스입니다.
        </TextContainer>
      </div>
      <SignInButton />
    </>
    // </Container>
  );
}

const Container = styled.div`
  background-color: #121212;
  width: 100%;
  color: white;
  height: 100vh;

  display: flex;
  /* justify-content: center; */
  align-items: center;
  flex-direction: column;
`;

const TextContainer = styled.div`
  text-align: center;
  font-size: 34px;
  font-weight: 400;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BlueText = styled.div`
  margin-left: 10px;
  color: #2b9bda;
`;
