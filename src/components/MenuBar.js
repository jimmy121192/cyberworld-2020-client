import React, { useContext, useState } from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { AuthContext } from '../context/auth'
function MenuBar() {
  const { user, logout } = useContext(AuthContext); //destructuring context to user and logout
  const pathname = window.location.pathname; 
  const path = pathname === '/' ? 'home' : pathname.substr(1); //remove / from pathname
  const [activeItem, setActiveItem] = useState(path);
  const handleItemClick = (e, { name }) => setActiveItem(name);

  const menuBar =  user ? (
    <Menu pointing secondary size="massive" color="teal">
          <Menu.Item
            name='home'
            active
            as={Link}
            to="/"
          />
    
          <Menu.Menu position='right'>
            <Menu.Item
            className="menu-welcome"
            name={'Welcome '+user.username}
          />
    
            <Menu.Item
            name='logout'
            onClick={logout}
          />
          </Menu.Menu>
        </Menu>
  ) : (
    <Menu pointing secondary size="massive" color="teal">
          <Menu.Item
            name='home'
            active={activeItem === 'home'}
            onClick={handleItemClick}
            as={Link}
            to="/"
          />
      
          <Menu.Menu position='right'>
            <Menu.Item
            name='login'
            active={activeItem === 'login'}
            onClick={handleItemClick}
            as={Link}
            to="/login"
          />
          <Menu.Item
            name='register'
            active={activeItem === 'register'}
            onClick={handleItemClick}
            as={Link}
            to="/register"
          />
          </Menu.Menu>
        </Menu>
  )



    
    return (
      <div>
        {menuBar}
      </div>
    )
  }

export default MenuBar;