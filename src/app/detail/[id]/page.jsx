'use client';

import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { AppContext } from '../../layout';

const History = () => {
  const { account, setAccount, web3 } = useContext(AppContext);
  const [data, setData] = useState();

  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  const get_history_data = async () => {
    try {
      setIsLoading(true);
      console.log('loading', id);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/history?hid=${id}`
      );

      setData(response.data);
      setIsLoading(false);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    get_history_data();
  }, []);

  return (
    <>
      (
      {isLoading == true ? (
        <div> Loading ~ </div>
      ) : (
        <div>
          <div className="bg-neutral-200 flex justify-center min-h-screen pt-10 mb-24">
            <div className="flex flex-col items-center w-full">
              <div className="flex">
                <img className="h-96" src={data.imgurl} alt="이미지 설명" />
              </div>
              <div className="w-full h-full bg-white mt-10 rounded-t-3xl">
                <div className="m-10">
                  <div className="text-4xl font-bold">검증 ID : {data.id}</div>
                  <div className="text-xl font-bold mt-4">
                    검증 결과 : {data.result}
                  </div>
                  <div className="text-xl font-bold mt-4">
                    검증 일시 : {data.createdAt}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      );
    </>
  );
};

export default History;
