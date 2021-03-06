import React, { useState, useEffect } from 'react';
import { isAuthenticates } from "../auth";
import { getInterviews, deleteInterview, deleteInterviewItem,  updateInterviewStatus,updateInterviewEventDay, massSendJd } from "./apiAdmin";
import SiteWrapper from '../templates/SiteWrapper'
import { useTable, useSortBy, useFilters, useGlobalFilter,useRowSelect } from 'react-table'
import matchSorter from 'match-sorter'
import { Link } from "react-router-dom";
import DropdownButton from 'react-bootstrap/DropdownButton';
import UpdateInterview from "./UpdateInterview";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import Table2 from 'react-bootstrap/Table';
import UpdateInterviewItem from "./UpdateInterviewItem";
import moment from 'moment'
import AddInterviewItem from "./AddInterviewItem";
import {
  Dropdown,
  Container,
} from "tabler-react";
import { API } from '../config';
import axios from 'axios';


const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef()
    const resolvedRef = ref || defaultRef

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    )
  }
)

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length

  return (

        <input
          value={globalFilter || ''}
          onChange={e => {
            setGlobalFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
          }}
          placeholder={`検索`}
          className="form-control" 
          style={{marginBottom: "1rem"}}
          />
  )
}

function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length

  return (
    <input
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      style={{width: "100%"}}
      placeholder={`Search ${count}`}
    />
  )
}

// This is a custom filter UI for selecting
// a unique option from a list
function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set()
    preFilteredRows.forEach(row => {
      options.add(row.values[id])
    })
    return [...options.values()]
  }, [id, preFilteredRows])

  // Render a multi-select box
  return (
    <select
      value={filterValue}
      style={{width: "100%"}}
      onChange={e => {
        setFilter(e.target.value || undefined)
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}

// This is a custom filter UI that uses a
// slider to set the filter value between a column's
// min and max values
function SliderColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the min and max
  // using the preFilteredRows

  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    preFilteredRows.forEach(row => {
      min = Math.min(row.values[id], min)
      max = Math.max(row.values[id], max)
    })
    return [min, max]
  }, [id, preFilteredRows])

  return (
    <>
      <input
        type="range"
        min={min}
        max={max}
        value={filterValue || min}
        onChange={e => {
          setFilter(parseInt(e.target.value, 10))
        }}
      />
      <button onClick={() => setFilter(undefined)}>Off</button>
    </>
  )
}

// This is a custom UI for our 'between' or number range
// filter. It uses two number boxes and filters rows to
// ones that have values between the two
function NumberRangeColumnFilter({
  column: { filterValue = [], preFilteredRows, setFilter, id },
}) {
  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    preFilteredRows.forEach(row => {
      min = Math.min(row.values[id], min)
      max = Math.max(row.values[id], max)
    })
    return [min, max]
  }, [id, preFilteredRows])

  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      <input
        value={filterValue[0] || ''}
        type="number"
        onChange={e => {
          const val = e.target.value
          setFilter((old = []) => [val ? parseInt(val, 10) : undefined, old[1]])
        }}
        placeholder={`Min (${min})`}
        style={{
          width: '70px',
          marginRight: '0.5rem',
        }}
      />
      to
      <input
        value={filterValue[1] || ''}
        type="number"
        onChange={e => {
          const val = e.target.value
          setFilter((old = []) => [old[0], val ? parseInt(val, 10) : undefined])
        }}
        placeholder={`Max (${max})`}
        style={{
          width: '70px',
          marginLeft: '0.5rem',
        }}
      />
    </div>
  )
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = val => !val

export const Table = function ({ columns, data, selectedRows, onSelectedRowsChange }) {

  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true
        })
      },
    }),
    []
  )

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  )

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    selectedFlatRows,
    state,
    rows,
    flatColumns,
    preGlobalFilteredRows,
    setGlobalFilter,
    } = useTable({
    columns,
    data,
    defaultColumn,
    initialState: {
        selectedRowPaths: selectedRows
      },
    filterTypes,
    },
   useFilters, useGlobalFilter, useSortBy,useRowSelect,
)

  useEffect(() => {
    onSelectedRowsChange(selectedFlatRows);
    }, [onSelectedRowsChange, selectedFlatRows]);

  // Render the UI for your table
  return (
    <div>
    <div style={{background:"#fff"}}>
    <Table2 bordered hover size="sm" style={{fontSize: "11px"}} cellspacing="0" {...getTableProps()}>
      <thead >
      {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())} style={{color: "#000", fontWeight: 400, fontSize: "10px"}}>
                  {column.render('Header')}
                  <span>{column.canFilter ? column.render('Filter') : null}
                  {column.isSorted ? (column.isSortedDesc ? ' ↑' : ' ↓') : ''}
                  </span>
                  </th>
               
              ))}
            </tr>
          ))}
        
      </thead>
      
      <tbody {...getTableBodyProps()}>
      {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
          )
        })}
        
      </tbody>
    </Table2>
    </div>

   
    </div>
  )
}

const ManageInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const { darwin_uid, darwin_myTk} = isAuthenticates();
  const [loading, setLoading] = useState(true)

  const loadInterviews = () => {
      getInterviews(darwin_uid, darwin_myTk).then(data => {
          if (data.error) {
              console.log(data.error);
          } else {
              setLoading(false);
              setInterviews(data);
          }
      });
  };

  const destroy = interviewId => {
      deleteInterview(interviewId, darwin_uid, darwin_myTk).then(data => {
          if (data.error) {
              console.log(data.error);
          } else {
              loadInterviews();
          }
      });
  };


  const destroyItem = (interviewId, itemId) => {
    deleteInterviewItem(interviewId, darwin_uid, darwin_myTk, itemId).then(data => {
        if (data.error) {
            console.log(data.error);
        } else {
            loadInterviews();
        }
    });
};

  const updateMyData = (rowIndex, columnId, value) => {
    setInterviews(old =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          }
        }
        return row
      })
    )
  }


const columns = React.useMemo(
   () => [
     // Let's make a column for selection
     {
       id: "selection",
       // The header can use the table's getToggleAllRowsSelectedProps method
       // to render a checkbox
       Header: ({ getToggleAllRowsSelectedProps }) => (
         <div>
           <input type="checkbox" {...getToggleAllRowsSelectedProps()} />
         </div>
       ),
       // The cell can use the individual row's getToggleRowSelectedProps method
       // to the render a checkbox
       Cell: ({ row }) => (
         <div>
           <input type="checkbox" {...row.getToggleRowSelectedProps()} />
         </div>
       )
     },

     {
      Header: 'Student',
      Filter: SelectColumnFilter,
      accessor: "students[0].studentid"
    },
    

    {
      Header: 'StudentName',
      Filter: "",
      accessor: (text, i) => <>
      <Link to={`/student/${text.students[0]._id}`}>{text.students[0].name}</Link>
      </>
    },

      {
        Header: 'Company',
        Filter: SelectColumnFilter,
        accessor: "companies[0].name"
      },
      {
        Header: 'Event',
        Filter: SelectColumnFilter,
        accessor: "eventDay"
      },
   
    {
      Header: 'Rank',
      accessor: "companyRank",
      Filter: SelectColumnFilter,
      },
      {
        Header: 'Rate',
        accessor: "companyRate",
        Filter: SelectColumnFilter,
        },
    { 
      Header: 'Interview',
      Filter: "",
      accessor: (text, i) =>
      <div>{text.interviewItems.length == null ? "" : 
        <div>{text.interviewItems.map((item, i) => 
        <div> {moment(item.event_day).format('YYYY/MM/DD')} [{item.time}]
            <br/>
            <UpdateInterviewItem interviewItemId={item._id} interviewId={text._id} /> {" "}
             <button className="linkButton" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) destroyItem(text._id, item._id) } } >
                Delete 
            </button>
            </div>)} 
        </div>}
      </div>
    },
    {
      Header: 'Status',
      accessor: "status",
      Filter: SelectColumnFilter,
      },
      {
        Header: 'Mail',
        Filter: "",
        accessor: (text) =>
        <> {text.mailSent ? "Yes": "No"} </>
      },
      {
        Header: 'Created At',
        accessor: (text) =>
        <div>
        { moment(text.createdAt).format('MM-DD-YY')}
        </div>,
        id: 'created_at',
        Filter: "",
      },
    {
      Header: "Actions",
      Filter: "",
      accessor: (text, i) =>
      <div>
      <DropdownButton id="btn-sm dropdown-primary-button" title="Actions" size="sm" variant="secondary">
       <Dropdown.Item to={`/admin/interview/${text._id}`}> View </Dropdown.Item>
        <Dropdown.Item> <AddInterviewItem interviewId={text._id} /></Dropdown.Item>
        <Dropdown.Item> <UpdateInterview interviewId={text._id} />
       </Dropdown.Item>
        <Dropdown.Item >  <a onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) destroy(text._id) } } >
                Delete
            </a></Dropdown.Item>
      </DropdownButton></div>
      ,
      filterable : true
    },

],

  []
);

const [selectedRows, setSelectedRows] = useState([]);

const selectedRowKeys = Object.values(selectedRows);

const [name, setName] = useState("");
const [error, setError] = useState(false);
 const [success, setSuccess] = useState(false)
 const data = interviews
 const [show, setShow] = useState(false);

 const handleClose = () => setShow(false); 
 const handleShow = () => setShow(true); 

 
 const sendMassMail = () => {
  massSendJd(selectedRows.map(
    d => d.original._id), darwin_uid, darwin_myTk ).then(data => {
      if (data.error) {
          setError(data.error);
      } else {
          setError("");
          setSuccess(true);
          window.location.reload();
      }
  });
};


const clickSubmit = e => {
  e.preventDefault();
  setError("");
  setSuccess(false);
  // make request to api to create category
  updateInterviewStatus(selectedRows.map(
    d => d.original._id), name, darwin_uid, darwin_myTk ).then(data => {
      if (data.error) {
          setError(data.error);
      } else {
          setError("");
          setSuccess(true);
          window.location.reload();
      }
  });
};

const clickSubmit1 = e => {
  e.preventDefault();
  setError("");
  setSuccess(false);
  // make request to api to create category
  updateInterviewEventDay(selectedRows.map(
    d => d.original._id), name, darwin_uid, darwin_myTk ).then(data => {
      if (data.error) {
          setError(data.error);
      } else {
          setError("");
          setSuccess(true);
          window.location.reload();
      }
  });
};


const handleChange = e => {
  setError("");
  setName(e.target.value);
};


 useEffect(() => {
      loadInterviews();
  }, []);

    return (
      <SiteWrapper>
           <div class="loading" style={{ display: loading ? "" : "none" }}>
          <div class="loaderSpin"></div>
      </div>
        <Container>
      <div class="card-header"><h3 class="card-title"> Interviews </h3>
      <Button className="btn btn-sm btn-secondary ml-2" variant="primary" onClick={handleShow}>
       Status　変更
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton> Status　変更
        </Modal.Header>
        <Modal.Body>
        <div class="btn-list">
        <form onSubmit={clickSubmit}>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <select onChange={handleChange} value={name} className="form-control">
                    <option>Please select</option>
                    <option value="選考">選考</option>
                    <option value="テスト">テスト</option>
                    <option value="辞退">辞退</option>
                    <option value="終了">終了</option>

          </select>
            </div>
            <button className="btn btn-primary">Update Phase</button>
        </form>
          </div>
        </Modal.Body>
      </Modal>
      <div className="card-options">
        {success ? <div>Sent!</div> : null} 
       <button className="btn btn-primary btn-sm" onClick={()=>  { if (window.confirm('Are you sure?')) sendMassMail() }} >Send JD to Students</button>
       </div>
      </div>
      <Table columns={columns} data={data} selectedRows={selectedRows} updateMyData={updateMyData} onSelectedRowsChange={setSelectedRows}/>
      </Container>
    </SiteWrapper>
    );
};

export default ManageInterviews;
