/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { BACKEND_BASE_URL } from '../../../url';
import { ToastContainer, toast } from 'react-toastify';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Backdrop from '@mui/material/Backdrop';
import Paper from '@mui/material/Paper';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useSpring, animated, to } from '@react-spring/web';
import axios from 'axios';
import CheckIcon from '@mui/icons-material/Check';
import './css/SubCategory.css'
import { FormControl, InputLabel, MenuItem, Select, TablePagination } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AlarmIcon from '@mui/icons-material/Alarm';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';

const Fade = React.forwardRef(function Fade(props, ref) {
    const {
        children,
        in: open,
        onClick,
        onEnter,
        onExited,
        ownerState,
        ...other
    } = props;
    const style = useSpring({
        from: { opacity: 0 },
        to: { opacity: open ? 1 : 0 },
        onStart: () => {
            if (open && onEnter) {
                onEnter(null, true);
            }
        },
        onRest: () => {
            if (!open && onExited) {
                onExited(null, true);
            }
        },
    });

    return (
        <animated.div ref={ref} style={style} {...other}>
            {React.cloneElement(children, { onClick })}
        </animated.div>
    );
});

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
function SubCategory() {
    const [open, setOpen] = useState(false);
    const [tab, setTab] = React.useState(null);
    const [searchWord, setSearchWord] = React.useState();
    const [dataSearch, setDataSearch] = React.useState();
    const [editIndex, setEditIndex] = React.useState(-1);
    const [categoryName, setCategoryName] = useState('');
    const [reloadData, setReloadData] = useState(Date.now());
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [categoryRank, setCategoryRank] = useState('');
    const [mainCategoryId, setMainCategoryId] = useState();
    const [mainCategoryName, setMainCategoryName] = useState('')
    const [openTime, setOpenTime] = useState(false);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [time, setTime] = useState({ from: null, to: null });
    const [totalRows, setTotalRows] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [page, setPage] = React.useState(0);
    const [temp, setTemp] = useState('');
    const [timeFeilds, setTimeFeilds] = useState(false)
    const [variantFields, setVariantFields] = React.useState([]);
    const [categoryId, setCategoryId] = useState('');
    const [timeEdit, setTimeEdit] = useState(false);
    const [timeEditName, setTimeEditName] = useState('');
    const [viewMode, setViewMode] = useState(false);
    const [categoryUpdatePopUp, setCategoryUpdatePopUp] = useState(false)
    const [categoryUpdateName, setCategoryUpdateName] = useState()
    const [categoryUpdateData, setCategoryupdatData] = useState();
    const [categoryUpdateMenuName, setCategoryUpdateMenuName] = useState();
    const [categoryUpdateCategoryRank, setCategoryUpdateCategoryRank] = useState()
    const [menuCategoryId, setMenuCategoryId] = useState();
    const [feildError, setFeildError] = useState({
        name: false,
        mainCategory: false,
        categoryRank: false
    })
    const [noItem, setNoItem] = useState(true)
    const autoFocus = useRef();


    useEffect(() => {
        getAllCategory();
        getSubCategory();
    }, []);


    const addTimeFeilds = () => {
        if (time.from && time.to) {
            setTimeFeilds(true);
            setVariantFields([...variantFields, { from: time.from, to: time.to, index: variantFields.length }]);
            setTime({ from: null, to: null });
        } else {
            console.log("Please select both 'from' and 'to' times.");
        }
    };

    const handleCategoryId = (object) => {
        const periods = object.periods;
        setVariantFields(periods)
        if (periods.length === 0) {
            setViewMode(false)
            setTimeEdit(true)
        }
    }


    const getAllCategory = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BACKEND_BASE_URL}menuItemrouter/getMainCategory`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCategories(response.data);
        } catch (error) {
            if (error) {
                const errorMsg = error.response.data;
                setError(errorMsg)
            }
        }
    }
    const getSubCategory = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.get(`${BACKEND_BASE_URL}menuItemrouter/getSubCategoryList?page=${page + 1}&numPerPage=${rowsPerPage}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then((res) => {
                    setTotalRows(res.data.numRows)
                    setSubCategories(res.data.rows)
                    if (res.data.rows[0].msg === "No Data Found") {
                        setNoItem(true)
                    }
                    else {
                        setNoItem(false)
                    }
                })
        } catch (error) {
            setError(error.response.data)
        }
    }
    const handleClose = () => {
        setOpen(false);
        setOpenTime(false)
        setTimeEdit(false)
        setCategoryName('');
        setCategoryUpdatePopUp(false)
        setFeildError(false)
    }
    if (loading) {
        toast.loading("Please wait...", {
            toastId: 'loading'
        })
    }
    if (success) {
        toast.dismiss('loading');
        toast('success',
            {
                type: 'success',
                toastId: 'success',
                position: "top-right",
                toastId: 'error',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        setTimeout(() => {
            setSuccess(false)
            setLoading(false);
        }, 50)
    }
    if (error) {
        setLoading(false);
        toast.dismiss('loading');
        toast(error, {
            type: 'error',
            position: "top-right",
            toastId: 'error',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
        setError(false);
    }

    const handleOpen = () => setOpen(true);

    const handleCreateCategory = async () => {
        const formValidation = {
            name: categoryName.trim().length === 0,
            mainCategory: mainCategoryName.trim().length === 0,
            categoryRank: categoryRank.trim().length === 0
        }
        setFeildError(formValidation)

        if (Object.values(formValidation).some(field => field)) {
            setError('Please Fill All Fields');
            return;
        }

        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(`${BACKEND_BASE_URL}menuItemrouter/addSubCategoryData`, {
                categoryId: mainCategoryId.categoryId,
                subCategoryName: categoryName,
                displayRank: categoryRank
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log(response.data);
            if (response.data === 'SubCategory Added Successfully') {
                getAllCategory();
                getSubCategory();
                setCategoryName('');
                setMainCategoryName('');
                setCategoryRank('');
                setSuccess('SubCategory Added Successfully');
                autoFocus.current && autoFocus.current.focus();
            }
        } catch (error) {
            if (error.response.data === 'SubCategory is Already In Use') {
                setError('SubCategory is Already In Use');
                autoFocus.current && autoFocus.current.focus();
            }
            setError(error.response.data)
        }
    }
    const handleUpdateData = (categoryData) => {
        setCategoryupdatData(categoryData)
        const menuCategoryId = categories.find(main => main.menuCategoryId === categoryData.menuCategoryId)
        setCategoryUpdateMenuName(menuCategoryId.categoryName)
        setMenuCategoryId(menuCategoryId.categoryId)
        setCategoryUpdateCategoryRank(categoryData.displayRank)
    }
    const handleEdit = (index) => {
        setEditIndex(index);
        setCategoryName(categories[index].categoryName);
    }
    const handleUpdateUnit = async () => {
        const formValidation = {
            name: typeof categoryUpdateName !== 'string' || categoryUpdateName.trim().length === 0,
            mainCategory: typeof categoryUpdateMenuName !== 'string' || categoryUpdateMenuName.trim().length === 0,
            categoryRank: typeof categoryUpdateCategoryRank !== 'string' || categoryUpdateCategoryRank.trim().length === 0,
        };
        setFeildError(formValidation);

        if (Object.values(formValidation).some(field => field)) {
            setError('Please Fill All Fields');
            return;
        }
        const token = localStorage.getItem('token');
        try {
            const data = {
                subCategoryId: categoryUpdateData.subCategoryId,
                categoryId: menuCategoryId,
                subCategoryName: categoryUpdateName,
                displayRank: categoryUpdateCategoryRank
            }
            const response = await axios.post(
                `${BACKEND_BASE_URL}menuItemrouter/updateSubCategoryData`,
                {
                    subCategoryId: data.subCategoryId,
                    categoryId: data.categoryId,
                    subCategoryName: data.subCategoryName,
                    displayRank: data.displayRank
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            console.log(response.data);
            if (response.data === 'subCategory Updated Successfully') {
                getAllCategory();
                getSubCategory();
                handleClose();
                setSuccess('Category Updated Successfully')
                setCategoryUpdatePopUp(false)
            }
        } catch (error) {
            if (error) {
                const errorMsg = error.response.data;
                setError(errorMsg)
            }
        }
    };

    const handleDeleteSubcategory = async (id) => {
        const token = localStorage.getItem('token');
        const password = '123'
        const enteredPassword = prompt('Please Enter The Password');
        if (enteredPassword !== password) {
            alert('Incorrect password. Operation aborted.');
            return;
        }
        if (enteredPassword === password) {
            try {
                const response = await axios.delete(
                    `${BACKEND_BASE_URL}menuItemrouter/removeSubCategoryData?subCategoryId=${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                console.log(response.data);
                if (response.data === 'SubCategory Deleted Successfully') {
                    getAllCategory();
                    getSubCategory();
                    setSuccess('SubCategory Deleted Successfully')
                    setCategoryUpdatePopUp(false)
                }
            } catch (error) {
                if (error) {
                    const errorMsg = error.response.data;
                    setError(errorMsg)
                }
            }
        }
    };
    const handleTimeEditing = () => {
        if (variantFields.length > 0 && !timeEdit) {
            setTimeEdit(true);
        }
        else {
            setTimeEdit(false)
        }
        if (timeEdit === false) {
            handleUpdateTime();
        }
        if (timeEdit) {
            handleTimeSave();
        }
    }

    const timeSave = 'save'
    const timeEdits = 'Edit'


    const handleTimeSave = async () => {
        const formattedTime = {
            startTime: new Date(time.from).toTimeString().split(' ')[0],
            endTIme: new Date(time.to).toTimeString().split(' ')[0]
        };
        setTemp(formattedTime);
        console.log(categoryId);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${BACKEND_BASE_URL}menuItemrouter/addSubCategoryPeriod`,
                {
                    subCategoryId: categoryId,
                    periodIntervels: [formattedTime]
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            console.log(response.data);
        } catch (error) {
            setError(error.response.data)
        }
    };
    const handleUpdateTime = async () => {
        const formattedIntervals = variantFields.map(field => ({
            startTime: new Date(field.from).toTimeString().split(' ')[0],
            endTIme: new Date(field.to).toTimeString().split(' ')[0]
        }));

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${BACKEND_BASE_URL}menuItemrouter/updateSubCategoryPeriod`,
                {
                    subCategoryId: categoryId,
                    periodIntervels: formattedIntervals
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            console.log(response.data);
        } catch (error) {
            setError(error.response.data)
        }
    };
    useEffect(() => {
        getAllCategory();
        getSubCategory();
    }, [page, rowsPerPage]);

    const handleDelete = (index) => {
        const updatedFields = [...variantFields];
        updatedFields.splice(index, 1);
        setVariantFields(updatedFields);
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }

    return (
        <div className='BilingDashboardContainer mx-4 p-3'>
            <div className='grid grid-cols-12 mt-5'>
                <div className='col-span-12'>
                    <div className='productTableSubContainer'>
                        <div className='h-full grid grid-cols-12'>
                            <div className='h-full mobile:col-span-10  tablet1:col-span-10  tablet:col-span-7  laptop:col-span-7  desktop1:col-span-7  desktop2:col-span-7  '>
                                <div className='grid grid-cols-12 pl-6 g h-full'>
                                    <div className={`flex col-span-3 justify-center ${tab === null || tab === '' || !tab ? 'productTabAll' : 'productTab'}`} onClick={() => { setTab(null); setSearchWord(''); setDataSearch([]) }}>
                                        <div className='statusTabtext'>Sub Categories</div>
                                    </div>
                                </div>
                            </div>
                            <div className=' grid col-span-2 col-start-11 pr-3  h-full'>
                                <div className='self-center justify-self-end'>
                                    <button className='addProductBtn' onClick={handleOpen}>Add Sub Category</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
            {
                !noItem > 0 ? (
                    <TableContainer className='bg-white px-2 pt-6 border-none rounded-xl mt-7'>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell className=''>No.</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell align='right'>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody className='bg-white'>
                                {subCategories?.map((category, index) => (
                                    <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row" style={{ maxWidth: '15px', width: '15px' }}>
                                            {(index + 1) + (page * rowsPerPage)}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {category.subCategoryName}
                                        </TableCell>
                                        <TableCell>
                                            {category.subCategoryName ? (
                                                <div className="flex w-100 justify-end">
                                                    <div onClick={() => { setCategoryUpdatePopUp(true); setCategoryUpdateName(category.subCategoryName); handleUpdateData(category); }} className='rounded-lg bg-gray-100 p-2 ml-4 cursor-pointer table_Actions_icon2 hover:bg-blue-600'>
                                                        <BorderColorIcon className='text-gray-600 table_icon2' />
                                                    </div>
                                                    <div onClick={() => handleDeleteSubcategory(category.subCategoryId)} className='rounded-lg bg-gray-100 p-2 ml-4 cursor-pointer table_Actions_icon2 hover:bg-red-600'><DeleteOutlineOutlinedIcon className='text-gray-600 table_icon2 ' /></div>
                                                    <div onClick={() => { setOpenTime(true); setTimeEditName(category.subCategoryName); handleCategoryId(category); }} className='rounded-lg bg-gray-100 p-2 ml-4 cursor-pointer table_Actions_icon2 hover:bg-green-600'><AlarmIcon className='text-gray-600 table_icon2 ' /></div>
                                                </div>
                                            ) : (<></>)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={totalRows}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </TableContainer>
                ) : (
                    <div className="w-full flex justify-center">
                            <div className='text-center'>
                                <RestaurantMenuIcon className='restaurantMenu' />
                                <br />
                                <div className="text-2xl text-gray">
                                    No Data Found
                                </div>
                            </div>
                        </div>
                )
            }
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="spring-modal-title"
                aria-describedby="spring-modal-description"
                closeAfterTransition
                sx={{ width: '100%' }}

            >
                <Fade in={open}>
                    <Box sx={style} className='SubCateory'>
                        <div className="bg-white w-full">
                            <div className="w-full mb-4">Add Category</div>
                            <hr className='mb-4' />
                            <div className="mb-4 flex w-full gap-4">
                                <TextField
                                    onChange={(e) => {
                                        setCategoryName(e.target.value)
                                        setFeildError({ name: false })
                                    }}
                                    id="categoryName"
                                    label="Category Name"
                                    variant="outlined"
                                    value={categoryName}
                                    className={`w-full  col-span-3 mb-6 ${feildError.name ? 'mt-3' : ''}`}
                                    error={feildError.name ? true : false}
                                    helperText={feildError.name ? 'Category name cannot be empty' : ''}
                                    inputRef={autoFocus}
                                    autoComplete='off'
                                    
                                />
                                <div className='w-full'>
                                    <FormControl fullWidth >
                                        <InputLabel id="demo-simple-select-label">Main Category</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            label="Main Category"
                                            onChange={(e) => {
                                                setMainCategoryName(e.target.value)
                                                setFeildError({ mainCategory: false })
                                            }}
                                            error={feildError.mainCategory ? true : false}
                                            helperText={feildError.mainCategory ? 'Main Category Have to be selected' : ''}
                                            value={mainCategoryName}
                                            className='w-full'
                                            
                                        >
                                            {categories.map((category, index) => (
                                                <MenuItem value={category.categoryName} onClick={() => setMainCategoryId(category)} key={index}>{category.categoryName}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                                <TextField
                                    value={categoryRank}
                                    onChange={(e) => {
                                        setCategoryRank(e.target.value)
                                        setFeildError({ categoryRank: false })
                                    }}
                                    id="categoryRank"
                                    label="Category Rank"
                                    variant="outlined"
                                    className="w-full col-span-3 mb-6"
                                    error={feildError.categoryRank ? true : false}
                                    autoComplete='off'
                                    
                                    helperText={feildError.categoryRank ? 'Category Rank cannot be empty' : ''}
                                />
                                <div className="w-3/4">
                                    <button onClick={handleCreateCategory} className="addCategorySaveBtn ">Save</button>
                                </div>
                                <div className="w-3/4">
                                    <button onClick={() => setOpen(false)} className="addCategoryCancleBtn  bg-gray-700">Cancel</button>
                                </div>
                            </div>
                        </div>
                    </Box>
                </Fade>
            </Modal>
            <Modal
                open={categoryUpdatePopUp}
                onClose={handleClose}
                aria-labelledby="spring-modal-title"
                aria-describedby="spring-modal-description"
                closeAfterTransition

            >
                <Fade in={categoryUpdatePopUp}>
                    <Box sx={{ ...style, width: '70%' }}>
                        <div className="bg-white w-full">
                            <div className="w-full mb-4">Edit Category</div>
                            <hr className='mb-4' />
                            <div className="mb-4 flex  w-full gap-4">
                                <TextField
                                    onChange={(e) => {
                                        setCategoryUpdateName(e.target.value)
                                        setFeildError(prev => ({ ...prev, name: false }))
                                    }}
                                    error={feildError.name ? true : false}
                                    helperText={feildError.name ? 'Category name cannot be empty' : ''}
                                    inputRef={autoFocus}
                                    id="categoryName"
                                    label="Category Name"
                                    variant="outlined"
                                    value={categoryUpdateName}
                                    className="w-full  col-span-3 mb-6"
                                    
                                />
                                <div className='w-full'>
                                    <FormControl fullWidth >
                                        <InputLabel id="demo-simple-select-label">Main Category</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            label="Main Category"
                                            onChange={(e) => {
                                                setCategoryUpdateMenuName(e.target.value)
                                                setFeildError(prev => ({ ...prev, mainCategory: false }))
                                            }}
                                            error={feildError.mainCategory ? true : false}
                                            helperText={feildError.mainCategory ? 'Main Category Have to be selected' : ''}
                                            value={categoryUpdateMenuName}
                                            className='w-full'
                                            
                                        >
                                            {categories.map((category, index) => (
                                                <MenuItem value={category.categoryName} onClick={() => setMainCategoryId(category)} key={index}>{category.categoryName}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                                <TextField
                                    value={categoryUpdateCategoryRank}
                                    onChange={(e) => {
                                        setCategoryUpdateCategoryRank(e.target.value)
                                        setFeildError(prev => ({ ...prev, categoryRank: false }))
                                    }}
                                    id="categoryRank"
                                    label="Category Rank"
                                    variant="outlined"
                                    error={feildError.categoryRank ? true : false}
                                    helperText={feildError.categoryRank ? 'Category Rank cannot be empty' : ''}
                                    className="w-full col-span-3 mb-6"
                                    
                                />
                                <div className="w-3/4">
                                    <button onClick={handleUpdateUnit} className="addCategorySaveBtn w-full ">Save</button>
                                </div>
                                <div className="w-3/4">
                                    <button onClick={() => setCategoryUpdatePopUp(false)} className="addCategoryCancleBtn w-full bg-gray-700">Cancel</button>
                                </div>
                            </div>
                        </div>
                    </Box>
                </Fade>
            </Modal>
            <Modal
                open={openTime}
                onClose={handleClose}
                aria-labelledby="spring-modal-title"
                aria-describedby="spring-modal-description"
                closeAfterTransition
            >
                <Fade in={openTime}>
                    <Box sx={{ ...style, width: '70%' }}>
                        <div className="bg-white w-full">
                            <div className="w-full mb-4">Set Time for {timeEditName}</div>
                            <hr className='mb-4' />
                            <div className="mb-4 grid grid-cols-12 gap-8 align-middle">
                                {timeEdit && (
                                    <div className='col-span-6 flex gap-6'>
                                        <div className="col-span-2 w-full">
                                            <LocalizationProvider className='w-full' dateAdapter={AdapterDayjs}>
                                                <DemoContainer
                                                    components={[
                                                        'MobileTimePicker'
                                                    ]}
                                                >
                                                    <DemoItem label="From">
                                                        <MobileTimePicker
                                                            value={time.from}
                                                            onChange={(newValue) => setTime({ ...time, from: newValue })}
                                                            defaultValue={dayjs(temp, 'h:mm:ss')}
                                                        />
                                                    </DemoItem>
                                                </DemoContainer>
                                            </LocalizationProvider>
                                        </div>
                                        <div className="col-span-2 w-full">
                                            <LocalizationProvider className='w-full' dateAdapter={AdapterDayjs}>
                                                <DemoContainer
                                                    components={[
                                                        'MobileTimePicker'
                                                    ]}

                                                >
                                                    <DemoItem label="To" >
                                                        <MobileTimePicker
                                                            value={time.to}
                                                            onChange={(newValue) => setTime({ ...time, to: newValue })}
                                                        />
                                                    </DemoItem>
                                                </DemoContainer>
                                            </LocalizationProvider>
                                        </div>
                                        <div className="col-span-2 w-full">
                                            <button onClick={() => { addTimeFeilds(); }} className="addvariantButton mr-2 w-full col-span-2 mt-8">Add</button>
                                        </div>
                                    </div>
                                )}
                                {addTimeFeilds && (
                                    <div className="col-span-6">
                                        {variantFields.slice(0, 3).map((period, index) => (
                                            <div key={index} className="flex gap-3">
                                                {console.log(new Date(dayjs(period.startTime)))}
                                                <div className="col-span-2">
                                                    <LocalizationProvider className='w-full' dateAdapter={AdapterDayjs}>
                                                        <DemoContainer
                                                            components={['MobileTimePicker']}
                                                        >

                                                            <DemoItem label="From">
                                                                <MobileTimePicker
                                                                    disabled
                                                                    value={new Date(dayjs(period.startTime, 'HH:mm:ss').toDate())}
                                                                />
                                                            </DemoItem>
                                                        </DemoContainer>
                                                    </LocalizationProvider>
                                                </div>
                                                <div className="col-span-2">
                                                    <LocalizationProvider className='w-full' dateAdapter={AdapterDayjs}>
                                                        <DemoContainer
                                                            components={['MobileTimePicker']}
                                                        >
                                                            <DemoItem label="To">
                                                                <MobileTimePicker
                                                                    disabled
                                                                    value={new Date(dayjs(period.endTime, 'HH:mm:ss').toDate())}
                                                                />
                                                            </DemoItem>
                                                        </DemoContainer>
                                                    </LocalizationProvider>
                                                </div>
                                                <div className="col-span-2 self-center mt-5">
                                                    <button onClick={() => handleDelete(index)} className="bg-red-500 text-white py-1 px-2 rounded-lg self-center">
                                                        <DeleteOutlineOutlinedIcon />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                    </div>

                                )}
                            </div>
                            <div className="my-2 mt-4">
                                <button onClick={() => { handleTimeEditing() }} className="bg-green-500 text-white py-2 px-4 rounded-lg mr-2">
                                    {timeEdit ? timeSave : timeEdits}
                                </button>
                                <button onClick={handleClose} className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg">Cancel</button>
                            </div>
                        </div>
                    </Box>
                </Fade>
            </Modal>
            <ToastContainer />
        </div>
    );
}

export default SubCategory;