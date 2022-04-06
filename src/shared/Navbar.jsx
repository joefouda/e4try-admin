import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { useNavigate,useLocation } from 'react-router-dom';
import { useState,useEffect } from 'react';
import Authentication from '../auth/authentication';

const NavItem = styled(Link)`
    color: #fff;
    text-decoration: none;
    padding: 0 10px 0 10px;
    font-weight: bold;
    :hover {
        color: #f4f4f4;
    }
`;

const SpecialItem = styled(Link)`
    color: blue;
    background-color:white;
    border-radius: 5px;
    text-decoration: none;
    padding: 2px 10px 2px 10px;
    font-weight: bold;
    :hover {
        color: #489cea;
    }
`;


export default function Navbar() {
	const navigate = useNavigate();
  const Location = useLocation();
  const [isAuthenticated, setAuthentication] = useState(Authentication.isAuthinticated())
  const handleLogOut = ()=>{
    Authentication.LogOut()
  }
  useEffect(() => {
    setAuthentication(Authentication.isAuthinticated())
}, [Location])
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography className="cursor-pointer" variant="h5" component="div" onClick={()=>navigate('/')} sx={{ flexGrow: 1 }}>
            E4try-Admin
          </Typography>
          {isAuthenticated?<NavItem to="users">Users</NavItem>:''}
          {isAuthenticated?<NavItem to="vendors">Vendors</NavItem>:''}
          {isAuthenticated?<NavItem to="products">Products</NavItem>:''}
          {isAuthenticated?<NavItem to="categories">Categories</NavItem>:''}
          {isAuthenticated?<NavItem to="orders">Orders</NavItem>:''}
          {isAuthenticated?<SpecialItem to="log-in" onClick={handleLogOut}>Log Out</SpecialItem>:''}

        </Toolbar>
      </AppBar>
    </Box>
  );
}