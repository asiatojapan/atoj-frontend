import React, { useState } from "react";
import {Card, Checkbox } from 'antd';

const ItCheckbox = ({ it_skills, handleFilters }) => {
    const [checked, setCheked] = useState([]);

    const handleToggle = c => () => {
        // return the first index or -1
        const currentCategoryId = checked.indexOf(c);
        const newCheckedCategoryId = [...checked];
        // if currently checked was not already in checked state > push
        // else pull/take off
        if (currentCategoryId === -1) {
            newCheckedCategoryId.push(c);
        } else {
            newCheckedCategoryId.splice(currentCategoryId, 1);
        }
        console.log(newCheckedCategoryId);
        setCheked(newCheckedCategoryId);
        handleFilters(newCheckedCategoryId);
    };

    return it_skills.map((c, i) => (
<label class="form-selectgroup-item">
  <input  class="form-selectgroup-input" type="checkbox" onChange={handleToggle(c.name)} id={c.name} value={c.name}/>
<span class="form-selectgroup-box">{c.name}</span>
</label>


    ));
};

export default ItCheckbox;
