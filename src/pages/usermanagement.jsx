import { useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

import {  useState,useRef } from "react"
//import { useReactToPrint } from "react-to-print"
import { useDispatch, useSelector } from "react-redux"

import { addUser,deleteUser,updateUser,getUser,deleteBunch } from "../features/userSlice";

export default function UserManagement() {

    useEffect(() => {
    const script = document.createElement("script");
    script.src = "/assets/js/scripts.bundle.js";
    script.async = true;
    script.onload = () => {
      if (window.KTApp && typeof window.KTApp.init === "function") {
        window.KTApp.init();
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); 
    };
  }, []);

  const dispatch=useDispatch();
    const {users}=useSelector((state=>state.user));

    const [selectedFilter,setSelectedFilter]=useState("show all");
    const [filteredData,setFilteredData]=useState([]);
    const [isModalOpen,setIsModalOpen]=useState(false);
    const [isShowModalOpen,setIsShowModalOpen]=useState(false);
    const [isEditModalOpen,setIsEditModalOpen]=useState(false);
    const [isDeleteModalOpen,setIsDeleteModalOpen]=useState(false);
    const [selectedUser,setSelectedUser]=useState({
        name:'',
        email:'',
        password:'',
        first_time:'',
        active:'',
        image:''||'No image available'
    });
    const [selectedUsers,setSelectedUsers]=useState({});
    const [startSelection,setStartSelection]=useState(false);
    const [formData,setFormData]=useState({
        name:'',
        email:'',
        password:'',
        first_time:'',
        active:'',
        image:''||'No image available'
    })
    const [searchItem,setSearch]=useState('');
    const [confPassword,setConfPassword]=useState('');
    const [userdata,setUserData]=useState([]);
    
    

    useEffect(() => {
      dispatch(getUser())
        .then((data) => {
          const dataitem = data.payload;
    console.log(dataitem)
          
          const normalizedData = Array.isArray(dataitem) ? dataitem : [dataitem];
          setUserData(normalizedData);
        })
        .catch((error) => {
          console.log('Error fetching data', error);
        });
    }, [dispatch, users]);

    useEffect(() => {
      console.log('userdata type check:', Array.isArray(userdata), userdata);
    }, [userdata]);

    const [currentPage,setCurrentPage]=useState(1);
    const itemsPerPage=5;

    const totalPages=Math.ceil(userdata.length/itemsPerPage);

    const lastItemIndex=currentPage*itemsPerPage;
    const firstItemIndex=lastItemIndex-itemsPerPage;
    console.log('bfr slice',userdata)
    

    const currentdata=Array.isArray(userdata)?userdata.slice(firstItemIndex,lastItemIndex):[userdata].slice(firstItemIndex,lastItemIndex);
    

    const nextPage=()=>{
        if(currentPage<totalPages){
            setCurrentPage(currentPage+1);
        }
    }

    const prevPage=()=>{
        if(currentPage>1){
            setCurrentPage(currentPage-1);
        }
    }

   

    useEffect(() => {
  if (selectedFilter === "show all") {
    setFilteredData(userdata);
  } else {
    const filtered = userdata.filter(
      (data) => data.role?.toLowerCase() === selectedFilter.toLowerCase()
    );
    setFilteredData(filtered);
  }
}, [selectedFilter, userdata]);


    const imageUploader=(e)=>{
        const file=e.target.files[0];
        if(file){
            const reader=new FileReader();
            reader.onloadend=()=>{
                setFormData({...formData,image:reader.result});
            }
            reader.readAsDataURL(file);
        }

    }
    

    const getDate=()=>{
        const now=new Date();
        return now.toISOString().split('T')[0]
    }

    const handleSaveUser = () => {    
        if (!formData.name || !formData.email || !formData.image || !formData.password) {
            alert('There are missing fields');
            return;
        } else {
            if (formData.password== confPassword) {
                dispatch(addUser({ FormData: formData, Date: getDate() }));
            } else {
                alert('Password mismatch');
                return;
            }
        }
        setIsModalOpen(false);
    }

    const handleUpdateUser=(Id)=>{
        dispatch(updateUser({ Id:Id,FormData: formData }))
        setIsEditModalOpen(false);
    }
    
    const handleDeleteUser=(id)=>{
        dispatch(deleteUser({id:id}))
        setIsDeleteModalOpen(false)
    }

    

    const handleSelectedRows = (rowId) => {
        setSelectedUsers((prev) => {
            const updatedSelection = {
                ...prev,
                [rowId]: !prev[rowId], 
            };
        const hasSelectedRows = Object.values(updatedSelection).some((isSelected) => isSelected);

        setStartSelection(hasSelectedRows); 

        return updatedSelection;
    })};

    const handleDeleteBunch=()=>{
        console.log(selectedUsers);
        dispatch(deleteBunch(selectedUsers));
    }

    const handleChange=(e)=>{
      setFormData({...formData,[e.target.name]:e.target.value});
      
  }


  return (
    <>
              <div className="d-flex flex-column flex-root app-root" id="kt_app_root">
              <div className="app-page flex-column flex-column-fluid" id="kt_app_page">
              
              <div className="app-wrapper" id="kt_app_wrapper">
                  <Sidebar />

                  <div className="main-content">
                  <Header />
                    {/* Toolbar */}
                    <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
                      <div
                        id="kt_app_toolbar_container"
                        className="app-container container-xxl d-flex flex-stack"
                      >
                        {/* Title and Breadcrumbs */}
                        <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
                          <h1 className="page-heading text-dark fw-bold fs-3 my-0">
                            User Management
                          </h1>
                          <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 pt-1">
                            <li className="breadcrumb-item text-muted">
                              <a
                                href="/"
                                className="text-muted text-hover-primary"
                              >
                                Home
                              </a>
                            </li>
                            <li className="breadcrumb-item">
                              <span className="bullet bg-gray-400 w-5px h-2px"></span>
                            </li>
                            <li className="breadcrumb-item text-muted">User Management</li>
                          </ul>
                        </div>

                        {/* Buttons */}
                        <div className="d-flex align-items-center gap-2 gap-lg-3">
                <a
                  href="#"
                  className="btn btn-sm fw-bold btn-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsModalOpen(true);
                  }}
                >
                  Add User
                </a>

                <a
                  href="#"
                  className={startSelection?"btn btn-sm fw-bold bg-body btn-color-gray-700 btn-active-color-primary":"hide"}
                  onClick={handleDeleteBunch}
                >
                  Delete Users
                </a>
              </div>

              {isModalOpen && (
                <div
                  className="modal fade show"
                  tabIndex="-1"
                  id="kt_modal_scrollable_1"
                  style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
                >
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Add User</h5>
                        
                      </div>

                  <fieldset>
                      <legend>User Details</legend>
                          <form className="p-5 bg-white rounded shadow-sm">
                              <div className="field-value mb-3">
                                  <label className="field">Username</label>
                                  <input type="text"
                                  className="value" 
                                  name="name"
                                  onChange={(e)=>handleChange(e)}
                                  required
                                  placeholder="Name"></input>
                              </div>
                              <br/>
                              <div className="field-value mb-3">
                                  <label className="field">Email</label>
                                  <input type="email" 
                                  className="value" 
                                  name="email" 
                                  onChange={(e)=>handleChange(e)} 
                                  required 
                                  placeholder="Email"></input>
                              </div>
                              <br/>
                              <div className="field-value mb-3">
                                  <label className="field">Role</label>
                                  <select name="role" value={formData.role} onChange={handleChange}>
            <option value="Human Resources">Human Resources</option>
            <option value="IT Assistant">IT Assistant</option>
            <option value="Employee">Employee</option>
          </select>
                              </div>
                              <br/>
                            
                              <div className="field-value mb-3" >
                                  <label className="field">Password</label>
                                  <input type="password"
                                  className="value" 
                                  name="password" 
                                  onChange={(e)=>handleChange(e)} 
                                  required
                                  placeholder="Password"></input>
                              </div>
                              <br/>
                              <div className="field-value mb-3">
                                  <label className="field">Confirm Password</label>
                                  <input type="password"
                                  name="confPassword" 
                                  className="value" 
                                  onChange={(e)=>setConfPassword(e.target.value)}
                                  required 
                                  placeholder="Confirm Password"></input>
                              </div>
                          </form>
                              
                  </fieldset>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Close
                    </button>
                    <button type="button" className="btn btn-primary" onClick={handleSaveUser}>
                      Save changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

            </div>
          </div>

          {/* Page content goes here */}
          <div id="kt_app_content" className="app-content flex-column-fluid">
          <div id="kt_app_content_container" className="app-container container-xxl">

          </div>
          <div className="table-responsive">
																
        {/*begin::Table Widget 4*/}
        <div className="card card-flush h-xl-100">
												{/*begin::Card header*/}
												<div className="card-header pt-7">
													{/*begin::Title*/}
													<h3 className="card-title align-items-start flex-column">
														<span className="card-label fw-bold text-gray-800">Users table</span>
														
													</h3>
													{/*end::Title*/}
													{/*begin::Actions*/}
													<div className="card-toolbar">
														{/*begin::Filters*/}
														<div className="d-flex flex-stack flex-wrap gap-4">
															{/*begin::Destination*/}
															<div className="d-flex align-items-center fw-bold">
																{/*begin::Label*/}
																<div className="text-gray-400 fs-7 me-2">Category</div>
																{/*end::Label*/}
																{/*begin::Select*/}
																<select
                                  className="form-select form-select-transparent text-gray-800 fs-base lh-1 fw-bold py-0 ps-3 w-auto"
                                  value={selectedFilter}
                                  onChange={(e) => setSelectedFilter(e.target.value)}
                                >
                                  <option value="show all">Show All</option>
                                  <option value="employee">Employee</option>
                                  <option value="human resources">HR</option>
                                  <option value="it assistant">IT</option>
                                </select>


																{/*end::Select*/}
															</div>
															{/*end::Destination*/}
															
															{/*begin::Search*/}
															<div className="position-relative my-1">
																{/*begin::Svg Icon | path: icons/duotune/general/gen021.svg*/}
																<span className="svg-icon svg-icon-2 position-absolute top-50 translate-middle-y ms-4">
																	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
																		<rect opacity="0.5" x="17.0365" y="15.1223" width="8.15546" height="2" rx="1" transform="rotate(45 17.0365 15.1223)" fill="currentColor" />
																		<path d="M11 19C6.55556 19 3 15.4444 3 11C3 6.55556 6.55556 3 11 3C15.4444 3 19 6.55556 19 11C19 15.4444 15.4444 19 11 19ZM11 5C7.53333 5 5 7.53333 5 11C5 14.4667 7.53333 17 11 17C14.4667 17 17 14.4667 17 11C17 7.53333 14.4667 5 11 5Z" fill="currentColor" />
																	</svg>
																</span>
																{/*end::Svg Icon*/}
																<input type="text" data-kt-table-widget-4="search" className="form-control w-150px fs-7 ps-12" placeholder="Search" onChange={(e)=>setSearch(e.target.value)}/>
															</div>
															{/*end::Search*/}
														</div>
														{/*begin::Filters*/}
													</div>
													{/*end::Actions*/}
												</div>
												{/*end::Card header*/}
												{/*begin::Card body*/}
												<div className="card-body pt-2">
													{/*begin::Table*/}
													<table className="table align-middle table-row-dashed fs-6 gy-3" id="kt_table_widget_4_table">
														{/*begin::Table head*/}
														<thead>
															{/*begin::Table row*/}
															<tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
																<th className="min-w-100px">#</th>
																<th className="text-end min-w-100px">Name</th>
																<th className="text-end min-w-125px">Email</th>
																<th className="text-end min-w-100px">Role</th>
																<th className="text-end min-w-100px">Action</th>
																
															</tr>
															{/*end::Table row*/}
														</thead>
														{/*end::Table head*/}
														{/*begin::Table body*/}
														<tbody className="fw-bold text-gray-600">
                            {Array.isArray(userdata) ? (
                        currentdata.length > 0 ? (
                          currentdata.filter((row)=>{
                            const matchSearch=searchItem.toLowerCase()===''?row:String(row.name).toLowerCase().includes(searchItem);
                            const matchFilter =
                        selectedFilter === 'show all' ||
                        row.role?.toLowerCase() === selectedFilter.toLowerCase();

                            return matchSearch&&matchFilter
                          })
                            .map((row, index) => {
                              
                              return (
                                <tr key={index} data-kt-table-widget-4="subtable_template">
                                  <td >
                                      {!selectedUsers[row.id]?<i className="bi bi-circle" onClick={()=>{handleSelectedRows(row.id)}}></i>:
                                                                            <i className="bi bi-check-circle-fill" onClick={()=>{handleSelectedRows(row.id)}}></i>     }
                                    </td>
                                    <td className="text-end">
                                      {row.name}
                                    </td>
                                    <td className="text-end">
                                      {row.email}
                                    </td>
                                    <td className="text-end">
                                      {row.role}
                                    </td>
                                    <td className="text-end">
                                    <span className="badge py-3 px-4 fs-7 badge-light-primary" onClick={()=>{setIsShowModalOpen(true),setSelectedUser(row)}}> <i className="bi bi-eye-fill"></i></span>

                                    {isShowModalOpen && (
                          
                          <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                          <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content p-5 bg-white rounded shadow-sm">
                            <fieldset>
                                    <legend>User Details</legend>
                                    <div className="field-value">
                                                                                    <label className="field">Name</label>
                                                                                    <p >{selectedUser.name}</p>
                                                                                </div>
                                                                                <br/>
                                                                                <div className="field-value">
                                                                                    <label className="field">Email</label>
                                                                                <   p >{selectedUser.email}</p>
                                                                                </div>
                                                                                <br/>
                                                                                
                                                                                <br/>
                                            
                                </fieldset>
                                <div className="modal-footer">
                                  <button
                                    type="button"
                                    className="btn btn-light"
                                    onClick={() => setIsShowModalOpen(false)}
                                  >
                                    Close
                                  </button>
                                  
                                </div>
                            </div>
                          </div>
                        </div>

                            
                          
                        )}
            
            <span className="badge py-3 px-4 fs-7 badge-light-warning" onClick={()=>{setIsEditModalOpen(true),setSelectedUser(row)}}><i className="bi bi-pencil-fill"></i></span>
                                                      {isEditModalOpen && (
                                            <div
                                              className="modal fade show"
                                              tabIndex="-1"
                                              id="kt_modal_scrollable_1"
                                              style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
                                            >
                                              <div className="modal-dialog">
                                                <div className="modal-content">
                                                  <div className="modal-header">
                                                    <h5 className="modal-title">Add User</h5>
                                                    
                                                  </div>

                                                  <fieldset>
                                                      <legend>Edit Details</legend>
                                                          <form className="p-5 bg-white rounded shadow-sm">
                                                              <div className="field-value">
                                                                  <label className="field">Username</label>
                                                                  <input type="text"
                                                                  className="value" 
                                                                  name="name"
                                                                  onChange={(e)=>handleChange(e)}
                                                                  required
                                                                  placeholder="Name"></input>
                                                              </div>
                                                              <br/>
                                                              <div className="field-value">
                                                                  <label className="field">Email</label>
                                                                  <input type="email" 
                                                                  className="value" 
                                                                  name="email" 
                                                                  onChange={(e)=>handleChange(e)} 
                                                                  required 
                                                                  placeholder="Email"></input>
                                                              </div>
                                                              <br/>
                                                              <div className="field-value">
                                                                  <label className="field">Role</label>
                                                                  <select name="role" value={formData.role} onChange={handleChange}>
                                            <option value="Human Resources">Human Resources</option>
                                            <option value="IT Assistant">IT Assistant</option>
                                            <option value="Employee">Employee</option>
                                          </select>
                                                              </div>
                                                              <br/>
                                                            
                                                              <div className="field-value" >
                                                                  <label className="field">Password</label>
                                                                  <input type="password"
                                                                  className="value" 
                                                                  name="password" 
                                                                  onChange={(e)=>handleChange(e)} 
                                                                  required
                                                                  placeholder="Password"></input>
                                                              </div>
                                                              <br/>
                                                              <div className="field-value">
                                                                  <label className="field">Confirm Password</label>
                                                                  <input type="password"
                                                                  name="confPassword" 
                                                                  className="value" 
                                                                  onChange={(e)=>setConfPassword(e.target.value)}
                                                                  required 
                                                                  placeholder="Confirm Password"></input>
                                                              </div>
                                                          </form>
                                                              
                                                  </fieldset>

                                                  <div className="modal-footer">
                                                    <button
                                                      type="button"
                                                      className="btn btn-light"
                                                      onClick={() => setIsEditModalOpen(false)}
                                                    >
                                                      Close
                                                    </button>
                                                    <button type="button" className="btn btn-primary" onClick={()=>handleUpdateUser(selectedUser.id)}>
                                                      Save changes
                                                    </button>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          )}
            <span className="badge py-3 px-4 fs-7 badge-light-danger" onClick={()=>{setSelectedUser(row),setIsDeleteModalOpen(true)}}><i className="bi bi-trash"></i></span>
                                                                  {isDeleteModalOpen && (
                                                        <div
                                                          className="modal fade show"
                                                          tabIndex="-1"
                                                          id="kt_modal_scrollable_1"
                                                          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
                                                        >
                                                          <div className="modal-dialog ">
                                                            <div className="modal-content " style={{textAlign:'center'}}>
                                                              <div className="modal-header">
                                                                
                                                                
                                                              </div>

                                                              <fieldset>
                                                                  <legend>User Details</legend>
                                                                  <p>Delete User?</p>
                                                                          
                                                              </fieldset>

                                                              <div className="modal-footer">
                                                              <button
                                                                  type="button"
                                                                  className="btn btn-light"
                                                                  onClick={() => handleDeleteUser(selectedUser.id)}
                                                                >
                                                                  Delete
                                                                </button>

                                                                <button
                                                                  type="button"
                                                                  className="btn btn-light"
                                                                  onClick={() => setIsDeleteModalOpen(false)}
                                                                >
                                                                  Close
                                                                </button>
                                                                
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      )}
                                                                  </td>
                                                                </tr>
                                                              );
                                                            })
                                                        ) : (
                                                          <tr><td colSpan="8">No data available</td></tr>
                                                        )
                                                      ) : (
                                                        <tr>
                                                          <td colSpan="8">No users found</td>
                                                        </tr>
                                                      )}



                            
															
														</tbody>
														{/*end::Table body*/}
													</table>
													{/*end::Table*/}
												</div>
												{/*end::Card body*/}
											</div>
											{/*end::Table Widget 4*/}
                                                                        </div>

          </div>
          <div className="pagination">
                            <button onClick={prevPage} disabled={currentPage === 1}>
                            <i className="bi bi-chevron-double-left"></i>
                            </button>
                            <span> Page {currentPage} of {totalPages} </span>
                            <button onClick={nextPage} disabled={currentPage === totalPages}>
                            <i className="bi bi-chevron-double-right"></i>
                            </button>
                        </div>
         <Footer/>
        </div>
						
						
      </div>
      
    </div>
    </div>
      
      
    </>
  );
}
