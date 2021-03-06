import React, { useState, useEffect } from "react";
import { isAuthenticates } from "../auth";
import { createFav, destroyFav } from "./apiCore";
import 'react-toastify/dist/ReactToastify.css';

import {notify} from 'react-notify-toast';
import { connect } from "react-redux";
import { logout } from "../actions/session";

const mapStateToProps = ({ session }) => ({
  session
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
});


const AddFav = ({student, setFavCount, favCount, session})  => {
    const [ fav, setFav ] = useState(false);
    const { darwin_myTk, darwin_uid } = isAuthenticates();

    const findFound = () => {
      const found = student.favorites.some(el => el === darwin_uid)
      if (found) {
        setFav(true)
         }
      else {
        setFav(false)
      };
    }

    useEffect(() => {
        findFound()
    }, []);

    
    const FavToast = () => {
      const remainder = new Number(11  - favCount)

      const text = (!(remainder < 1) )?　"10%OFF まであと "　+ remainder + " 名" : "12名選抜して頂きましたので成功報酬費用より 10% OFFいたします！"

      function rangeToPercent(number, min, max){
        if (((number - min) / (max - min) * 100) > 100) {
          return 100
        }
        else {
          return ((number - min) / (max - min) * 100)
        }
      }

      let myColor = { width: "100%", background: '#278bfa',text: "#fff", borderRadius: "20px", boxShadow: "1px 3px 1px #9E9E9E", };
      notify.show(
          <div style={{fontSize: "16px", margin: "10px 10px",  }}>
            <b>{text}</b> 
            {/*<div className="progress">
            // <div className="progress-bar" role="progressbar" style={{width: rangeToPercent(favCount+1, 0, 12) + "%"}}> </div>
      // </div> */}
          </div>, "custom", 3000, myColor
        );
  }


    const clickSubmit = e => {
        setFavCount(favCount + 1)
        if (session.specialPlan !== true && session.role === 0) 
        {FavToast(favCount)}
        e.preventDefault();
        setFav(true)
        createFav(student._id, darwin_uid, darwin_myTk);
    };

    const clickDelete = e => {
        if (session.specialPlan !== true  &&  session.role === 0) 
        {setFavCount(favCount - 1)}
        e.preventDefault();
        setFav(false)
        // make request to api to create category
        destroyFav(student._id, darwin_uid, darwin_myTk);
    };

    const text = fav ? '検討リスト追加済' : '検討リスト追加'

    const newLikeForm = () => {
          return (
      <div>
        {fav && (
           <button className="unlikeBtn fixedWidth" onClick={ clickDelete } href="#0"> 
          <i className="fa fa-star" style={{marginRight: "5px"}}></i> {text} </button>
        )}
        {!fav && (
           <button className="likeBtn fixedWidth" onClick={ clickSubmit } href="#0"> 
           <i className="fa fa-star-o" style={{marginRight: "5px"}}></i> {text} </button>
        )}

      

      </div>)
    };

    return (
            <div>
              {newLikeForm()}
            </div>
    );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddFav);
