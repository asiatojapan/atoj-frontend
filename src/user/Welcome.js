import React from "react";
import ReactDOM from "react-dom";
import SiteWrapper from "../templates/SiteWrapper";

const Welcome = () => {


  return (
    <SiteWrapper>
        <div className="page" style={{height: "100vh"}}>
       <div class="page-single">
            <div class="container">
                <div class="row">
                    <div class="col mx-auto">
                    <h1>Your access has expired.
                      <br/>Please register with us</h1>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </SiteWrapper>
  );
}

export default Welcome;
