import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Nav, NavItem, NavLink, TabContent, TabPane, Table, Badge } from 'reactstrap';
import { setPanelOpen } from '../../slices/paperSlice';
import { PaperStyle, InsertComposition, InsertText, HelpComponent } from '../';
import './style.css';

const SideSettingsPanel = () => {
  const dispatch = useDispatch()
  const isOpen = useSelector(state => state.paper.isOpen)
  const [activeTab, setActiveTab] = useState('1');
  const handleTabClick = (tabId) => {
    if (activeTab === tabId) {
      dispatch(setPanelOpen(!isOpen));
    } else {
      setActiveTab(tabId);
      dispatch(setPanelOpen(true));
    }
  };
  
  return (
    <div className="side-settings-wrapper d-flex">
      <Nav vertical className="side-nav-tabs bg-light border-end">
        <NavItem>
          <NavLink
            active={activeTab === '1' && isOpen}
            onClick={() => handleTabClick('1')}
            className="vertical-tab-link"
          > Настройки </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={activeTab === '2' && isOpen}
            onClick={() => handleTabClick('2')}
            className="vertical-tab-link"
          > Инструменты </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={activeTab === '3' && isOpen}
            onClick={() => handleTabClick('3')}
            className="vertical-tab-link"
          > Справка </NavLink>
        </NavItem>
      </Nav>

      {isOpen && (
        <TabContent activeTab={activeTab} className="side-tab-content bg-white overflow-auto">
          <TabPane tabId="1" className="p-3"><PaperStyle /></TabPane>
          <TabPane tabId="2" className="p-3"><InsertComposition /><InsertText /></TabPane>
          <TabPane tabId="3" className="p-3"><HelpComponent /></TabPane>
        </TabContent>
      )}
    </div>
  );
};

export default SideSettingsPanel;
