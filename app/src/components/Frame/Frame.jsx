import React, { useState } from 'react'
import classNames from 'classnames'
import { Container, Sidebar, Sidenav, Content, Nav } from 'rsuite'
import { Outlet } from 'react-router-dom'
import NavToggle from './NavToggle'
import Header from '../Header'
import NavLink from '../NavLink'
import Brand from '../Brand'
import _ from 'lodash'

const NavItem = ({ title, eventKey, ...rest }) => (
  <Nav.Item eventKey={eventKey} as={NavLink} {...rest}>
    {title}
  </Nav.Item>
)

const Frame = ({ navs }) => {

  const [expand, setExpand] = useState(false)
  const [hoverExpand, setHoverExpand] = useState(false)
 
  const Authorization = JSON.parse(localStorage.getItem("Authorization"))
  const userRules = Authorization?.user?.rules || []

  const handleMouseEnter = () => {
    if (!expand) setHoverExpand(true)
  }

  const handleMouseLeave = () => {
    if (!expand) setHoverExpand(false)
  }

  const containerClasses = classNames('page-container', {
    'container-full': !expand
  })

  const navBodyStyle = expand || hoverExpand ? { height: 'calc(100vh - 112px)', overflow: 'auto' } : {}

  const filteredNavs = _.cloneDeep(navs)
  .map((item) => {
    
    if (!item?.children && !item.ruleId) return item

    if ((!item?.children) && (_.includes(userRules, item.ruleId))) return item

      const children = _.filter(item.children, (subItem) => {

      return userRules.includes(subItem.ruleId)
    })

    return _.size(children) > 0 ? { ...item, children } : null

  })
  .filter(Boolean)

  return (
    <Container className="frame" style={{ height: '100vh', overflow: 'hidden', display: 'flex' }}>
      <Sidebar style={{ display: 'flex', flexDirection: 'column', height: '100vh', borderRight: hoverExpand && !expand ? '0.1px solid #ddd' : 'none', overflow: 'hidden', zIndex: 1000 }} width={expand || hoverExpand ? 260 : 56} collapsible onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <Sidenav.Header>
          <Brand />
        </Sidenav.Header>
        <Sidenav expanded={expand || hoverExpand} appearance="subtle">
          <Sidenav.Body style={navBodyStyle}>
            <Nav>
              {filteredNavs.map(item => (
                item.children ? (
                  <Nav.Menu key={item.eventKey} placement="rightStart" trigger="hover" {...item}>{item.children.map(child => (<NavItem key={child.eventKey} {...child} />))}</Nav.Menu>) : (<NavItem key={item.eventKey} {...item} />)
              ))}
            </Nav>
          </Sidenav.Body>
        </Sidenav>
        <NavToggle expand={expand} onChange={() => setExpand(!expand)} />
      </Sidebar>

      <Container className={containerClasses} style={{ height: '100vh', overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />
        <Content style={{ flex: 1, overflow: 'auto' }}>
          <Outlet />
        </Content>
      </Container>

    </Container>
  )

}

export default Frame