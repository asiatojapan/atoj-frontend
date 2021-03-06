import React, { useState, Fragment } from "react";
import { withRouter } from "react-router-dom";
import { signout, isAuthenticates } from "../auth";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Dropdown from 'react-bootstrap/Dropdown';
import logo from './Logo.png'
import Drawer from './Drawer'
import { connect } from "react-redux";
import { logout } from "../actions/session";

const mapStateToProps = ({ session }) => ({
  session
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
});

const SiteWrapper = ({ logout, session, history, children }) => { 

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawers = (filters) => {
    console.log(filters)
    setIsDrawerOpen(!isDrawerOpen);
};

  
return (
<Fragment> 
    {isAuthenticates() && (
      <Navbar expand="lg" style={{backgroundColor: "#fff", boxShadow: "0 2px 4px 0 rgba(76,76,75,.1)"}}>
        <Navbar.Brand href="/">
          <img
          alt=""
          src={logo}
          height="30"
          className="d-inline-block align-top"
        />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav"> 
          <Nav className="mr-auto">
          {isAuthenticates() && (
              <Fragment> 
            <Nav.Link href={`/`} >Home </Nav.Link>
            { isAuthenticates() && (session.role !== 4 && session.role !== 3 && session.role !== 2 ) && 
           ( <>
            <Nav.Link href="/user/interviews">面接予定学生</Nav.Link> 
            <Nav.Link target="_blank" href="http://asiatojapan.com/wp-content/uploads/2021/01/利用マニュアル_Study-Go-Work-JAPAN.pdf">利用マニュアル</Nav.Link>
            <Nav.Link target="_blank" href="http://asiatojapan.com/wp-content/uploads/2020/10/%E3%83%95%E3%82%A9%E3%83%AD%E3%83%BC%E9%9D%A2%E8%AB%87%E4%BB%98%E3%81%8D%E5%86%85%E5%AE%9A%E8%80%85%E5%90%91%E3%81%91%E6%97%A5%E6%9C%AC%E8%AA%9E%E5%AD%A6%E7%BF%9220201012.pdf">内定者フォロー</Nav.Link>
            <Nav.Link target="_blank" href="http://asiatojapan.com/wp-content/uploads/2020/12/ITスキル診断コンテスト_CODE-TO-JAPANご説明_20201204-compressed.pdf">CODE TO JAPAN</Nav.Link>
            
            </>
           )}
        
             </Fragment>
             )}
          </Nav>
        
          <Nav>  
 
          {isAuthenticates() && session.role === 1 && (
          <NavDropdown title={session.name} id="basic-nav-dropdown">
              <Dropdown.Header style={{fontWeight: "700", color:"#000"}}> {session.name} </Dropdown.Header>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/admin/students">All Students</NavDropdown.Item>
              <NavDropdown.Item href="/admin/users">All Users</NavDropdown.Item>
              <NavDropdown.Item href="/admin/interviews">All Interviews</NavDropdown.Item>
              <NavDropdown.Divider /> 
              <NavDropdown.Item href="/admin/search">
              検索</NavDropdown.Item>
              <NavDropdown.Item href="/admin/jobs">
              Jobs</NavDropdown.Item>
              <NavDropdown.Divider /> 
              <NavDropdown.Item href="/mugicha">Mugicha</NavDropdown.Item>
              <NavDropdown.Item href="/admin/history">History</NavDropdown.Item>
              <NavDropdown.Item href="/admin/recorded"> 推薦済み</NavDropdown.Item>
              <NavDropdown.Item href="/admin/recommends">Current 推薦 </NavDropdown.Item>
              <NavDropdown.Item href="/admin/prerecommends">Current 予約 </NavDropdown.Item>
           
            </NavDropdown>
            )}
            </Nav>
            {session.role !== 1 && (<Nav style={{margin: "0px 10px"}}>{session.name}</Nav>)}
            { isAuthenticates() && session.role === 4 && (
           <a className="unlikeBtn smaller" href="/mugicha" style={{marginRight: "10px"}}>麦茶
           </a>
            )}

           
            {isAuthenticates() && session.role !== 2 && session.role !== 4 && (
            <a className="unlikeBtn smaller" href="/checkout/preview" style={{marginRight: "10px"}}> 検討リスト
            </a>)}
            <button className="likeBtn smaller"
                  onClick={() =>
                          signout(() => {
                              history.push("/");})}
                  >  Log Out
            </button>
        </Navbar.Collapse>
      </Navbar> )}
      <div style={{padding: "2rem 0rem 3rem 0rem"}}>
      {children}
      </div>
</Fragment>
)}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(SiteWrapper));
