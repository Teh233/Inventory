import React from "react";
import { styled } from "@mui/system";
import drone from '../../assets/droneB.png';

const MainPage = styled('div')({
  position: "absolute",
  top: 0,
  left: 0,
 width: "99%",
  height: "99%",
  display: "flex",
  justifyContent: "center", // Center horizontally
  alignItems: "center", // Center vertically
  zIndex: 1000,
 
  backgroundColor: "rgba(255, 255, 255, 0.8)",
});

const LoadAnimation = styled('div')({
  position: 'relative',

  '& .plane': {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '150px',
    height: '100px',
   animation: 'rotate 2s linear infinite',
   animationDelay: '-3s',
  },


  '@global': {
    '@keyframes load': {
      '0%': {
        transform: 'scale(0)',
        opacity: 0,
      },
      '10%': {
        transform: 'scale(1.2)',
        opacity: 1,
      },
      '80%,100%': {
        transform: 'scale(0)',
        opacity: 0,
      },
    },
    '@keyframes rotate': {
      '0%': {
        transform: 'rotate(0deg)',
      },
      '100%': {
        transform: 'rotate(360deg)',
      },
    },
  },
  '& .plane img': {
    transform: 'rotate(45deg)',
    width: '150px',
  },
});

const Loading = () => {
  return (
    <MainPage>
 
    <LoadAnimation>
      <div className="plane">
        <img src={drone} alt="Plane" />
      
      </div>

    </LoadAnimation>
  
    </MainPage>
  );
};

export default Loading;
