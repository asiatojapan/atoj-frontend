import React, { useState, useEffect } from 'react';
import Layout2 from '../core/Layout';
import  AdminMenu from "../user/AdminMenu";
import { isAuthenticated } from '../auth';
import { Link, Redirect, withRouter} from 'react-router-dom';
import { readStudent } from '../core/apiCore';
import { updateStudent, getCategories } from './apiAdmin';
import SiteWrapper from '../templates/SiteWrapper'
import {
  Container,
} from "tabler-react";


const UpdateStudent = ({ match, history }) => {
    const [values, setValues] = useState({
      name: '',
      studentid: '',
      gender: '',
      age: '',
      japanese: '',
      english: '',
      comments: '',
      university: '',
      major: '',
      faculty: '',
      it_skills: '',
      entry_timing: '',
      jlpt: '',
      github: '',
      education_bg: '',
      research: '',
      why_work_in_japan: '',
      internship: '',
      other_pr: '',
      video: '',
      categories_list: [],
      categories: [],
      loading: false,
      error: false,
      createdStudent: '',
      redirectToProfile: false,
      formData: ''
    });

    const [categories_list, setCategoriesList] = useState([]);
    const [defaultChecked, setDefaultChecked] = useState(false);

    const {
        name,
        studentid,
        loading,
        error,
        categories,
        createdStudent,
        redirectToProfile,
        formData
    } = values;

    const { user, token } = isAuthenticated();


    const init = studentId => {
        readStudent(studentId).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                // populate the state
                setValues({
                    ...values,
                    name: data.name,
                    studentid: data.studentid,
                    gender: data.gender,
                    age: data.age,
                    country: data.country,
                    japanese: data.japanese,
                    english: data.english,
                    comments: data.comments,
                    university: data.university,
                    major: data.major,
                    faculty: data.faculty,
                    it_skills: data.it_skills,
                    entry_timing: data.entry_timing,
                    jlpt: data.jlpt,
                    github: data.github,
                    education_bg: data.education_bg,
                    research: data.research,
                    why_work_in_japan: data.why_work_in_japan,
                    internship: data.internship,
                    other_pr: data.other_pr,
                    video: data.video,
                    categories: data.categories,
                    upload_fyp: data.upload_fyp,
                    formData: new FormData()
                });
                initCategories();
            }
        });
    };

    const initCategories = () => {
        getCategories().then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setCategoriesList(data);
            }
        });
    };


    useEffect(() => {
        init(match.params.studentId);
    }, []);

    const handleChange = name => event => {
          const value = name === 'upload_fyp' ? event.target.files[0] : event.target.value;
          formData.set(name, value);
          setValues({ ...values, [name]: value });
    };

    const [checked, setCheked] = useState([]);

    const defaultChecking = c => () => {
      const v = checked.indexOf(c._id === -1)
      const currentCategoryId = v;
      const newCheckedCategoryId = [...checked];

      if (currentCategoryId === -1) {
          newCheckedCategoryId.push(c);
      } else {
          newCheckedCategoryId.splice(currentCategoryId, 1);
      }
    }

    const handleToggle = c => () => {
        // return the first index or -1
        const v = checked.indexOf(c._id === -1)

        const currentCategoryId = v;
        const newCheckedCategoryId = [...checked];
        // if currently checked was not already in checked state > push
        // else pull/take off
        //  console.log(newCheckedCategoryId)
        if (currentCategoryId === -1) {
            newCheckedCategoryId.push(c);
        } else {
            newCheckedCategoryId.splice(currentCategoryId, 1);
        }
        // console.log(newCheckedCategoryId);
        setCheked(newCheckedCategoryId);
        setValues({
            ...values,
            categories: newCheckedCategoryId
        });
    };



    const clickSubmit = event => {
        event.preventDefault();
        setValues({ ...values, error: '', loading: true });

        updateStudent(match.params.studentId, user._id, token, formData).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setValues({
                    ...values,
                    name: '',
                    studentid: '',
                    gender: '',
                    age: '',
                    country: '',
                    japanese: '',
                    english: '',
                    comments: '',
                    university: '',
                    major: '',
                    faculty: '',
                    it_skills: '',
                    jlpt: '',
                    github: '',
                    education_bg: '',
                    research: '',
                    why_work_in_japan: '',
                    internship: '',
                    other_pr: '',
                    video: '',
                    loading: false,
                    error: false,
                    redirectToProfile: true,
                    createdStudent: data.name
                });
            }
        });
    };

    const newPostForm = () => (
      <form onSubmit={clickSubmit}>
      <div class="card">
        <div class="card-header">
         <h4 class="card-title">Add Student</h4>
        </div>
        <div class="card-body">
  
        <div class="mb-2">
            <label class="form-label">Name</label>
             <input type="text" onChange={handleChange("name")} value={name} name="name"  class="form-control"/>
          </div>
  
          <div class="mb-2">
            <label class="form-label">Student Id</label>
             <input type="text" onChange={handleChange("studentid")} value={values.studentid} name="name"  class="form-control"/>
          </div>
  
          <div class="mb-2">
            <label class="form-label">Age</label>
             <input type="text" onChange={handleChange("age")} value={values.age} name="Age"  class="form-control"/>
          </div>
  
          <div class="mb-2">
          <label class="form-label">Gender</label>
          <select class="form-label" placeholder="Select Gender" onChange={handleChange("gender")} value={values.gender} name="gender">
             <option value=""> Select </option>
             <option value="male"> Male </option>
             <option value="female">  Female </option>
             </select>
        </div>
  
          <div class="mb-2">
            <label class="form-label">Japanese</label>
             <select placeholder="Select Japanese level" onChange={handleChange("japanese")} value={values.japanese} name="japanese">
            <option value=""> Select </option>
            <option value="A"> A </option>
            <option value="B"> B </option>
            <option value="C"> C </option>
            <option value="D"> D </option>
            <option value="E"> E </option>
            </select> 
          </div>
  
          <div class="mb-2">
            <label class="form-label">JLPT</label>
             <select placeholder="Select JLPT" onChange={handleChange("jlpt")} value={values.jlpt} name="jlpt">
            <option value=""> Select </option>
            <option value="N1"> N1 </option>
            <option value="N2"> N2 </option>
            <option value="N3"> N3 </option>
            <option value="N4"> N4 </option>
            <option value="N5"> N5 </option>
            <option value="None"> None </option>
            </select>
         </div>
  
          <div class="mb-2">
            <label class="form-label">English</label>
            <select placeholder="Select English level" onChange={handleChange("english")} value={values.english} name="english">
            <option value=""> Select </option>
            <option value="A"> A </option>
            <option value="B"> B </option>
            <option value="C"> C </option>
            <option value="D"> D </option>
            <option value="E"> E </option>
            </select>  </div>
  
          <div class="mb-2">
            <label class="form-label">University</label>
             <input type="text" onChange={handleChange("university")} value={values.university} name="university"  class="form-control"/>
          </div>
  
  
          <div class="mb-2">
            <label class="form-label">Faculty</label>
             <input type="text" onChange={handleChange("faculty")} value={values.faculty} name="faculty"  class="form-control"/>
          </div>
  
  
          <div class="mb-2">
            <label class="form-label">Student Id</label>
             <input type="text" onChange={handleChange("major")} value={values.major} name="major"  class="form-control"/>
          </div>
  
  
          <div class="mb-2">
            <label class="form-label">It Skills</label>
             <input type="text" onChange={handleChange("it_skills")} value={values.it_skills} name="it_skills"  class="form-control"/>
          </div>
  
          <div class="mb-2">
            <label class="form-label">Entry Timing</label>
             <input type="text" onChange={handleChange("entry_timing")} value={values.entry_timing} name="entry_timing"  class="form-control"/>
          </div>
  
          <div class="mb-2">
            <label class="form-label">Comments</label>
             <input type="text" onChange={handleChange("comments")} value={values.comments} name="comments"  class="form-control"/>
          </div>
  
          <div class="mb-2">
            <label class="form-label">Video Url</label>
             <input type="text" onChange={handleChange("video")} value={values.video} name="video"  class="form-control"/>
          </div>
  
          <div class="mb-2">
            <label class="form-label">Github URL</label>
             <input type="text" onChange={handleChange("github")} value={values.github} name="github"  class="form-control"/>
          </div>
  
          <div class="mb-2">
            <label class="form-label">学歴備考</label>
             <input type="text" onChange={handleChange("education_bg")} value={values.education_bg} name="education_bg"  class="form-control"/>
          </div>
  
          <div class="mb-2">
            <label class="form-label">研究テーマ</label>
             <input type="text" onChange={handleChange("research")} value={values.research} name="research"  class="form-control"/>
          </div>
  
          <div class="mb-2">
            <label class="form-label">インターンシップ</label>
             <input type="text" onChange={handleChange("internship")} value={values.internship} name="internship"  class="form-control"/>
          </div>
  
          <div class="mb-2">
            <label class="form-label">日本で働きたい理由</label>
             <input type="text" onChange={handleChange("why_work_in_japan")} value={values.why_work_in_japan} name="why_work_in_japan"  class="form-control"/>
          </div>
  
          <div class="mb-2">
            <label class="form-label">その他PR</label>
             <input type="text" onChange={handleChange("other_pr")} value={values.other_pr} name="other_pr"  class="form-control"/>
          </div>
  
          <div class="mb-2">
            <label class="form-label">FYP</label>
            <input onChange={handleChange('upload_fyp')} type="file" name="upload_fyp"  />
            </div>
  
       
      </div>
    <div class="card-footer text-right">
                    <div class="d-flex">
                      <a class="btn btn-link" onClick={() => history.goBack()}>Cancel</a>
                      <button type="submit" class="btn btn-primary ml-auto">Submit</button>
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
        <div className="alert alert-info" style={{ display: createdStudent ? '' : 'none' }}>
            <h2>{`${createdStudent}`} is updated!</h2>
        </div>
    );

    const showLoading = () =>
        loading && (
            <div className="alert alert-success">
                <h2>Loading...</h2>
            </div>
        );

    const redirectUser = () => {
        if (redirectToProfile) {
            if (!error) {
                return <Redirect to="/admin/students" />;
            }
        }
    };

    const Style = {
      style: {
        borderBottom: "3px solid rgb(212, 212, 212)"
      }
    };

    return (
            <SiteWrapper>
              <Container>
                    {showSuccess()}
                    {showError()}
                    {newPostForm()}
                    {redirectUser()}
                    </Container>
            </SiteWrapper>
    );
};

export default withRouter(UpdateStudent);
