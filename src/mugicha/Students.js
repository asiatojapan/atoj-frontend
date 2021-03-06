import React, { useState, useEffect } from 'react';
import NavMugicha from "./Nav"
import { Link } from 'react-router-dom';
import { getStudentsParticipating, getCurrentInterviewsByStudents } from './apiMugicha';
import { isAuthenticates } from "../auth";
import moment from "moment";
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Tabs from 'react-bootstrap/Tabs';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';

const Students = ({  match }) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const { darwin_uid, darwin_myTk } = isAuthenticates();
    const [interviews, setInterviews] = useState([]);


    const loadInterviews = () => {
        getCurrentInterviewsByStudents(darwin_uid, darwin_myTk).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                setInterviews(data);
            }
        });
    };

    const resultInNice = (result) => {
        if (result === "Nil") {
            return ""
        }
        else if (result === "合格") {
            return "●"
        }
        else if (result === "不合格") {
            return "X"
        }
        else if (result === "三角") {
            return "▲"
        }
        else if (result === "辞退") {
            return "辞退"
        }
        else if (result === "内定") {
            return "内定"
        }
        else {
            return ""
        }
    }
  

    const loadStudents = () => {
        getStudentsParticipating(darwin_uid, darwin_myTk).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                setStudents(data);
                setLoading(false);
            }
        });
    };

    useEffect(() => {
        loadStudents();
        loadInterviews();
    }, []);
    
    

    return (
        <>  
          <NavMugicha>
          <div className="loading" style={{ display: loading ? "" : "none" }}>
            <div className="loaderSpin"></div>
        </div>

    
        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
  <Row>
    <Col sm={2}>
      <Nav variant="pills" className="flex-column">
        <Nav.Item>
          <Nav.Link eventKey="first" class="btn">Listing</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="second">All </Nav.Link>
        </Nav.Item>
      </Nav>
    </Col>
    <Col sm={10}>
      <Tab.Content>
        <Tab.Pane eventKey="first">
        <div class="card">
            <div class="table-responsive">
        <table class="table table-vcenter card-table">
                <thead>
                    <tr>
                    <th>学生 ID </th>
                    <th>学生 </th>
              
                    <th>Status</th>
                   <th></th>
                    </tr>
                </thead> {students.map((student, i) => 
                <tbody>
                <td>
                <Link to={`/student/${student._id}`} target="_blank" >  {student.studentid} </Link>   
                </td>
                <td>
               {student.name}
                </td>
                <td>
              
               {student.inviteStatus}
                </td>
                <td>
                <Link to={`/mugicha/student/${student._id}`} >  Interview List  </Link>  </td>

         </tbody>)}
        </table>
        </div>
        </div>
        </Tab.Pane>
        <Tab.Pane eventKey="second">
        
        {interviews.map((interview, i) =>  
              <div className="list-list" style={{padding: "0px"}}>
              <div className="card-header">
                  <div className="card-title"> 
                  {interview._id[0].studentid} {interview._id[0].name}</div>
                </div>
                <div className="card-body">
                 <div class="table-responsive-sm">
        
                 <table class="table table-bordered">
                 <thead>
                     <tr>
                     <th style={{width: "25%"}}>企業</th>
                     <th>時間</th>
         
                     </tr>
                 </thead>
                 <tbody>
              
                
                {interview.interview.map((items, i) =>
                 <tr><td>{items.company[0].name}</td>
                 <td> {items.interviewItems.map((iItems, ii) => 
                    <>   {iItems.time_period === "1日"　? <span class="badge badge-primary mr-4">1日</span>:<span class="badge badge-danger mr-4">2日</span>} 
                     {moment(iItems.event_day).format("MM-DD")} / {iItems.time} {"   "}
                    {resultInNice(iItems.result)} 
                    {ii != (items.interviewItems.length-1) ?  <hr style={{"margin": "8px 0"}} /> : ''}
                     </>
                  )}</td>
                  </tr>
                )}
                    
               
              
        </tbody>
        </table>    
        </div> </div> </div> )}
        </Tab.Pane>
      </Tab.Content>
    </Col>
  </Row>
</Tab.Container>
       


        </NavMugicha>
      </>
    );
  }
  
  export default Students;