import React from 'react';
import {
  AppBar,
  Toolbar,
  styled,
  InputBase,
  Paper,
  List,
  ListItem,
  Box
} from '@mui/material';
import { useState } from 'react';


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
const Search = styled('div')(({ theme }) => ({
  background: theme.palette.mode === 'dark' ? 'grey' : '#fff',
  color: theme.palette.mode === 'dark' ? '#fff' : 'black',
  padding: '0 10px ',
  borderRadius: theme.shape.borderRadius,
  width: '40% ',
}));
const Icon = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '20px',
}));

const Listbox = styled('ul')(({ theme }) => ({
  width: '37% ',
  margin: 0,
  padding: '0 10px ',
  zIndex: 1,
  position: 'absolute',
  listStyle: 'none',
  backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#000',
  overflow: 'auto',
  maxHeight: 200,
  border: '1px solid rgba(0,0,0,.25)',
  '& li.Mui-focused': {
    backgroundColor: '#4a8df6',
    color: 'white',
    cursor: 'pointer',
  },
  '& li:active': {
    backgroundColor: '##6699ff',
    color: 'white',
  },
}));

const data = [
  { id: 1, name: 'Apple brendon jacktion' },
  { id: 2, name: 'Banana marshall green range' },
  { id: 3, name: 'Cherry  propler hyper jacktion' },
  // ... (add more data as needed)
];
const Testing = () => {
 const [keyword, setKeyword] = useState('');

 const filteredData = data.filter((item) =>
   item.name.toLowerCase().includes(keyword.toLowerCase())
 );
  
  return (
    <div>
      <StyledAppBar>
        <Toolbar>
          <StyledInputbase
            placeholder='Search'
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </Toolbar>
      </StyledAppBar>

        <List>
          {filteredData.map((item) => (
            <ListItem key={item.id}>{item.name}</ListItem>
          ))}
        </List>

    </div>
  );
};

export default Testing;
