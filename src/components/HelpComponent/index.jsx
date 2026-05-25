import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Table, Nav, NavItem, NavLink, Badge } from 'reactstrap';

const HelpComponent = () => {
  const [activeTab, setActiveTab] = useState('1');
  const { symbols, optionsHotkeys, pitchHotkeys } = useSelector(state => state.symbols);
  const tabs = [
    { id: '1', name: 'Знамёна', data: symbols },
    { id: '2', name: 'Указ-ные', data: optionsHotkeys },
    { id: '3', name: 'Высотные', data: pitchHotkeys },
  ];

  const ssymbols = useMemo(() => {
    const activeTabObj = tabs.find(t => t.id === activeTab);
    const data = activeTabObj ? activeTabObj.data : [];

    let result = [];

    if (Array.isArray(data)) {
      result = data.map(item => ({
        name: item.name || 'Без названия',
        hotkey: Array.isArray(item.hotkey) ? item.hotkey[0] : (item.hotkey || '—')
      }));
    } 
    else if (data && typeof data === 'object') {
      result = Object.entries(data).map(([name, keys]) => ({
        name: name,
        hotkey: Array.isArray(keys) ? keys[0] : (keys || '—')
      }));
    }

    return result.sort((a, b) => a.name.localeCompare(b.name));
    
  }, [activeTab, symbols, optionsHotkeys, pitchHotkeys]);

  return (
    <div className="help-table-container p-3">
      <h6 className="mb-3" style={{ color: '#0000ff', fontWeight: 'bold', fontSize: '14pt' }}>
        Список горячих клавиш
      </h6>
      
      <Nav tabs className="mb-0">
        {tabs.map(tab => (
          <NavItem key={tab.id}>
            <NavLink
              className={activeTab === tab.id ? 'active' : ''}
              style={{ cursor: 'pointer' }}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.name}
            </NavLink>
          </NavItem>
        ))}
      </Nav>

      <Table hover responsive size="sm" className="align-middle border border-top-0">
        <thead className="table-light">
          <tr>
            <th className="ps-3">Название</th>
            <th className="text-center">Клавиша</th>
          </tr>
        </thead>
        <tbody>
          {ssymbols.length > 0 ? (
            ssymbols.map((symbol, index) => (
              <tr key={index}>
                <td className="ps-3" style={{ fontSize: '0.9rem' }}>{symbol.name}</td>
                <td className="text-center">
                  <Badge 
                    color="light" 
                    className="text-dark border" 
                    style={{ fontSize: '12pt', minWidth: '40px', fontWeight: 'normal' }}
                  >
                    {symbol.hotkey}
                  </Badge>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="text-center p-4 text-muted">Нет данных</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default HelpComponent;
