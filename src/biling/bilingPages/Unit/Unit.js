/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unreachable */
/* eslint-disable no-unused-vars */
// import './css/Dashboard.css';
import { useState, useEffect } from "react";
import React from 'react';
import './css/Unit.css'
import { BACKEND_BASE_URL } from '../../../url';
import { ToastContainer, toast } from 'react-toastify';
import Table from '@mui/material/Table';
import PropTypes from 'prop-types';
import Backdrop from '@mui/material/Backdrop';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import TextField from '@mui/material/TextField';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { useSpring, animated } from '@react-spring/web';
import axios from 'axios';
import CheckIcon from '@mui/icons-material/Check';
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

Fade.propTypes = {
    children: PropTypes.element.isRequired,
    in: PropTypes.bool,
    onClick: PropTypes.any,
    onEnter: PropTypes.func,
    onExited: PropTypes.func,
    ownerState: PropTypes.any,
};

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
function Unit() {
    useEffect(() => {
        getAllCategory();
    }, []);
    const getAllCategory = async () => {
        console.log(token);
        try {
            const response = await axios.get(`${BACKEND_BASE_URL}menuItemrouter/getUnit`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setGetAllUnit(response.data)
        } catch (error) {
            console.error("Error:", error);
        }
    }


    const [tab, setTab] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const handleClose = () => setOpen(false);
    const [getAllunit, setGetAllUnit] = React.useState();
    const [dataSearch, setDataSearch] = React.useState();
    const [searchWord, setSearchWord] = React.useState();
    const [suppiler, setSuppilerList] = React.useState();
    const [categories, setCategories] = React.useState();
    const [editIndex, setEditIndex] = React.useState(-1);
    const [countData, setCountData] = React.useState();
    const [addVariant, setAddVariant] = React.useState(false);
    const [variantFields, setVariantFields] = React.useState([]);
    const [unitName, setUnitName] = React.useState();
    const [loading, setLoading] = React.useState(false);
    const [updateCategory, setUpdateCategory] = React.useState(false)
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [feildError, setFeildError] = useState(false)

    const handleOpen = () => { setOpen(true) };
    const addVariantFields = () => {
        setAddVariant(true);
        setVariantFields([...variantFields, { variantName: '', variantPrice: '', index: variantFields.length }]);
    }
    const removeVariantField = () => {
        setVariantFields(variantFields.filter((_, index) => index));
    }
    if (loading) {
        console.log('>>>>??')
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
    const handleEdit = (index) => {
        setEditIndex(index);
        setUnitName(getAllunit[index]);
    }
    const token = localStorage.getItem('token')

    const handleCreateCategory = async () => {
        if (!unitName) {
            setFeildError(true)
            setError('Unit Have to Be Filled')
            return;
        }
        try {
            const response = await axios.post(`${BACKEND_BASE_URL}menuItemrouter/addUnit`, {
                unitName: unitName
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data);
            if (response.data === 'Unit Added Successfully') {
                setUnitName('');
                getAllCategory();
                setSuccess('')
            }
        } catch (error) {
            console.log(error);
        }
    }
    const handleUpdateUnit = async (index) => {
        const token = localStorage.getItem('token');
        try {
            const preUnitName = getAllunit[index];
            const response = await axios.post(`${BACKEND_BASE_URL}menuItemrouter/updateUnit`, {
                preUnitName: preUnitName,
                unitName: unitName
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data);
            const updatedUnitList = [...getAllunit];
            updatedUnitList[index] = unitName;
            setGetAllUnit(updatedUnitList);
            setEditIndex(-1);
            if(response.data === 'Unit Updated Successfullu'){
                setSuccess('Unit Updated Successfully')
            }
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className='BilingDashboardContainer p-3 '>
            <div className='grid grid-cols-12'>
                <div className='col-span-12'>
                    <div className='productTableSubContainer'>
                        <div className='h-full grid grid-cols-12'>
                            <div className='h-full mobile:col-span-10  tablet1:col-span-10  tablet:col-span-7  laptop:col-span-7  desktop1:col-span-7  desktop2:col-span-7  '>
                                <div className='grid grid-cols-12 pl-6 g h-full'>
                                    <div className={`flex col-span-3 justify-center ${tab === null || tab === '' || !tab ? 'productTabAll' : 'productTab'}`} onClick={() => { setTab(null); setSearchWord(''); setDataSearch([]) }}>
                                        <div className='statusTabtext'>All</div> &nbsp;&nbsp; <div className={`ProductCount ${tab === null || tab === '' || !tab ? 'blueCount' : ''}`}>{countData && countData.allProduct ? countData.allProduct : 0}</div>
                                    </div>
                                    <div className={`flex col-span-3 justify-center ${tab === 1 || tab === '1' ? 'productTabIn' : 'productTab'}`} onClick={() => { setTab(1); setSearchWord(''); setDataSearch([]) }}>
                                        <div className='statusTabtext'>In-Stock</div> &nbsp;&nbsp; <div className={`ProductCount ${tab === 1 || tab === '1' ? 'greenCount' : ''}`}>{countData && countData.instockProduct ? countData.instockProduct : 0}</div>
                                    </div>
                                    <div className={`flex col-span-3 justify-center ${tab === 2 || tab === '2' ? 'productTabUnder' : 'productTab'}`} onClick={() => { setTab(2); setSearchWord(''); setDataSearch([]) }}>
                                        <div className='statusTabtext'>Low-Stock</div> &nbsp;&nbsp; <div className={`ProductCount ${tab === 2 || tab === '2' ? 'orangeCount' : ''}`}>{countData && countData.underStockedProduct ? countData.underStockedProduct : 0}</div>
                                    </div>
                                    <div className={`flex col-span-3 justify-center ${tab === 3 || tab === '3' ? 'productTabOut' : 'productTab'}`} onClick={() => { setTab(3); setSearchWord(''); setDataSearch([]) }}>
                                        <div className='statusTabtext'>Out-Stock</div> &nbsp;&nbsp; <div className={`ProductCount ${tab === 3 || tab === '3' ? 'redCount' : ''}`}>{countData && countData.outOfStock ? countData.outOfStock : 0}</div>
                                    </div>
                                </div>
                            </div>
                            <div className=' grid col-span-2 col-start-11 pr-3  h-full'>
                                <div className='self-center justify-self-end'>
                                    <button className='addProductBtn' onClick={handleOpen}>Add Unit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
            <div className="tableContainerWrapper">
                <Table sx={{ '& tr > *:not(:first-child)': { textAlign: 'right' } }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell >Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {getAllunit && getAllunit.map((categoryName, index) => (
                            <TableRow key={index}>
                                <TableCell component="th" scope="row" className='table_row'>
                                    {editIndex === index ?
                                        <TextField onChange={(e) => setUnitName(e.target.value)} value={unitName} label="Category Name" variant="outlined" className="w-full col-span-3 mb-6" />
                                        :
                                        categoryName
                                    }
                                </TableCell>
                                <TableCell component="th" scope="row" className='table_row'>
                                    <div className="flex w-100">
                                        {editIndex === index ?
                                            <div onClick={() => handleUpdateUnit(index)} className='rounded-lg bg-gray-100 p-2 ml-4 cursor-pointer table_Actions_icon2 hover:bg-blue-600'>
                                                <CheckIcon className='text-gray-600 table_icon2' />
                                            </div>
                                            :
                                            <div onClick={() => handleEdit(index)} className='rounded-lg bg-gray-100 p-2 ml-4 cursor-pointer table_Actions_icon2 hover:bg-blue-600'>
                                                <BorderColorIcon className='text-gray-600 table_icon2' />
                                            </div>
                                        }
                                        <div className='rounded-lg bg-gray-100 p-2 ml-4 cursor-pointer table_Actions_icon2 hover:bg-red-600'>
                                            <DeleteOutlineOutlinedIcon className='text-gray-600 table_icon2 ' />
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="">
                {open && (
                    <Modal
                        aria-labelledby="spring-modal-title"
                        aria-describedby="spring-modal-description"
                        open={open}
                        onClose={handleClose}
                        closeAfterTransition
                        slots={{ backdrop: Backdrop }}
                        slotProps={{
                            backdrop: {
                                TransitionComponent: Fade,
                            },
                        }}
                        className='w-full'
                    >
                        <Fade in={open}>
                            <Box sx={style}>
                                <div className="bg-white w-full">
                                    <div className="w-full mb-4">
                                        Add Unit
                                    </div>
                                    <hr className='mb-4' />
                                    <div className="mb-4 grid grid-cols-12 gap-8">
                                        <TextField
                                            onChange={(e) => {setUnitName(e.target.value)
                                                setFeildError(false)
                                            }}
                                            value={unitName}
                                            label="Category Name"
                                            variant="outlined"
                                            className="w-full col-span-3 mb-6"
                                            error={feildError ? true : false} 
                                            helperText={feildError ? 'Category name cannot be empty' : ''}
                                        />
                                    </div>
                                    <div className="my-2 mt-4">
                                        <button onClick={handleCreateCategory} className="bg-green-500 text-white py-2 px-4 rounded-lg mr-2">Save</button>
                                        <button onClick={() => setOpen(false)} className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg">Cancel</button>
                                    </div>
                                </div>
                            </Box>
                        </Fade>
                    </Modal>
                )}
            </div>
        </div>
    )
}

export default Unit;