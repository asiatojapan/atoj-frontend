import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Card } from 'antd';
import  AddLike  from './AddLike';
import  AddFav  from './AddFav';
import { FaFileDownload } from 'react-icons/fa';
import { isAuthenticated } from '../auth';
import styled from 'styled-components'
import {PdfDocument} from "../pdf/PdfDocument";

const Card2 = ({student}) => {

  const Card = styled.a`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: auto;
  gird-gap: 1rem;
  background: #fff;
  `

  const { user, token } = isAuthenticated();

  return (
    <div class="card">
    <div class="card-header">
      {student.rec_users.indexOf(user._id)>-1 ? <div class="card-status bg-blue card-status-left"></div> : "" }
    <Link class="card-title" to={`/student/${student._id}`}>   {student.comments == null?  "" : student.comments.slice(50) }</Link>
    <div class="card-options">
      <AddFav student={student}/>
    </div>
    </div>
    <div class="card-body">
    <div class="table-responsive">
    <table class="table card-table table-vcenter">
    <tbody class>
    <tr class="">
    <td class="">
    {student.video == null?  "" : <div><iframe src={"https://player.vimeo.com/video/" + student.video.slice(-9) + "?autoplay=1&loop=1&autopause=0"} ></iframe> </div> }
    </td>
    <td class="d-none d-md-table-cell text-nowrap"><h6 class="h6 mt-0 mb-0">{student.studentid} </h6>{student.gender === "male" ? "男" : "女"} | {student.age}</td>
    <td class="d-none d-md-table-cell text-nowrap"><h6 class="h6 mt-0 mb-0">国籍</h6>{student.country === "" ? "nill" : student.country}</td>
    <td class="d-none d-md-table-cell text-nowrap"><h6 class="h6 mt-0 mb-0">大学</h6>{student.university === "" ? "nill": student.university}</td>
    <td class="d-none d-md-table-cell text-nowrap"><h6 class="h6 mt-0 mb-0">日本語</h6>{student.japanese === "" ? "nill": student.japanese}</td>
    <td class="d-none d-md-table-cell text-nowrap"><h6 class="h6 mt-0 mb-0">英語</h6>{student.english === "" ? "nill": student.english}</td>
    <td class="text-right"><strong><PdfDocument student={student}/></strong></td></tr>
    </tbody>
    </table>
    </div>
    </div>
    <div class="card-footer">
    <div class="tags">
    {student.it_skills.map((skill, i) => (
      <span class="tag expanded">{skill}</span>
      ))}
      <br/>
      {student.tags.map((skill, i) => (
        <span class="tag tag-azure">{skill}</span>
        ))}
      </div>
    </div>
    </div>

);
};

export default Card2;