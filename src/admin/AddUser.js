import React, { useState, useEffect } from 'react';
import { isAuthenticated } from '../auth';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { signup } from '../auth';
import { getSalesRep } from "./apiAdmin";
import SiteWrapper from '../templates/SiteWrapper'
import {
  Page,
  Dropdown,
  Icon,
  Grid,
  Card,
  Text,
  Alert,
  Progress,
  Container,
  Badge,
} from "tabler-react";

const AddUser = ({history}) => {
    const [values, setValues] = useState({
      name: '',
      email: '',
      password: '',
      role: '',
      phase: "",
      round: "",
      sales_rep: "",
      users: [],
      error: false,
      success: false,
      redirectToProfile: false
    });

    const [users, setUsers] = useState([]);

    const { name, email, password, role, phase, round, sales_rep, error, success, redirectToProfile } = values;

    const handleChange = name => event => {
        setValues({ ...values, error: false, [name]: event.target.value });
    };

    const initUsers = () => {
        getSalesRep().then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setUsers(data);
            }
        });
    };

    useEffect(() => {
        initUsers();
    }, []);


    const clickSubmit = event => {
        event.preventDefault();
        setValues({ ...values, error: false });
        signup({ name, email, password, role, round, sales_rep }).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error, success: false });
            } else {
                setValues({
                    ...values,
                    name: '',
                    email: '',
                    password: '',
                    error: '',
                    role: "",
                    round: "",
                    sales_rep: "",
                    redirectToProfile: true,
                    success: true
                });
            }
        });
    };

    const signUpForm = () => (
        <form>
        <div class="card">
        <div class="card-header">
         <h4 class="card-title">Add User</h4>
        </div>
        <div class="card-body">

          <div class="mb-2">
            <label class="form-label">Name</label>
            <input onChange={handleChange('name')} type="text" class="form-control" value={name} />
          </div>

          <div class="mb-2">
            <label class="form-label">Email</label>
            <input onChange={handleChange('email')} type="text" class="form-control" value={email} />
          </div>

          <div class="mb-2">
            <label class="form-label">Password</label>
            <input onChange={handleChange('password')} type="password" class="form-control" value={password} />
          </div>
          <div class="mb-2">
              <div class="form-label">営業担当</div>
              <select placeholder="営業" onChange={handleChange("sales_rep")} value={sales_rep} class="form-control">
                {users && users.map((c, i) => (
                    <option key={i} value={c._id}>
                          {c.name}
                    </option>))}
                </select>
          </div>
          <div class="mb-2">
              <div class="form-label">Role</div>
              <select placeholder="Role" onChange={handleChange("role")} value={role}  class="form-control">
                <option value=""> Select </option>
                <option value="0"> User </option>
                <option value="1"> Admin </option>
                </select>
          </div>

          <div class="mb-3">
              <div class="form-label">Phase</div>
              <select placeholder="Phase" onChange={handleChange("round")} value={round}　class="form-control">
              <option value=""> Select </option>
              <option value="Phase I"> Phase I </option>
              <option value="Phase II"> Phase II </option>
              <option value="Phase III"> Phase III </option>
              <option value="Phase IV"> Phase IV </option>
                </select>
          </div>

          </div>
          <div class="card-footer text-right">
              <div class="d-flex">
                <a class="btn btn-link" onClick={() => history.goBack()}>Cancel</a>
              <button type="submit" onClick={clickSubmit} class="btn btn-primary ml-auto">Submit</button>
          </div>
          </div>
            </div>
        </form>
    );

    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    );

    const showSuccess = () => (
        <div className="alert alert-info" style={{ display: success ? '' : 'none' }}>
            New account is created!
        </div>
    );

    const redirectUser = () => {
        if (redirectToProfile) {
            if (!error) {
                return <Redirect to="/admin/users" />;
            }
        }
    };

    return (
      <SiteWrapper>
      <Page.Content>
      <Grid.Row>
      <Grid.Col width={12}>
            {showSuccess()}
            {showError()}
            {signUpForm()}
            </Grid.Col>
            </Grid.Row>
            </Page.Content>
        </SiteWrapper>
    );
};

export default withRouter(AddUser);
