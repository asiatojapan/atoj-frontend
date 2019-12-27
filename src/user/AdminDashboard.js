import React, { useState, useEffect }  from "react";
import { isAuthenticated, getUser } from "../auth";
import { readStudent } from "../core/apiCore";
import LikedStudents from "./LikedStudents";
import { Link } from "react-router-dom";
import  AdminMenu from "./AdminMenu";
import { Descriptions, Badge, Card, Col, Row  } from 'antd';
import "../styles.css";

const AdminDashboard = () => {
    const {
        user: { _id, name, email, role }
    } = isAuthenticated();

    const { user } = isAuthenticated();

    const [ likedstudents, setLikedstudents ] =  useState([]);


    const init = userId => {
        getUser(userId).then(data => {
            setLikedstudents(data.liked_students);
        });
    };


    useEffect(() => {
        init(user._id);
    }, []);

    const gridStyle = {
      width: '25%',
      textAlign: 'center',
    };

    const adminLinks = () => {
        return (
            <div className="card">
                <h4 className="card-header">Admin Links</h4>
                <ul className="list-group">
                    <li className="list-group-item">
                        <Link className="nav-link" to="/admin/create/student">
                            Create Student
                        </Link>
                    </li>
                    <li className="list-group-item">
                        <Link className="nav-link" to="/admin/students">
                            View Students
                        </Link>
                    </li>
                    <li className="list-group-item">
                        <Link className="nav-link" to="/admin/products">
                            Manage Products
                        </Link>
                    </li>
                </ul>
            </div>
        );
    };


    return (
      <AdminMenu>
        <Descriptions title="User Profile" bordered>
             <Descriptions.Item label="Name" span={3}>{name}</Descriptions.Item>
             <Descriptions.Item label="Email" span={3}>{email}</Descriptions.Item>
             <Descriptions.Item label="Role" span={3}>{role === 1 ? "Admin" : "Registered User"}</Descriptions.Item>
             </Descriptions>

              <div style={{ paddingTop: '5rem' }}>
              <Card title="Liked Students">
              {likedstudents.map((s, i) => (
                    <Card.Grid style={gridStyle}>
                    <LikedStudents id={likedstudents[i]}/>
                    </Card.Grid>
              ))}
             </Card>
          </div>
      </AdminMenu>
    );
};

export default AdminDashboard;
