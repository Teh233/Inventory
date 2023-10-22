import React, { useEffect, useState } from 'react';
import { Box, Icon, Typography } from '@mui/material';
import UserRolesItems from '../../../constants/UserRolesItems';
import drone3d from '../../../assets/drone3d.png';

const LandingComponent = () => {
  const [fontColor, setFontColor] = useState('#000');

  useEffect(() => {
    const interval = setInterval(() => {
      setFontColor((prevColor) => (prevColor === '#000' ? '#121FCF' : '#000'));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    const { left, top, width, height } = event.target.getBoundingClientRect();

    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;

    const rotationX = -distanceY / 10; // Adjust the rotation factor as needed
    const rotationY = distanceX / 10; // Adjust the rotation factor as needed

    setRotation({ x: rotationX, y: rotationY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  const rotationStyle = {
    transform: `perspective(500px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
    transition: 'transform 0.3s ease', // Adjust the transition duration and easing as desired
  };

  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        height: '90.4vh',
        width: '89vw',
      }}
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        width="100%"
        height="100%"
        sx={{ position: 'relative' }}
      >
        {/* <Box
          className="rotate-box"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={rotationStyle}
          width="50%"
          height="55%"
          maxWidth="22rem"
          borderRadius="10px"
          overflow="hidden"
          sx={{
            objectFit: 'fill',
            objectPosition: 'center',
            position: 'absolute',
            top: 20,
          }}
        >
          <img
            src="https://ik.imagekit.io/f68owkbg7/Screenshot%202023-10-18%20222901.png?updatedAt=1697648370507"
            alt="Your Image"
            style={{ width: '100%', height: '100%' }}
          />
        </Box> */}
        <Box
          onClick={() => setFontColor('#121FCF')}
          sx={{ textAlign: 'center' }}
        >
          <Typography
            sx={{
              fontWeight: 'bold',
              fontFamily: "'Kanit', sans-serif",
              transition: '2s',

              // background: fontColor === '#121FCF' ? '#121FCF' : 'black',
              background: `linear-gradient(to right, ${fontColor} 30%, ${fontColor} 70%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '12rem',
            }}
          >
            Inventory Management
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LandingComponent;
