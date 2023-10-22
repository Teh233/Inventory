import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  styled,
  InputBase,
  List,
  ListItem,
  Paper,
  Typography,
  Button,
} from '@mui/material';
import Fuse from 'fuse.js';

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
});

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background:
    theme.palette.mode === 'dark'
      ? 'Black'
      : 'linear-gradient(0deg, #01127D, #04012F)',
  position: 'sticky',
}));

const StyledInputbase = styled(InputBase)(({ theme }) => ({
  input: {
    '&:hover': {
      color: 'rgb(15, 126, 252)',
    },
  },
  width: '100%',
  background: theme.palette.mode === 'dark' ? 'grey' : '#fff',
  color: theme.palette.mode === 'dark' ? '#fff' : 'black',
}));

const data = [
  { id: 1, name: 'T-Motor Antigravity MN6007II KV320' },
  { id: 2, name: 'T-Motor ANTIGRAVITY MN4006 KV380 - 2Pcs/Set' },
  { id: 3, name: 'Carbon Fiber Propeller 2685 (1 CW + 1 CCW) With Adapter)' },
  { id: 4, name: '3K Carbon Fiber 1055 Propeller 10*5.5 Pair of CW CCW for Drone' },
  { id: 5, name: '3K Carbon Fiber 1255 Propeller 12*5.5 Pair of CW CCW for Drone' },
  { id: 6, name: 'EFT E610P 10L Agricultural Drone Quadcopter Frame Only' },
  { id: 7, name: 'EFT E616P 16L Agricultural Drone Hexacopter Frame Only' },
  { id: 8, name: 'Aluminum C Clamp For 16 mm Carbon Fiber Tube For Drone /UAV Red' },
  { id: 9, name: 'HOBBYWING XRotor 40A ESC COB Speed Controller For Drone ' },
  { id: 10, name: 'HOBBYWING  XRotor 20A ESC COB  Speed Controller For Drone  ' },
  { id: 11, name: 'T-Motor Air Gear 450 II' },
  { id: 12, name: 'EFT  G620 20L Agricultural Drone Hexacopter Frame Only' },
  { id: 13, name: 'Hobbyiwng 36190 X9 Plus Propeller For Agriculture Drone CCW' },
  { id: 14, name: 'SKYDROID Two Axis Gimbal Camera' },
  { id: 15, name: 'SKYDROID  Camera Switch Board for dual camera For T10 , T12 ,H12' },
  { id: 16, name: '19x18x1000  mm Carbon Fiber Tube Thickness 0.5 mm' },
  { id: 17, name: '15x14x1000  mm Carbon Fiber Tube Thickness 0.5 mmy' },
  { id: 18, name: 'EFT  G610P 10L Agricultural Drone Hexacopter Set Tank and Frame' },
  { id: 19, name: 'Aluminum C Clamp For 28 mm Carbon Fiber Tube For Drone /UAV Red' },
  { id: 20, name: 'Aluminum C Clamp For 22 mm Carbon Fiber Tube For Drone /UAV Black' },
  { id: 21, name: 'EFT  G616P 16L Agricultural Drone Hexacopter Set Tank and Frame' },
 
  // ... (add more data as needed)
];

const options = {
  includeScore: true,
  shouldSort: true,
  threshold: 0.4,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: ['name'],
};

const fuse = new Fuse(data, options);

const itemsPerPage = 10; // Number of items to display per page

const Testing = () => {
  const [keywords, setKeywords] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Split the input text into an array of keywords
    const keywordsArray = keywords.toLowerCase().split(' ');

    // Filter out empty keywords
    const validKeywords = keywordsArray.filter((keyword) => keyword.trim() !== '');

    // If there are valid keywords, perform the search
    if (validKeywords.length > 0) {
      // Perform individual searches for each keyword
      const results = validKeywords.map((keyword) => fuse.search(keyword));

      // Merge and deduplicate the results
      const mergedResults = Array.from(new Set([].concat(...results)));

      setSearchResults(mergedResults.map((result) => result.item));
    } else {
      setSearchResults([]); // No valid keywords, so no results
    }
  }, [keywords]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedResults = searchResults.slice(startIndex, endIndex);

  return (
    <div>
      <StyledAppBar style={{ marginTop: '100px' }}>
        <Toolbar>
          <StyledInputbase
            placeholder="Search by Name"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
        </Toolbar>
      </StyledAppBar>

      <List>
        {displayedResults.map((item) => (
          <Paper key={item.id} elevation={3} style={{ margin: '10px' }}>
            <ListItem>
              <Typography variant="h6">{item.name}</Typography>
              <Typography>ID: {item.id}</Typography>
              {/* Add more details as needed */}
            </ListItem>
          </Paper>
        ))}
      </List>

      <div>
        <Button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous 
        </Button>
        <span>Page {currentPage} of {totalPages}</span>
        <Button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Testing;
