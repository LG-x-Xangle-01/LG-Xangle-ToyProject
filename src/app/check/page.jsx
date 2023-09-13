'use client';

import React, { useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import { AppContext } from '../layout';
import c_abi from '../c_abi.json';

const c_add = '0x525C1af37185CC58c68D5a57dC38eA7900c378e3';

const Register = () => {
  const { account, setAccount, web3 } = useContext(AppContext);
  const c_a2 = new web3.eth.Contract(c_abi, c_add);
  const [result, setResult] = useState(0);
  const [imageFile, setImageFile] = useState();
  const [hash, setHash] = useState();
  const [selectedImage, setSelectedImage] = useState(null);
  const [idx, setIdx] = useState();

  const handleClick = async () => {
    const bool = await c_a2.methods.check_hash(hash, idx).call();
    if (bool === true) setResult(1);
    else setResult(2);
  };

  const getImagePixelColor = (imageData) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

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

  const onChangeImageFile = (e) => {
    if (!e.target.files) return;

    const crypto = require('crypto');
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);

    reader.onload = (event) => {
      if (event.target && event.target.result) {
        const fileData = event.target.result;
        const fileBuffer = Buffer.from(fileData);
        const ab = crypto.createHash('sha512').update(fileBuffer).digest('hex');

        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          const color = getImagePixelColor(img);
          let temp = color.r * 256 * 256 + color.g * 256 + color.b;
          setIdx(temp);
          console.log(temp);
        };

        console.log('hash : ', ab);
        setHash(ab);
        setImageFile(file);
      }
    };

    setSelectedImage(URL.createObjectURL(file));
  };

  return (
    <div className="flex justify-center items-center h-screen">
      {!imageFile ? (
        <form className="flex flex-col">
          <label
            className="px-8 py-2 border rounded-xl bg-red-200"
            htmlFor="imageFile"
          >
            {imageFile ? imageFile.name : 'Choose image'}
          </label>
          <input
            className="hidden"
            id="imageFile"
            type="file"
            onChange={onChangeImageFile}
          />
        </form>
      ) : (
        <div className="flex flex-col">
          {selectedImage && <img src={selectedImage} alt="Uploaded" />}

          <div>
            <button
              className="px-8 py-2 border rounded-xl bg-red-200"
              onClick={handleClick}
            >
              원본 검증
            </button>
            {result != 0 &&
              (result === 1 ? <div>원본임</div> : <div>원본아님</div>)}
          </div>
          <button
            className="px-8 py-2 border rounded-xl bg-red-200"
            onClick={del}
          >
            이미지 제거
          </button>
        </div>
      )}
    </div>
  );
};
export default Register;
