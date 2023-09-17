import './employDetails.css';
import { useState, useEffect } from "react";
import React from "react";
import { BACKEND_BASE_URL } from '../../../url';
import axios from 'axios';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useParams, useNavigate } from 'react-router-dom';
// import CountCard from '../countCard/countCard';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Popover from '@mui/material/Popover';
import Tooltip from '@mui/material/Tooltip';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
// import ProductQtyCountCard from '../productQtyCard/productQtyCard';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import Switch from '@mui/material/Switch';
import { ToastContainer, toast } from 'react-toastify';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import 'react-toastify/dist/ReactToastify.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import SearchIcon from '@mui/icons-material/Search';
import MenuMonthly from './menus/menuMonthlySalary';
import MenuAdvance from './menus/menuAdvance';
import MenuFine from './menus/menuFine';
import MenuBonus from './menus/menuBonus';
import MenuCredit from './menus/menuCredit';
import MenuLeaves from './menus/menuLeaves';
import MenuTransaction from './menus/menuTransaction';
const styleStockIn = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 900,
    bgcolor: 'background.paper',
    boxShadow: 24,
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingTop: '15px',
    paddingBottom: '20px',
    borderRadius: '10px'
};
const viewCutTable = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    height: '85%',
    maxHeight: '85%',
    overflow: 'hidden',
    bgcolor: 'background.paper',
    boxShadow: 24,
    paddingLeft: '15px',
    paddingRight: '15px',
    paddingTop: '15px',
    paddingBottom: '10px',
    borderRadius: '10px'
};
function EmployeeDetails() {
    const monthIndex = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const monthIndexInt = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const monthValue = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]
    const yearList = ["2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030",
        "2031", "2032", "2033", "2034", "2035", "2036", "2037", "2038", "2039", "2040",
        "2041", "2042", "2043", "2044", "2045", "2046", "2047", "2048", "2049", "2050",
        "2051", "2052", "2053", "2054", "2055", "2056", "2057", "2058", "2059", "2060",
        "2061", "2062", "2063", "2064", "2065", "2066", "2067", "2068", "2069", "2070"
    ]

    let { id } = useParams();
    const [loading, setLoading] = React.useState(false);
    const [isToggel, setIsToggel] = React.useState(false);
    const [tabTable, setTabTable] = React.useState(1);
    const [inActiveDate, setInActiveDate] = React.useState(null);
    const [reducedFine, setReducedFine] = React.useState('');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [pageLeaves, setPageLeaves] = React.useState(0);
    const [editId, setEditId] = React.useState('');
    const [rowsPerPageLeaves, setRowsPerPageLeaves] = React.useState(5);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [openAddLeave, setOpenAddLeave] = React.useState(false);
    const [openModal, setOpenModal] = React.useState(false);
    const [openModalCalculation, setOpenModalCalculation] = React.useState(false);
    const [calculationData, setCalculationData] = React.useState();
    const [openModalEditInActiveDate, setOpenModalEditInActiveDate] = React.useState(false);
    const [openModalEditFine, setOpenModalEditFine] = React.useState(false);
    const [editLeave, setEditLeave] = React.useState(false);
    const [data, setData] = useState();
    const [searchWord, setSearchWord] = React.useState('');
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const [toggel, setToggel] = useState(false);
    const label = { inputProps: { 'aria-label': 'Size switch demo' } };
    const [addLeaveFormData, setAddLeaveFormData] = React.useState({
        employeeId: '',
        numLeave: '',
        leaveReason: '',
        leaveDate: dayjs(),
    });
    const [addLeaveFormDataError, setAddLeaveFormDataError] = React.useState({
        numLeave: false,
        leaveReason: false,
        leaveDate: false
    });
    const [addLeaveFormDataErrorFeild, setAddLeaveFormDataErrorFeild] = React.useState([
        'numLeave',
        'leaveReason',
        'leaveDate',
    ]);

    const [formData, setFormData] = React.useState({
        employeeId: '',
        payAmount: '',
        amountType: 1,
        comment: '',
        amountDate: dayjs(),
    });
    const [formDataError, setFormDataError] = React.useState({
        payAmount: false,
        amountType: false,
        amountDate: false,
    });
    const [formDataErrorFeild, setFormDataErrorFeild] = React.useState([
        'payAmount',
        'amountType',
        'amountDate',
    ]);

    const [editFormData, setEditFormData] = React.useState();

    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
    const [state, setState] = useState(
        {
            startMonth: new Date().getMonth(),
            startYear: new Date().getFullYear(),
            endMonth: new Date().getMonth(),
            endYear: new Date().getFullYear()
        }
    );
    console.log('state', state)
    const [tab, setTab] = React.useState(1);
    const [filter, setFilter] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const ids = open ? 'simple-popover' : undefined;


    const [monthlySalary, setMonthlySalary] = React.useState();
    const [advanceData, setAdvanceData] = React.useState();
    const [fineData, setFineData] = React.useState();
    const [fineStatus, setFineStatus] = React.useState('');
    const [creditData, setCreditData] = React.useState();
    const [bonusData, setBonusData] = React.useState();
    const [leaveData, setLeaveData] = React.useState();
    const [transactionData, setTransactionData] = React.useState();
    const [totalRowsMonthly, setTotalRowsMonthly] = React.useState(0);
    const [totalRowsAdvance, setTotalRowsAdvance] = React.useState(0);
    const [totalRowsFine, setTotalRowsFine] = React.useState(0);
    const [totalRowsCredit, setTotalRowsCredit] = React.useState(0);
    const [totalRowsBonus, setTotalRowsBonus] = React.useState(0);
    const [totalRowsLeaves, setTotalRowsLeaves] = React.useState(0);
    const [totalRowsTransaction, setTotalRowsTransaction] = React.useState(0);


    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const getData = async () => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getEmployeeDetailsById?employeeId=${id}`, config)
            .then((res) => {
                setToggel(res.data.employeeStatus == 1 ? true : false)
                setData(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getCalculationData = async (id) => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getCutSalaryDataById?remainSalaryId=${id}`, config)
            .then((res) => {
                setCalculationData(res.data);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handlePaymentData = (date) => {
        setFormData((prevState) => ({
            ...prevState,
            ["amountDate"]: date && date['$d'] ? date['$d'] : null,
        }))
    };
    const handleInactiveDate = (date) => {
        setEditFormData((prevState) => ({
            ...prevState,
            ["newDate"]: date && date['$d'] ? date['$d'] : null,
        }))
    };
    const handleLeaveDateEdit = (date) => {
        setEditFormData((prevState) => ({
            ...prevState,
            ["newLeaveDate"]: date && date['$d'] ? date['$d'] : null,
        }))
    };
    const handleChangeFineStatus = (e) => {
        setPage(0);
        setRowsPerPage(5);
        filter ? getFineDataByFilterBySorting(e.target.value) : getFineDataBySorting(e.target.value)
        setFineStatus(e.target.value)
    };
    const handleInActiveData = (date) => {
        setEditFormData((prevState) => ({
            ...prevState,
            ["newDate"]: date && date['$d'] ? date['$d'] : null,
        }))
    };
    const handleLeaveDate = (date) => {
        const currentDate = dayjs(date);
        const endOfMonth = currentDate.endOf('month');
        const maxLeave = endOfMonth.diff(currentDate, 'day');
        setAddLeaveFormData((prevState) => ({
            ...prevState,
            ["leaveDate"]: date && date['$d'] ? date['$d'] : null,
            ["maxLeave"]: maxLeave
        }))
    };
    const onChange = (e) => {

        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))

    }
    const onChangeMonthFilter = (e) => {
        if (e.target.name == 'startYear') {
            setState((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
                endYear: e.target.value,
            }))
        } else if (e.target.name == 'startMonth') {
            setState((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
                endMonth: e.target.value
            }))
        }
        else {
            setState((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }))
        }
    }
    const onChangeLeave = (e) => {
        setAddLeaveFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }
    const onChangeFine = (e) => {
        setEditFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }
    const addPayment = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}staffrouter/addAmountOfSFA`, formData, config)
            .then((res) => {
                setLoading(false);
                setSuccess(true);
                handleCloseModel();
                setTimeout(() => {
                    getData()
                }, 50)

            })
            .catch((error) => {
                setLoading(false);
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const makeInActive = async (mode) => {
        let dataT = formData;
        console.log('LLKKII', dataT, formData)
        if (loading || success) {

        } else {
            if (mode) {
                const isValidate = formDataErrorFeild.filter(element => {
                    if (formDataError[element] === true || formData[element] === '') {
                        setFormDataError((perv) => ({
                            ...perv,
                            [element]: true
                        }))
                        return element;
                    }
                })
                console.log('????', isValidate);
                if (isValidate.length > 0) {
                    setError(
                        "Please Fill All Field"
                    )
                } else {
                    dataT = {
                        ...dataT,
                        payStatus: true,
                        employeeStatus: false
                    }
                    setLoading(true);
                    await axios.post(`${BACKEND_BASE_URL}staffrouter/updateEmployeeStatus`, dataT, config)
                        .then((res) => {
                            setLoading(false);
                            setSuccess(true);
                            handleCloseModel();
                            setOpenModal(false)
                            setToggel(false)
                            setIsToggel(false);
                            setTimeout(() => {
                                getData()
                            }, 50)

                        })
                        .catch((error) => {
                            setLoading(false);
                            setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
                        })
                }
            }
            else {
                dataT = {
                    ...dataT,
                    payStatus: false,
                    employeeStatus: false
                }
                setLoading(true);
                await axios.post(`${BACKEND_BASE_URL}staffrouter/updateEmployeeStatus`, dataT, config)
                    .then((res) => {
                        setLoading(false);
                        setSuccess(true);
                        setOpenModal(false)
                        setToggel(false)
                        handleCloseModel();
                        setIsToggel(false);
                        setTimeout(() => {
                            getData()
                        }, 50)

                    })
                    .catch((error) => {
                        setLoading(false);
                        setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
                    })
            }
        }
    }
    const addLeave = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}staffrouter/addEmployeeLeave`, addLeaveFormData, config)
            .then((res) => {
                setLoading(false);
                setSuccess(true);
                handleCloseAddLeave();
                setAddLeaveFormData({
                    employeeId: '',
                    numLeave: '',
                    leaveReason: '',
                    leaveDate: dayjs(),
                })
                setAddLeaveFormDataError({
                    numLeave: false,
                    leaveReason: false,
                    leaveDate: false
                })
                getData()
            })
            .catch((error) => {
                setLoading(false);
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const editLeaveApi = async () => {
        setLoading(true);
        await axios.post(`${BACKEND_BASE_URL}staffrouter/updateEmployeeLeave`, addLeaveFormData, config)
            .then((res) => {
                setLoading(false);
                setSuccess(true);
                handleCloseAddLeave();
                setPageLeaves(0);
                setRowsPerPageLeaves(5);
                setAddLeaveFormData({
                    employeeId: '',
                    numLeave: '',
                    leaveReason: '',
                    leaveDate: dayjs(),
                })
                setAddLeaveFormDataError({
                    numLeave: false,
                    leaveReason: false,
                    leaveDate: false
                })
                filter ? getLeaveDataByFilter() : getLeaveData()
                setEditLeave(false)
                getData()
            })
            .catch((error) => {
                setLoading(false);
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const handleCloseModel = () => {
        setFormData({
            employeeId: '',
            payAmount: '',
            amountType: 1,
            comment: '',
            amountDate: dayjs(),
        })
        setFormDataError({
            payAmount: false,
            amountType: false,
            amountDate: false,
        })
        setIsToggel(false);
        // setIsInActive(false)
        setOpenModal(false);
    }
    const handleCloseModelInActiveDateEdit = () => {
        setEditFormData();
        setOpenModalEditInActiveDate(false);
    }
    const handleCloseModelFineEdit = () => {
        setReducedFine(null);
        setEditId('')
        setEditFormData()
        setOpenModalEditFine(false);
    }
    const handleCloseModelCalculation = () => {
        setEditFormData()
        setOpenModalCalculation(false);
    }
    const handleOpenModelCalculation = (id, salary, advance, fine) => {
        setEditFormData({
            salary: salary,
            advance: advance,
            fine: fine
        })
        getCalculationData(id);
        setOpenModalCalculation(true);
    }
    const handleCloseModelLeaveEdit = () => {
        setEditFormData()
        setEditLeave(false);
    }
    const handleOpen = (row) => {
        setFormData((perv) => ({
            ...perv,
            employeeId: row.employeeId,
            nickName: row.nickName,
            paymentDue: row.paymentDue,
            totalSalary: row.totalSalary,
            advanceAmount: row.advanceAmount,
            fineAmount: row.fineAmount,
            paymentDue: row.paymentDue,
            dateOfPayment: row.dateOfPayment
        }))
        setOpenModal(true);
    }
    const handleToggel = async () => {
        let dataT = formData;
        console.log('statsusss', toggel)
        // handleActiveInactive(data, index)
        if (toggel) {
            // setToggel(false)
            setIsToggel(true);
            handleOpenInactive()
        } else {
            dataT = {
                employeeId: data.employeeId,
                employeeStatus: true,
                payStatus: false
            }
            setLoading(true);
            await axios.post(`${BACKEND_BASE_URL}staffrouter/updateEmployeeStatus`, dataT, config)
                .then((res) => {
                    setLoading(false);
                    setSuccess(true);
                    setOpenModal(false)
                    setToggel(true);
                    setPage(0);
                    setRowsPerPage(5);
                    filter ? getMonthlySalaryDataByFilter() : getMonthlySalaryData();
                    handleCloseModel();
                })
                .catch((error) => {
                    setLoading(false);
                    setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
                })
        }
    }
    const submitLeave = () => {
        if (loading || success) {

        } else {
            const isValidate = addLeaveFormDataErrorFeild.filter(element => {
                if (addLeaveFormDataError[element] === true || addLeaveFormData[element] === '') {
                    setAddLeaveFormDataError((perv) => ({
                        ...perv,
                        [element]: true
                    }))
                    return element;
                }
            })
            console.log('????', isValidate);
            if (isValidate.length > 0) {
                setError(
                    "Please Fill All Field"
                )
            } else {
                addLeave()
            }
        }
    }
    const editInActiveDate = async (id) => {
        setLoading(true);
        if (loading || success) {

        } else {
            await axios.get(`${BACKEND_BASE_URL}staffrouter/updateMonthlySalary?monthlySalaryId=${id}&msEndDate=${editFormData.newDate}`, config)
                .then((res) => {
                    setLoading(false);
                    setSuccess(true);
                    handleCloseModelInActiveDateEdit();
                    getData();
                    setPage(0);
                    setRowsPerPage(5);
                    getMonthlySalaryData();
                })
                .catch((error) => {
                    setLoading(false);
                    setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
                })
        }
    }
    const submitEditLeave = () => {
        if (loading || success) {

        } else {
            const isValidate = addLeaveFormDataErrorFeild.filter(element => {
                if (addLeaveFormDataError[element] === true || addLeaveFormData[element] === '') {
                    setAddLeaveFormDataError((perv) => ({
                        ...perv,
                        [element]: true
                    }))
                    return element;
                }
            })
            console.log('????', isValidate);
            if (isValidate.length > 0) {
                setError(
                    "Please Fill All Field"
                )
            } else {
                editLeaveApi()
            }
        }
    }
    const submit = () => {
        if (loading || success) {

        } else {
            const isValidate = formDataErrorFeild.filter(element => {
                if (formDataError[element] === true || formData[element] === '') {
                    setFormDataError((perv) => ({
                        ...perv,
                        [element]: true
                    }))
                    return element;
                }
            })
            console.log('????', isValidate);
            if (isValidate.length > 0) {
                setError(
                    "Please Fill All Field"
                )
            } else {
                addPayment()
            }
        }
    }
    const handleCloseAddLeave = () => {
        setEditLeave(false)
        setAddLeaveFormData({
            employeeId: '',
            numLeave: '',
            leaveReason: '',
            leaveDate: dayjs(),
        })
        setAddLeaveFormDataError({
            payAmount: false,
            amountType: false,
            amountDate: false,
        })
        setOpenAddLeave(false);
    }
    const handleOpenAddLeave = (row) => {
        const currentDateNew = new Date();

        const day = String(currentDateNew.getDate()).padStart(2, '0');
        const month = String(currentDateNew.getMonth() + 1).padStart(2, '0'); // Month is 0-based, so we add 1
        const year = String(currentDateNew.getFullYear());

        const formattedDate = `${day}-${month}-${year}`;
        const { startDate, endDate } = getStartAndEndDateOfMonth(formattedDate)
        const { dateNew } = getDateLeave(formattedDate)
        const currentDate = dayjs(dateNew);
        const endOfMonth = currentDate.endOf('month');
        const maxLeave = endOfMonth.diff(currentDate, 'day');

        setAddLeaveFormData((perv) => ({
            ...perv,
            employeeId: row.employeeId,
            availableLeave: row.totalMaxLeave - row.totalLeave,
            totalMaxLeave: row.totalMaxLeave,
            nickName: row.nickName,
            maxLeave: maxLeave,
            minDate: startDate,
            maxDate: endDate
        }))
        setOpenAddLeave(true);
    }
    const handleOpenInactive = async () => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getMidMonthInActiveSalaryOfEmployee?employeeId=${data.employeeId}`, config)
            .then((res) => {
                setFormData((perv) => ({
                    ...perv,
                    employeeId: data.employeeId,
                    nickName: data.nickName,
                    paymentDue: data.paymentDue,
                    totalSalary: data.totalSalary + res.data.proratedSalary,
                    advanceAmount: data.advanceAmount,
                    fineAmount: data.fineAmount,
                    paymentDue: data.paymentDue,
                    proratedSalary: res.data.proratedSalary,
                    dateOfPayment: data.dateOfPayment
                }))
                setOpenModal(true);
            })
            .catch((error) => {
                setLoading(false);
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    function getStartAndEndDateOfMonth(dateString) {
        console.log(dateString);
        // Split the input date string into day, month, and year components
        const [day, month, year] = dateString.split('-').map(Number);

        // Create a Date object for the first day of the month
        const startDate = new Date(year, month - 1, 1); // Note: Month is 0-based, so subtract 1

        // Calculate the last day of the month
        // To do this, set the day to 0 of the next month (which is the last day of the current month)
        const endDate = new Date(year, month, 0);

        return {
            startDate,
            endDate,
        };
    }
    function getStartAndEndDateOfMonthPlusOneDate(dateString) {
        console.log(dateString);
        // Split the input date string into day, month, and year components
        const [day, month, year] = dateString.split('-').map(Number);
        // Create a Date object for the first day of the month
        const startDate = new Date(year, month - 1, 1); // Note: Month is 0-based, so subtract 1
        // Calculate the last day of the month
        // To do this, set the day to 0 of the next month (which is the last day of the current month)
        const endDate = new Date(year, month, 1);

        return {
            startDate,
            endDate,
        };
    }
    function getDateLeave(dateString) {
        console.log('newww', dateString);
        // Split the input date string into day, month, and year components
        const [day, month, year] = dateString.split('-').map(Number);

        // Create a Date object for the first day of the month

        // Calculate the last day of the month
        // To do this, set the day to 0 of the next month (which is the last day of the current month)
        const dateNew = new Date(year, month - 1, day);

        return {
            dateNew,
        };
    }





    const getMonthlySalaryData = async () => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getEmployeeMonthlySalaryById?page=${1}&numPerPage=${5}&employeeId=${id}`, config)
            .then((res) => {
                setMonthlySalary(res.data.rows);
                setTotalRowsMonthly(res.data.numRows)
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }

    const getMonthlySalaryDataByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getEmployeeMonthlySalaryById?startMonth=${monthIndex[state.startMonth] + '-' + state.startYear}&endMonth=${monthIndex[state.endMonth] + '-' + state.endYear}&page=${1}&numPerPage=${5}&employeeId=${id}`, config)
            .then((res) => {
                setMonthlySalary(res.data.rows);
                setTotalRowsMonthly(res.data.numRows)
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const getMonthlySalaryDataOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getEmployeeMonthlySalaryById?page=${pageNum}&numPerPage=${rowPerPageNum}&employeeId=${id}`, config)
            .then((res) => {
                setMonthlySalary(res.data.rows);
                setTotalRowsMonthly(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getMonthlySalaryDataOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getEmployeeMonthlySalaryById?startMonth=${monthIndex[state.startMonth] + '-' + state.startYear}&endMonth=${monthIndex[state.endMonth] + '-' + state.endYear}&page=${pageNum}&numPerPage=${rowPerPageNum}&employeeId=${id}`, config)
            .then((res) => {
                setMonthlySalary(res.data.rows);
                setTotalRowsMonthly(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }


    const getAdvanceData = async () => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getAdvanceDataById?page=${1}&numPerPage=${5}&employeeId=${id}`, config)
            .then((res) => {
                setAdvanceData(res.data.rows);
                setTotalRowsAdvance(res.data.numRows)
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }

    const getAdvanceDataByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getAdvanceDataById?startMonth=${monthIndex[state.startMonth] + '-' + state.startYear}&endMonth=${monthIndex[state.endMonth] + '-' + state.endYear}&page=${1}&numPerPage=${5}&employeeId=${id}`, config)
            .then((res) => {
                setAdvanceData(res.data.rows);
                setTotalRowsAdvance(res.data.numRows)
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const getAdvanceDataOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getAdvanceDataById?page=${pageNum}&numPerPage=${rowPerPageNum}&employeeId=${id}`, config)
            .then((res) => {
                setAdvanceData(res.data.rows);
                setTotalRowsAdvance(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getAdvanceDataOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getAdvanceDataById?startMonth=${monthIndex[state.startMonth] + '-' + state.startYear}&endMonth=${monthIndex[state.endMonth] + '-' + state.endYear}&page=${pageNum}&numPerPage=${rowPerPageNum}&employeeId=${id}`, config)
            .then((res) => {
                setAdvanceData(res.data.rows);
                setTotalRowsAdvance(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }


    const getFineData = async () => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getFineDataById?page=${1}&numPerPage=${5}&employeeId=${id}&fineStatus=${fineStatus}`, config)
            .then((res) => {
                setFineData(res.data.rows);
                setTotalRowsFine(res.data.numRows)
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }

    const getFineDataByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getFineDataById?startMonth=${monthIndex[state.startMonth] + '-' + state.startYear}&endMonth=${monthIndex[state.endMonth] + '-' + state.endYear}&page=${1}&numPerPage=${5}&employeeId=${id}&fineStatus=${fineStatus}`, config)
            .then((res) => {
                setFineData(res.data.rows);
                setTotalRowsFine(res.data.numRows)
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const getFineDataBySorting = async (status) => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getFineDataById?page=${1}&numPerPage=${5}&employeeId=${id}&fineStatus=${status}`, config)
            .then((res) => {
                setFineData(res.data.rows);
                setTotalRowsFine(res.data.numRows)
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }

    const getFineDataByFilterBySorting = async (status) => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getFineDataById?startMonth=${monthIndex[state.startMonth] + '-' + state.startYear}&endMonth=${monthIndex[state.endMonth] + '-' + state.endYear}&page=${1}&numPerPage=${5}&employeeId=${id}&fineStatus=${status}`, config)
            .then((res) => {
                setFineData(res.data.rows);
                setTotalRowsFine(res.data.numRows)
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const getFineDataOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getFineDataById?page=${pageNum}&numPerPage=${rowPerPageNum}&employeeId=${id}&fineStatus=${fineStatus}`, config)
            .then((res) => {
                setFineData(res.data.rows);
                setTotalRowsFine(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getFineDataOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getFineDataById?startMonth=${monthIndex[state.startMonth] + '-' + state.startYear}&endMonth=${monthIndex[state.endMonth] + '-' + state.endYear}&page=${pageNum}&numPerPage=${rowPerPageNum}&employeeId=${id}&fineStatus=${fineStatus}`, config)
            .then((res) => {
                setFineData(res.data.rows);
                setTotalRowsFine(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }


    const getCreditData = async () => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getCreditDataById?page=${1}&numPerPage=${5}&employeeId=${id}`, config)
            .then((res) => {
                setCreditData(res.data.rows);
                setTotalRowsCredit(res.data.numRows)
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }

    const getCreditDataByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getCreditDataById?startMonth=${monthIndex[state.startMonth] + '-' + state.startYear}&endMonth=${monthIndex[state.endMonth] + '-' + state.endYear}&page=${1}&numPerPage=${5}&employeeId=${id}`, config)
            .then((res) => {
                setCreditData(res.data.rows);
                setTotalRowsCredit(res.data.numRows)
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const getCreditDataOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getCreditDataById?page=${pageNum}&numPerPage=${rowPerPageNum}&employeeId=${id}`, config)
            .then((res) => {
                setCreditData(res.data.rows);
                setTotalRowsCredit(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getCreditDataOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getCreditDataById?startMonth=${monthIndex[state.startMonth] + '-' + state.startYear}&endMonth=${monthIndex[state.endMonth] + '-' + state.endYear}&page=${pageNum}&numPerPage=${rowPerPageNum}&employeeId=${id}`, config)
            .then((res) => {
                setCreditData(res.data.rows);
                setTotalRowsCredit(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }


    const getBonusData = async () => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getBonusDataById?page=${1}&numPerPage=${5}&employeeId=${id}`, config)
            .then((res) => {
                setBonusData(res.data.rows);
                setTotalRowsBonus(res.data.numRows)
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }

    const getBonusDataByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getBonusDataById?startMonth=${monthIndex[state.startMonth] + '-' + state.startYear}&endMonth=${monthIndex[state.endMonth] + '-' + state.endYear}&page=${1}&numPerPage=${5}&employeeId=${id}`, config)
            .then((res) => {
                setBonusData(res.data.rows);
                setTotalRowsBonus(res.data.numRows)
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const getBonusDataOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getBonusDataById?page=${pageNum}&numPerPage=${rowPerPageNum}&employeeId=${id}`, config)
            .then((res) => {
                setBonusData(res.data.rows);
                setTotalRowsBonus(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getBonusDataOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getBonusDataById?startMonth=${monthIndex[state.startMonth] + '-' + state.startYear}&endMonth=${monthIndex[state.endMonth] + '-' + state.endYear}&page=${pageNum}&numPerPage=${rowPerPageNum}&employeeId=${id}`, config)
            .then((res) => {
                setBonusData(res.data.rows);
                setTotalRowsBonus(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }


    const getLeaveData = async () => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getLeaveDataById?page=${1}&numPerPage=${5}&employeeId=${id}`, config)
            .then((res) => {
                setLeaveData(res.data.rows);
                setTotalRowsLeaves(res.data.numRows)
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }

    const getLeaveDataByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getLeaveDataById?startMonth=${monthIndex[state.startMonth] + '-' + state.startYear}&endMonth=${monthIndex[state.endMonth] + '-' + state.endYear}&page=${1}&numPerPage=${5}&employeeId=${id}`, config)
            .then((res) => {
                setLeaveData(res.data.rows);
                setTotalRowsLeaves(res.data.numRows)
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const getLeaveDataOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getLeaveDataById?page=${pageNum}&numPerPage=${rowPerPageNum}&employeeId=${id}`, config)
            .then((res) => {
                setLeaveData(res.data.rows);
                setTotalRowsLeaves(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getLeaveDataOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getLeaveDataById?startMonth=${monthIndex[state.startMonth] + '-' + state.startYear}&endMonth=${monthIndex[state.endMonth] + '-' + state.endYear}&page=${pageNum}&numPerPage=${rowPerPageNum}&employeeId=${id}`, config)
            .then((res) => {
                setLeaveData(res.data.rows);
                setTotalRowsLeaves(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }


    const getTransactionData = async () => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getTransactionDataById?page=${1}&numPerPage=${5}&employeeId=${id}&searchNumber=${''}`, config)
            .then((res) => {
                setTransactionData(res.data.rows);
                setTotalRowsTransaction(res.data.numRows)
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }

    const getTransactionDataByFilter = async () => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getTransactionDataById?startMonth=${monthIndex[state.startMonth] + '-' + state.startYear}&endMonth=${monthIndex[state.endMonth] + '-' + state.endYear}&page=${1}&numPerPage=${5}&employeeId=${id}&searchNumber=${''}`, config)
            .then((res) => {
                setTransactionData(res.data.rows);
                setTotalRowsTransaction(res.data.numRows)
            })
            .catch((error) => {
                setError(error.response && error.response.data ? error.response.data : "Network Error ...!!!");
            })
    }
    const getTransactionDataOnPageChange = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getTransactionDataById?page=${pageNum}&numPerPage=${rowPerPageNum}&employeeId=${id}&searchNumber=${''}`, config)
            .then((res) => {
                setTransactionData(res.data.rows);
                setTotalRowsTransaction(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const getTransactionDataOnPageChangeByFilter = async (pageNum, rowPerPageNum) => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getTransactionDataById?startMonth=${monthIndex[state.startMonth] + '-' + state.startYear}&endMonth=${monthIndex[state.endMonth] + '-' + state.endYear}&page=${pageNum}&numPerPage=${rowPerPageNum}&employeeId=${id}&searchNumber=${''}`, config)
            .then((res) => {
                setTransactionData(res.data.rows);
                setTotalRowsTransaction(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }


    const deleteMonthlySalary = async (id) => {
        setLoading(true)
        await axios.delete(`${BACKEND_BASE_URL}staffrouter/removeMonthlySalary?monthlySalaryId=${id}`, config)
            .then((res) => {
                setLoading(false)
                setSuccess(true)
                setPage(0);
                setRowsPerPage(5);
                getMonthlySalaryData();
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleDeleteMonthlySalary = (id) => {
        if (window.confirm("Are you sure you want to delete Monthly Salary?")) {
            deleteMonthlySalary(id);
        }
    }
    const deleteAdvance = async (id) => {
        setLoading(true)
        await axios.delete(`${BACKEND_BASE_URL}staffrouter/removeAdvanceTransaction?advanceId=${id}`, config)
            .then((res) => {
                setLoading(false)
                setSuccess(true)
                setPage(0);
                setRowsPerPage(5);
                filter ? getAdvanceDataByFilter() : getAdvanceData();
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleDeleteAdvance = (id) => {
        if (window.confirm("Are you sure you want to delete Advance?")) {
            deleteAdvance(id);
        }
    }
    const deleteFine = async (id) => {
        setLoading(true)
        await axios.delete(`${BACKEND_BASE_URL}staffrouter/removeFineTransaction?fineId=${id}`, config)
            .then((res) => {
                setLoading(false)
                setSuccess(true)
                setPage(0);
                setRowsPerPage(5);
                filter ? getFineDataByFilter() : getFineData();
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleDeleteFine = (id) => {
        if (window.confirm("Are you sure you want to delete Fine?")) {
            deleteFine(id);
        }
    }
    const deleteCredit = async (id) => {
        setLoading(true)
        await axios.delete(`${BACKEND_BASE_URL}staffrouter/removeCreditTransaction?creditId=${id}`, config)
            .then((res) => {
                setLoading(false)
                setSuccess(true)
                setPage(0);
                setRowsPerPage(5);
                getData()
                filter ? getCreditDataByFilter() : getCreditData();
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleDeleteCredit = (id) => {
        if (window.confirm("Are you sure you want to delete Credit?")) {
            deleteCredit(id);
        }
    }
    const deleteTransaction = async (id) => {
        setLoading(true)
        await axios.delete(`${BACKEND_BASE_URL}staffrouter/removeSalaryTranction?transactionId=${id}`, config)
            .then((res) => {
                setLoading(false)
                setSuccess(true)
                setPage(0);
                setRowsPerPage(5);
                getData()
                filter ? getTransactionDataByFilter() : getTransactionData();
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleDeleteTransaction = (id) => {
        if (window.confirm("Are you sure you want to delete Transaction?")) {
            deleteTransaction(id);
        }
    }
    const deleteLeave = async (id) => {
        setLoading(true)
        await axios.delete(`${BACKEND_BASE_URL}staffrouter/removeEmployeeLeave?leaveId=${id}`, config)
            .then((res) => {
                setLoading(false)
                setSuccess(true)
                setPageLeaves(0);
                setRowsPerPageLeaves(5);
                filter ? getLeaveDataByFilter() : getLeaveData()
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleDeleteLeave = (id) => {
        if (window.confirm("Are you sure you want to delete Leaves?")) {
            deleteLeave(id);
        }
    }
    const deleteBonus = async (id) => {
        setLoading(true)
        await axios.delete(`${BACKEND_BASE_URL}staffrouter/removeBonusTransaction?bonusId=${id}`, config)
            .then((res) => {
                setLoading(false)
                setSuccess(true)
                setPage(0);
                setRowsPerPage(5);
                filter ? getBonusDataByFilter() : getBonusData();
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const handleDeleteBonus = (id) => {
        if (window.confirm("Are you sure you want to delete Bonus?")) {
            deleteBonus(id);
        }
    }
    const handleEditInactiveDate = (id, date) => {
        console.log('>?date', date)
        setOpenModalEditInActiveDate(true)
        const { dateNew } = getDateLeave(date)
        const { startDate, endDate } = getStartAndEndDateOfMonth(date)
        setEditFormData({
            startDate: date,
            monthlySalaryId: id,
            minDate: startDate,
            maxDate: endDate,
            newDate: dayjs(endDate),
        })
    }
    const handleEditLeaves = (data, date) => {
        setEditLeave(true)
        const { startDate, endDate } = getStartAndEndDateOfMonth(date)
        const { dateNew } = getDateLeave(date)
        const currentDate = dayjs(dateNew);
        const endOfMonth = currentDate.endOf('month');
        const maxLeave = endOfMonth.diff(currentDate, 'day');
        setAddLeaveFormData((perv) => ({
            ...perv,
            employeeId: id,
            leaveId: data.leaveId,
            minDate: startDate,
            maxDate: endDate,
            numLeave: data.numLeave,
            leaveReason: data.leaveReason,
            leaveDate: dateNew,
            maxLeave, maxLeave,
            // availableLeave: data.totalMaxLeave - data.totalLeave,
            // totalMaxLeave: data.totalMaxLeave,
            nickName: data.nickName,
        }))
        setOpenAddLeave(true);
        // console.log("LeaveDate", editFormData.newLeaveDate)
    }
    const handleReduceFine = (id, fine) => {
        setOpenModalEditFine(true)
        setReducedFine(fine);
        setEditFormData({
            reducedFine: fine,
            currentFine: fine,
            fineId: id,
        })
        setEditId(id)
    }

    const getInvoice = async (tId, suppilerName) => {
        if (window.confirm('Are you sure you want to Download Reciept ... ?')) {
            await axios({
                url: `${BACKEND_BASE_URL}staffrouter/getEmployeeInvoice?employeeId=${id}&invoiceId=${tId}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userInfo.token}` },
                responseType: 'blob', // important
            }).then((response) => {
                // create file link in browser's memory
                const href = URL.createObjectURL(response.data);
                // create "a" HTML element with href to file & click
                const link = document.createElement('a');
                const name = suppilerName + '_' + new Date().toLocaleDateString() + '.pdf'
                link.href = href;
                link.setAttribute('download', name); //or any other extension
                document.body.appendChild(link);
                link.click();

                // clean up "a" element & remove ObjectURL
                document.body.removeChild(link);
                URL.revokeObjectURL(href);
            });
        }
    }

    const markAsIgnore = async (fineId) => {
        setLoading(true)
        await axios.get(`${BACKEND_BASE_URL}staffrouter/updateFineStatus?employeeId=${id}&fineId=${fineId}&fineStatus=0`, config)
            .then((res) => {
                setLoading(false)
                setSuccess(true)
                setPage(0);
                setRowsPerPage(5);
                filter ? getFineDataByFilter() : getFineData()
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    const updateFine = async (fineId) => {
        setLoading(true)
        await axios.get(`${BACKEND_BASE_URL}staffrouter/updateFineTransaction?fineId=${fineId}&fineReduceAmt=${editFormData.reducedFine}`, config)
            .then((res) => {
                setOpenModalEditFine(false);
                setEditFormData();
                setLoading(false)
                setSuccess(true)
                setPage(0);
                setRowsPerPage(5);
                filter ? getFineDataByFilter() : getFineData()
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }
    // const updateLeave = async (leaveId) => {
    //     if (editFormData.leaves > editFormData.maxLeave || editFormData.leaves <= 0) {

    //     } else {
    //         const data = {
    //             leaveId: leaveId,
    //             leaveCount: editFormData.leaves,
    //             leaveDate: editFormData.newLeaveDate,
    //         }
    //         setLoading(true)
    //         await axios.post(`${BACKEND_BASE_URL}staffrouter/updateEmployeeLeave`, data, config)
    //             .then((res) => {
    //                 setOpenModalEditLeave(false);
    //                 setEditFormData();
    //                 setLoading(false)
    //                 setSuccess(true)
    //                 setPageLeaves(0);
    //                 setRowsPerPageLeaves(5);
    //                 filter ? getLeaveDataByFilter() : getLeaveData()
    //             })
    //             .catch((error) => {
    //                 setError(error.response ? error.response.data : "Network Error ...!!!")
    //             })
    //     }
    // }
    const markAsConsider = async (fineId) => {
        setLoading(true)
        await axios.get(`${BACKEND_BASE_URL}staffrouter/updateFineStatus?employeeId=${id}&fineId=${fineId}&fineStatus=1`, config)
            .then((res) => {
                setLoading(false)
                setSuccess(true)
                setPage(0);
                setRowsPerPage(5);
                filter ? getFineDataByFilter() : getFineData()
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }



    const onSearchChange = (e) => {
        setFilter(false)
        setState({
            startMonth: new Date().getMonth(),
            startYear: new Date().getFullYear(),
            endMonth: new Date().getMonth(),
            endYear: new Date().getFullYear()
        })
        setSearchWord(e.target.value);
    }
    const debounce = (func) => {
        let timer;
        return function (...args) {
            const context = this;
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                timer = null;
                func.apply(context, args)
            }, 700)
        }

    }

    const handleSearch = () => {
        console.log(':::???:::', document.getElementById('searchWord').value)
        search(document.getElementById('searchWord').value)
    }
    const debounceFunction = React.useCallback(debounce(handleSearch), [])


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        console.log("page change")
        if (tabTable === 1 || tabTable === '1') {
            if (filter) {
                getMonthlySalaryDataOnPageChangeByFilter(newPage + 1, rowsPerPage)
            }
            else {
                getMonthlySalaryDataOnPageChange(newPage + 1, rowsPerPage)
            }
        }
        else if (tabTable === 2 || tabTable === '2') {
            if (filter) {
                getAdvanceDataOnPageChangeByFilter(newPage + 1, rowsPerPage)
            }
            else {
                getAdvanceDataOnPageChange(newPage + 1, rowsPerPage)
            }
        }
        else if (tabTable === 3 || tabTable === '3') {
            if (filter) {
                getFineDataOnPageChangeByFilter(newPage + 1, rowsPerPage)
            }
            else {
                getFineDataOnPageChange(newPage + 1, rowsPerPage)
            }
        }
        else if (tabTable === 5 || tabTable === '5') {
            if (filter) {
                getCreditDataOnPageChangeByFilter(newPage + 1, rowsPerPage)
            }
            else {
                getCreditDataOnPageChange(newPage + 1, rowsPerPage)
            }
        }
        else if (tabTable === 6 || tabTable === '6') {
            if (filter) {
                getBonusDataOnPageChangeByFilter(newPage + 1, rowsPerPage)
            }
            else {
                getBonusDataOnPageChange(newPage + 1, rowsPerPage)
            }
        }
        else if (tabTable === 4 || tabTable === '4') {
            if (filter) {
                getTransactionDataOnPageChangeByFilter(newPage + 1, rowsPerPage)
            }
            else {
                getTransactionDataOnPageChange(newPage + 1, rowsPerPage)
            }
        }
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        if (tabTable === 1 || tabTable === '1') {
            if (filter) {
                getMonthlySalaryDataOnPageChangeByFilter(1, parseInt(event.target.value, 10))
            }
            else {
                getMonthlySalaryDataOnPageChange(1, parseInt(event.target.value, 10))
            }
        }
        else if (tabTable === 2 || tabTable === '2') {
            if (filter) {
                getAdvanceDataOnPageChangeByFilter(1, parseInt(event.target.value, 10))
            }
            else {
                getAdvanceDataOnPageChange(1, parseInt(event.target.value, 10))
            }
        }
        else if (tabTable === 3 || tabTable === '3') {
            if (filter) {
                getFineDataOnPageChangeByFilter(1, parseInt(event.target.value, 10))
            }
            else {
                getFineDataOnPageChange(1, parseInt(event.target.value, 10))
            }
        }
        else if (tabTable === 5 || tabTable === '5') {
            if (filter) {
                getCreditDataOnPageChangeByFilter(1, parseInt(event.target.value, 10))
            }
            else {
                getCreditDataOnPageChange(1, parseInt(event.target.value, 10))
            }
        }
        else if (tabTable === 6 || tabTable === '6') {
            if (filter) {
                getBonusDataOnPageChangeByFilter(1, parseInt(event.target.value, 10))
            }
            else {
                getBonusDataOnPageChange(1, parseInt(event.target.value, 10))
            }
        }
        else if (tabTable === 4 || tabTable === '4') {
            if (filter) {
                getTransactionDataOnPageChangeByFilter(1, parseInt(event.target.value, 10))
            }
            else {
                getTransactionDataOnPageChange(1, parseInt(event.target.value, 10))
            }
        }
    };



    const search = async (searchWord) => {
        await axios.get(`${BACKEND_BASE_URL}staffrouter/getTransactionDataById?page=${1}&numPerPage=${5}&searchNumber=${searchWord}&employeeId=${id}`, config)
            .then((res) => {
                setTransactionData(res.data.rows);
                setTotalRowsTransaction(res.data.numRows);
            })
            .catch((error) => {
                setError(error.response ? error.response.data : "Network Error ...!!!")
            })
    }



    const handleChangePageLeaves = (event, newPage) => {
        setPageLeaves(newPage);
        if (filter) {
            getLeaveDataOnPageChangeByFilter(newPage + 1, rowsPerPage)
        }
        else {
            getLeaveDataOnPageChange(newPage + 1, rowsPerPage)
        }

    };
    const handleChangeRowsPerPageLeaves = (event) => {
        setRowsPerPageLeaves(parseInt(event.target.value, 10));
        setPageLeaves(0);
        if (filter) {
            getLeaveDataOnPageChangeByFilter(1, parseInt(event.target.value, 10))
        }
        else {
            getLeaveDataOnPageChange(1, parseInt(event.target.value, 10))
        }

    };


    useEffect(() => {
        getData();
        getMonthlySalaryData();
    }, [])
    if (loading) {
        console.log('>>>>??')
        toast.loading("Please wait...", {
            toastId: 'loading'
        })
    }
    if (success) {
        // setLoading(false);
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
            setSuccess(false);
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
    if (!data) {
        return null;
    }
    return (
        <div className='suppilerListContainer'>
            <div className='grid grid-cols-12 gap-8'>
                <div className='col-span-12 '>
                    <div className='datePickerWrp mb-4'>
                        <div className='grid grid-cols-12'>
                            <div className='col-span-12'>
                                <div className='productTableSubContainer'>
                                    <div className='h-full grid grid-cols-12'>
                                        <div className='h-full col-span-8'>
                                            <div className='grid grid-cols-12 pl-6 gap-3 h-full'>
                                                <div className={`flex col-span-3 justify-center ${tab === 1 || tab === '1' || !tab ? 'productTabAll' : 'productTab'}`}
                                                    onClick={() => {
                                                        setTab(1);
                                                        setPageLeaves(0)
                                                        setRowsPerPageLeaves(5)
                                                    }} >
                                                    <div className='statusTabtext'>Employee Detail</div>
                                                </div>
                                                <div className={`flex col-span-3 justify-center ${tab === 2 || tab === '2' ? 'productTabIn' : 'productTab'}`}
                                                    onClick={() => {
                                                        setTab(2);
                                                        setPageLeaves(0)
                                                        setRowsPerPageLeaves(5)
                                                    }}>
                                                    <div className='statusTabtext'>Statistics</div>
                                                </div>
                                                <div className={`flex col-span-3 justify-center ${tab === 3 || tab === '3' ? 'tabDebit' : 'productTab'}`}
                                                    onClick={() => {
                                                        setTab(3);
                                                        setPageLeaves(0)
                                                        setRowsPerPageLeaves(5)
                                                        filter ? getLeaveDataByFilter() : getLeaveData();
                                                    }}>
                                                    <div className='statusTabtext'>Leaves</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-span-4 flex justify-end pr-4'>
                                            <div className='dateRange text-center self-center' aria-describedby={ids} onClick={handleClick}>
                                                <CalendarMonthIcon className='calIcon' />&nbsp;&nbsp;{(state.startMonth && filter ? '( ' + monthValue[state.startMonth] + ' / ' + state.startYear + ' )' : 'Select Date')} -- {(state.endMonth && filter ? '( ' + monthValue[state.endMonth] + ' / ' + state.endYear + ' )' : 'Select Date')}
                                            </div>
                                            <div className='resetBtnWrap col-span-3 self-center'>
                                                <button
                                                    className={`${!filter ? 'reSetBtn' : 'reSetBtnActive'}`}
                                                    onClick={() => {
                                                        setFilter(false);
                                                        setPage(0); setRowsPerPage(5);
                                                        setTabTable(1);
                                                        getMonthlySalaryData();
                                                        setState({
                                                            startMonth: new Date().getMonth(),
                                                            startYear: new Date().getFullYear(),
                                                            endMonth: new Date().getMonth(),
                                                            endYear: new Date().getFullYear()
                                                        })
                                                    }}><CloseIcon /></button>
                                            </div>
                                            <Popover
                                                id={ids}
                                                open={open}
                                                style={{ zIndex: 10000, borderRadius: '10px', boxShadow: 'rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem' }}
                                                anchorEl={anchorEl}
                                                onClose={handleClose}
                                                anchorOrigin={{
                                                    vertical: 'bottom',
                                                    horizontal: 'right',
                                                }}
                                            >
                                                <Box sx={{ bgcolor: 'background.paper', padding: '20px', width: '600px', height: '175px', borderRadius: '10px', paddingTop: '30px' }}>
                                                    {/* <DateRangePicker
                                                        ranges={state}
                                                        onChange={item => { setState([item.selection]); console.log([item.selection]) }}
                                                        direction="horizontal"
                                                        months={2}
                                                        showSelectionPreview={true}
                                                        moveRangeOnFirstSelection={false}
                                                    /> */}
                                                    <div className='mounthRangeSelect grid grid-cols-12 gap-6'>
                                                        <div className="col-span-3">
                                                            <FormControl style={{ minWidth: '100%' }}>
                                                                <InputLabel id="demo-simple-select-label">Start Month</InputLabel>
                                                                <Select
                                                                    // disabled={isEdit}
                                                                    labelId="demo-simple-select-label"
                                                                    id="demo-simple-select"
                                                                    value={state.startMonth}
                                                                    name="startMonth"
                                                                    label="Start Month"
                                                                    onChange={onChangeMonthFilter}
                                                                    MenuProps={{
                                                                        style: { zIndex: 35001 }
                                                                    }}
                                                                >
                                                                    {
                                                                        monthValue.map((data, index) => (
                                                                            <MenuItem key={data} value={index}>{data}</MenuItem>
                                                                        ))
                                                                    }
                                                                </Select>
                                                            </FormControl>
                                                        </div>
                                                        <div className="col-span-3">
                                                            <FormControl style={{ minWidth: '100%' }}>
                                                                <InputLabel id="demo-simple-select-label">Start Year</InputLabel>
                                                                <Select
                                                                    // disabled={isEdit}
                                                                    labelId="demo-simple-select-label"
                                                                    id="demo-simple-select"
                                                                    value={state.startYear}
                                                                    name="startYear"
                                                                    label="Start Year"
                                                                    onChange={onChangeMonthFilter}
                                                                    MenuProps={{
                                                                        style: { zIndex: 35001 }
                                                                    }}
                                                                >
                                                                    {
                                                                        yearList.map((data, index) => (
                                                                            <MenuItem key={data} value={data}>{data}</MenuItem>
                                                                        ))
                                                                    }
                                                                </Select>
                                                            </FormControl>
                                                        </div>
                                                        <div className="col-span-3">
                                                            <FormControl style={{ minWidth: '100%' }}>
                                                                <InputLabel id="demo-simple-select-label">End Month</InputLabel>
                                                                <Select
                                                                    // disabled={isEdit}
                                                                    labelId="demo-simple-select-label"
                                                                    id="demo-simple-select"
                                                                    value={state.endMonth}
                                                                    name="endMonth"
                                                                    label="End Month"
                                                                    onChange={onChangeMonthFilter}
                                                                    MenuProps={{
                                                                        style: { zIndex: 35001 }
                                                                    }}
                                                                >
                                                                    {
                                                                        monthIndexInt.map((data, index) => (
                                                                            state.endYear == state.startYear ? data >= state.startMonth ? <MenuItem key={data} value={data}>{monthValue[data]}</MenuItem> : null : <MenuItem key={data} value={data}>{monthValue[data]}</MenuItem>
                                                                        ))
                                                                    }
                                                                </Select>
                                                            </FormControl>
                                                        </div>
                                                        <div className="col-span-3">
                                                            <FormControl style={{ minWidth: '100%' }}>
                                                                <InputLabel id="demo-simple-select-label">End Year</InputLabel>
                                                                <Select
                                                                    // disabled={isEdit}
                                                                    labelId="demo-simple-select-label"
                                                                    id="demo-simple-select"
                                                                    value={state.endYear}
                                                                    name="endYear"
                                                                    label="End Year"
                                                                    onChange={onChangeMonthFilter}
                                                                    MenuProps={{
                                                                        style: { zIndex: 35001 }
                                                                    }}
                                                                >
                                                                    {

                                                                        yearList.map((data, index) => (
                                                                            data >= state.startYear ? <MenuItem key={data} value={data}>{data}</MenuItem> : null
                                                                        ))
                                                                    }
                                                                </Select>
                                                            </FormControl>
                                                        </div>
                                                    </div>
                                                    <div className='mt-8 grid gap-4 grid-cols-12'>
                                                        <div className='col-span-3 col-start-7'>
                                                            <button className='stockInBtn' onClick={() => {
                                                                setFilter(true)
                                                                handleClose();
                                                                setPage(0); setRowsPerPage(5);
                                                                setTabTable(1)
                                                                getMonthlySalaryDataByFilter();
                                                                // setFilter(true); handleClose(); getStatisticsByFilter(); setTabTable(''); setPage(0); setRowsPerPage(5); getStockInDataByTabByFilter(''); getProductCountByFilter();
                                                            }}>Apply</button>
                                                        </div>
                                                        <div className='col-span-3'>
                                                            <button className='stockOutBtn' onClick={handleClose}>cancle</button>
                                                        </div>
                                                    </div>
                                                </Box>
                                            </Popover>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {tab === 1 || tab === '1' ?
                        <div className='detailCard'>
                            <div className='grid grid-cols-12 gap-6 pr-4'>
                                <div className='imgNameWrp col-span-4 grid'>
                                    <div className='imgWrpCardDetail justify-self-center mt-3'>
                                        <img src={BACKEND_BASE_URL + data.imageLink} />
                                    </div>
                                    <div className='flex editBtnWrp justify-center mt-4'>
                                        <div>
                                            <Switch
                                                {...label}
                                                defaultChecked
                                                checked={toggel}
                                                onChange={() => handleToggel()}
                                            />
                                        </div>
                                    </div>
                                    <div className='nameAndCategoryWrp'>
                                        <Tooltip title={data.employeeName} placement="top" arrow>
                                            <div className='nameWrpDetail'>
                                                {data.employeeName}
                                            </div>
                                        </Tooltip>
                                        <Tooltip title={data.category} placement="top" arrow>
                                            <div className='categoryWrpDetail'>
                                                {data.category}
                                            </div>
                                        </Tooltip>
                                    </div>
                                    <div className='mt-8 ml-6 mr-6 grid grid-cols-2 gap-6'>
                                        <button className='addSalary' onClick={() => handleOpen(data)}>Give Salary</button>
                                        <button className='addLeave' onClick={() => handleOpenAddLeave(data)}>Add Leave</button>
                                    </div>
                                </div>
                                <div className='mt-3 col-span-4 detailContainer'>
                                    <div className='grid grid-cols-12 gap-3 hrLine'>
                                        <div className='col-span-5 suppilerDetailFeildHeader'>
                                            Nick Name :
                                        </div>
                                        <div className='col-span-7 suppilerDetailFeild'>
                                            {data.employeeNickName}
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-12 gap-3 hrLine'>
                                        <div className='col-span-5 suppilerDetailFeildHeader'>
                                            Gender :
                                        </div>
                                        <div className='col-span-7 suppilerDetailFeild'>
                                            {data.employeeGender}
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-12 gap-3 hrLine'>
                                        <div className='col-span-5 suppilerDetailFeildHeader'>
                                            Mobile Number :
                                        </div>
                                        <div className='col-span-7 suppilerDetailFeild'>
                                            {data.employeeMobileNumber}
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-12 gap-3 hrLine'>
                                        <div className='col-span-5 suppilerDetailFeildHeader'>
                                            Other Number :
                                        </div>
                                        <div className='col-span-7 suppilerDetailFeild'>
                                            {data.employeeOtherMobileNumber}
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-12 gap-3 hrLine'>
                                        <div className='col-span-5 suppilerDetailFeildHeader'>
                                            Present Address :
                                        </div>
                                        <div className='col-span-7 suppilerDetailFeild'>
                                            {data.presentAddress}
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-12 gap-3 hrLine'>
                                        <div className='col-span-5 suppilerDetailFeildHeader'>
                                            Home Address:
                                        </div>
                                        <div className='col-span-7 suppilerDetailFeild'>
                                            {data.homeAddress}
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-12 gap-3 hrLine'>
                                        <div className='col-span-5 suppilerDetailFeildHeader'>
                                            Adharcard Number:
                                        </div>
                                        <div className='col-span-7 suppilerDetailFeild'>
                                            {data.adharCardNum}
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-12 gap-3 hrLine'>
                                        <div className='col-span-5 suppilerDetailFeildHeader'>
                                            Home Address:
                                        </div>
                                        <div className='col-span-7 suppilerDetailFeild'>
                                            {data.homeAddress}
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-12 gap-3'>
                                        <div className='col-span-5 suppilerDetailFeildHeader'>
                                            Category:
                                        </div>
                                        <div className='col-span-7 suppilerDetailFeild'>
                                            {data.category}
                                        </div>
                                    </div>
                                </div>
                                <div className='mt-3 col-span-4 detailContainer'>
                                    <div className='grid grid-cols-12 gap-3 hrLine'>
                                        <div className='col-span-5 suppilerDetailFeildHeader'>
                                            Current Salary :
                                        </div>
                                        <div className='col-span-7 suppilerDetailFeild'>
                                            {data.salary}
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-12 gap-3 hrLine'>
                                        <div className='col-span-5 suppilerDetailFeildHeader'>
                                            Max Leave :
                                        </div>
                                        <div className='col-span-7 suppilerDetailFeild'>
                                            {data.maxLeave}
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-12 gap-3 hrLine'>
                                        <div className='col-span-5 suppilerDetailFeildHeader'>
                                            Employee Joining :
                                        </div>
                                        <div className='col-span-7 suppilerDetailFeild'>
                                            {data.employeeJoiningDate}
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-12 gap-3 hrLine'>
                                        <div className='col-span-5 suppilerDetailFeildHeader'>
                                            Last Payment Date :
                                        </div>
                                        <div className='col-span-7 suppilerDetailFeild'>
                                            {data.employeeLastPaymentDate}
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-12 gap-3 hrLine'>
                                        <div className='col-span-5 suppilerDetailFeildHeader'>
                                            Account Holder :
                                        </div>
                                        <div className='col-span-7 suppilerDetailFeild'>
                                            {data.accountHolderName}
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-12 gap-3 hrLine'>
                                        <div className='col-span-5 suppilerDetailFeildHeader'>
                                            Account Number:
                                        </div>
                                        <div className='col-span-7 suppilerDetailFeild'>
                                            {data.accountNumber}
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-12 gap-3 hrLine'>
                                        <div className='col-span-5 suppilerDetailFeildHeader'>
                                            IFSC Code:
                                        </div>
                                        <div className='col-span-7 suppilerDetailFeild'>
                                            {data.ifscCode}
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-12 gap-3 hrLine'>
                                        <div className='col-span-5 suppilerDetailFeildHeader'>
                                            Bank Name:
                                        </div>
                                        <div className='col-span-7 suppilerDetailFeild'>
                                            {data.bankName}
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-12 gap-3'>
                                        <div className='col-span-5 suppilerDetailFeildHeader'>
                                            Branch Name:
                                        </div>
                                        <div className='col-span-7 suppilerDetailFeild'>
                                            {data.branchName}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        tab === 2 || tab === '2' ?
                            <div className='grid gap-4 mt-12' style={{ maxHeight: '332px', overflowY: 'scroll' }}>
                                <div className='grid grid-cols-2 gap-6 pb-3'>
                                    {/* {
                                    productQtyCount && productQtyCount?.map((row, index) => (
                                        <ProductQtyCountCard productQtyUnit={row.productUnit} productQty={row.productQuantity} productName={row.productName} index={index} />
                                    ))
                                } */}
                                </div>
                            </div>
                            :
                            <div className='tableSubContainer pt-2 mt-10'>
                                <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }} component={Paper}>
                                    <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
                                        <TableHead >
                                            <TableRow>
                                                <TableCell >No.</TableCell>
                                                <TableCell>Given By</TableCell>
                                                <TableCell align="left">Leave Count</TableCell>
                                                <TableCell align="left">Reason</TableCell>
                                                <TableCell align="left">Date</TableCell>
                                                <TableCell align="left"></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {leaveData?.map((row, index) => (
                                                totalRowsLeaves !== 0 ?
                                                    <TableRow
                                                        hover
                                                        key={row.leaveId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        style={{ cursor: "pointer" }}
                                                        className='tableRow'
                                                    >
                                                        <TableCell align="left" >{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                        <Tooltip title={row.userName} placement="top-start" arrow>
                                                            <TableCell component="th" scope="row" >
                                                                {row.givenBy}
                                                            </TableCell>
                                                        </Tooltip>
                                                        <TableCell align="left" >{row.numLeave}</TableCell>
                                                        <Tooltip title={row.leaveReason} placement="top-start" arrow><TableCell align="left" ><div className='Comment'>{row.leaveReason}</div></TableCell></Tooltip>
                                                        <TableCell align="left" >{row.leaveDate}</TableCell>
                                                        <TableCell align="right">
                                                            <MenuLeaves data={row} handleDeleteLeave={handleDeleteLeave} handleEditLeaves={handleEditLeaves} />
                                                        </TableCell>
                                                    </TableRow> :
                                                    <TableRow
                                                        key={row.userId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell align="left" style={{ fontSize: "18px" }} >{"No Data Found...!"}</TableCell>
                                                    </TableRow>

                                            ))}
                                        </TableBody>
                                    </Table>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25]}
                                        component="div"
                                        count={totalRowsLeaves}
                                        rowsPerPage={rowsPerPageLeaves}
                                        page={pageLeaves}
                                        onPageChange={handleChangePageLeaves}
                                        onRowsPerPageChange={handleChangeRowsPerPageLeaves}
                                    />
                                </TableContainer>
                            </div>
                    }

                </div>
            </div>
            <div className='grid grid-cols-12 mt-6 '>
                <div className='col-span-12'>
                    <div className='productTableSubContainer'>
                        <div className='h-full grid grid-cols-12'>
                            <div className='h-full col-span-12'>
                                <div className='grid grid-cols-12 pl-6 pr-6 gap-3 h-full'>
                                    <div className={`flex col-span-2 justify-center ${tabTable === 1 || tabTable === '1' ? 'productTabAll' : 'productTab'}`} onClick={() => {
                                        setTabTable(1);
                                        filter ? getMonthlySalaryDataByFilter() : getMonthlySalaryData();
                                        setPage(0); setRowsPerPage(5);
                                        // setPage(0); setRowsPerPage(5); filter ? getStockInDataByTabByFilter('') : getStockInDataByTab('');
                                    }}>
                                        <div className='statusTabtext'>Monthly Salary</div>
                                    </div>
                                    <div className={`flex col-span-2 justify-center ${tabTable === 2 || tabTable === '2' ? 'tabDebit' : 'productTab'}`} onClick={() => {
                                        setTabTable(2);
                                        filter ? getAdvanceDataByFilter() : getAdvanceData();
                                        setPage(0); setRowsPerPage(5);
                                        // setPage(0); filter ? getStockInDataByTabByFilter('debit') : getStockInDataByTab('debit'); setRowsPerPage(5);
                                    }}>
                                        <div className='statusTabtext'>Advance</div>
                                    </div>
                                    <div className={`flex col-span-2 justify-center ${tabTable === 3 || tabTable === '3' ? 'tabCash' : 'productTab'}`} onClick={() => {
                                        setTabTable(3);
                                        filter ? getFineDataByFilter() : getFineData();
                                        setPage(0); setRowsPerPage(5);
                                        // setPage(0); filter ? getStockInDataByTabByFilter('cash') : getStockInDataByTab('cash'); setRowsPerPage(5);
                                    }}>
                                        <div className='statusTabtext'>Fine</div>
                                    </div>
                                    <div className={`flex col-span-2 justify-center ${tabTable === 4 || tabTable === '4' ? 'tabTransaction' : 'productTab'}`} onClick={() => {
                                        setTabTable(4);
                                        filter ? getTransactionDataByFilter() : getTransactionData()
                                        setPage(0); setRowsPerPage(5);
                                        // setPage(0); filter ? getDebitDataByFilter() : getDebitDataByTab(); setRowsPerPage(5);
                                    }}>
                                        <div className='statusTabtext'>Transactions</div>
                                    </div>
                                    <div className={`flex col-span-2 justify-center ${tabTable === 5 || tabTable === '5' ? 'products' : 'productTab'}`} onClick={() => {
                                        setTabTable(5);
                                        filter ? getCreditDataByFilter() : getCreditData()
                                        setPage(0); setRowsPerPage(5);
                                        // setPage(0); filter ? getProductDataByFilter() : getProductDataByTab(); setRowsPerPage(5);
                                    }}>
                                        <div className='statusTabtext'>Credit</div>
                                    </div>
                                    <div className={`flex col-span-2 justify-center ${tabTable === 6 || tabTable === '6' ? 'bonusTab' : 'productTab'}`} onClick={() => {
                                        setTabTable(6);
                                        filter ? getBonusDataByFilter() : getBonusData()
                                        setPage(0); setRowsPerPage(5);
                                        // setPage(0); filter ? getProductDataByFilter() : getProductDataByTab(); setRowsPerPage(5);
                                    }}>
                                        <div className='statusTabtext'>Bonus</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='grid grid-cols-12 mt-6'>
                <div className='col-span-12 pb-6'>
                    <div className='tableSubContainer pt-2'>
                        <div className='grid grid-cols-12 pt-6'>
                            {(tabTable === '4' || tabTable === 4) &&
                                <div className='col-span-3 pl-8'>
                                    <TextField
                                        className='sarchText'
                                        onChange={(e) => { onSearchChange(e); debounceFunction() }}
                                        value={searchWord}
                                        name="searchWord"
                                        id="searchWord"
                                        variant="standard"
                                        label="Search"
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end"><SearchIcon /></InputAdornment>,
                                            style: { fontSize: 14 }
                                        }}
                                        InputLabelProps={{ style: { fontSize: 14 } }}
                                        fullWidth
                                    />
                                </div>
                            }
                            {(tabTable === '3' || tabTable === 3) &&
                                <div className='col-span-2 pl-8'>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Status</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={fineStatus}
                                            label="status"
                                            name='fineStatus'
                                            onChange={handleChangeFineStatus}
                                        >
                                            <MenuItem key='xx' value={''}>Clear</MenuItem>
                                            <MenuItem key='1' value={1}>Considered</MenuItem>
                                            <MenuItem key='0' value={0}>Ignored</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>}
                            <div className='col-span-3 col-start-10 pr-5 flex justify-end'>
                                <button className='exportExcelBtn'
                                // onClick={() => { tab === 2 || tab === '2' ? debitExportExcel() : tab === 3 || tab === '3' ? CashExportExcel() : DebitDataExportExcel() }}
                                ><FileDownloadIcon />&nbsp;&nbsp;Export Excle</button>
                            </div>
                        </div>
                        {
                            (tabTable === '1' || tabTable === 1) && <div className='tableContainerWrapper'>
                                <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }} component={Paper}>
                                    <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
                                        <TableHead >
                                            <TableRow>
                                                <TableCell >No.</TableCell>
                                                <TableCell> Salary Month</TableCell>
                                                <TableCell> Total Salary</TableCell>
                                                <TableCell align="left">Remaining Salary</TableCell>
                                                <TableCell align="left">Advance Taken</TableCell>
                                                <TableCell align="left">Fine</TableCell>
                                                <TableCell align="left">Max Leave</TableCell>
                                                <TableCell align="left">Leave Taken</TableCell>
                                                <TableCell align="left">Extra Leaves</TableCell>
                                                <TableCell align="left">Extra leave salary cut</TableCell>
                                                <TableCell align="left">Present days</TableCell>
                                                <TableCell align="left"></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {monthlySalary?.map((row, index) => (
                                                totalRowsMonthly !== 0 ?
                                                    <TableRow
                                                        hover
                                                        key={row.monthlySalaryId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        style={{ cursor: "pointer" }}
                                                        className='tableRow'
                                                    >
                                                        <TableCell align="left" >{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                        <Tooltip title={row.monthDate} placement="top-start" arrow>
                                                            <TableCell component="th" scope="row" >
                                                                {row.salaryMonth}
                                                            </TableCell>
                                                        </Tooltip>
                                                        <TableCell align="left" >{row.totalSalary}</TableCell>
                                                        <TableCell align="left" >{row.remainSalary} </TableCell>
                                                        <TableCell align="left" >{row.amountOfAdvance}</TableCell>
                                                        <TableCell align="left" >{row.amountOfFine}</TableCell>
                                                        <TableCell align="left" >{row.maxLeave}</TableCell>
                                                        <TableCell align="left" >{row.takenLeaves}</TableCell>
                                                        <TableCell align="left" >{row.extraLeaves}</TableCell>
                                                        <TableCell align="left" >{row.deductionSalaryOfLeave}</TableCell>
                                                        <TableCell align="left" >{row.presentDays}</TableCell>
                                                        {index == 0 && row.totalSalary == row.remainSalary && data.employeeStatus != 1 ?
                                                            <TableCell align="right">
                                                                {/* <Menutemp productId={row.productId} data={row} handleOpenStockOut={handleOpenStockOut} handleOpenStockIn={handleOpenStockIn} handleDeleteProduct={handleDeleteProduct} handleEditClick={handleEditClick} /> */}
                                                                <MenuMonthly data={row}
                                                                    handleDeleteMonthlySalary={handleDeleteMonthlySalary} handleEditInactiveDate={handleEditInactiveDate}
                                                                />
                                                            </TableCell> : <TableCell></TableCell>
                                                        }
                                                    </TableRow> :
                                                    <TableRow
                                                        key={row.userId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell align="left" style={{ fontSize: "18px" }} >{"No Data Found...!"}</TableCell>
                                                    </TableRow>

                                            ))}
                                        </TableBody>
                                    </Table>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25]}
                                        component="div"
                                        count={totalRowsMonthly}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </TableContainer>
                            </div>
                        }
                        {
                            (tabTable === '2' || tabTable === 2) && <div className='tableContainerWrapper'>
                                <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }} component={Paper}>
                                    <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
                                        <TableHead >
                                            <TableRow>
                                                <TableCell >No.</TableCell>
                                                <TableCell>Given By</TableCell>
                                                <TableCell align="left">Advance Amount</TableCell>
                                                <TableCell align="left">Remaining Advance</TableCell>
                                                <TableCell align="left">Comment</TableCell>
                                                <TableCell align="left">Date</TableCell>
                                                <TableCell align="left">Time</TableCell>
                                                <TableCell align="left"></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {advanceData?.map((row, index) => (
                                                totalRowsAdvance !== 0 ?
                                                    <TableRow
                                                        hover
                                                        key={row.advanceId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        style={{ cursor: "pointer" }}
                                                        className='tableRow'
                                                    >
                                                        <TableCell align="left" >{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                        <Tooltip title={row.userName} placement="top-start" arrow>
                                                            <TableCell component="th" scope="row" >
                                                                {row.givenBy}
                                                            </TableCell>
                                                        </Tooltip>
                                                        <TableCell align="left" >{row.advanceAmount}</TableCell>
                                                        <TableCell align="left" >{row.remainAdvanceAmount}</TableCell>
                                                        <Tooltip title={row.advanceComment} placement="top-start" arrow><TableCell align="left" ><div className='Comment'>{row.advanceComment}</div></TableCell></Tooltip>
                                                        <TableCell align="left" >{row.advanceDate}</TableCell>
                                                        <TableCell align="left" >{row.givenTime}</TableCell>
                                                        <TableCell align="right">
                                                            <MenuAdvance data={row} handleDeleteAdvance={handleDeleteAdvance} />
                                                        </TableCell>
                                                    </TableRow> :
                                                    <TableRow
                                                        key={row.userId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell align="left" style={{ fontSize: "18px" }} >{"No Data Found...!"}</TableCell>
                                                    </TableRow>

                                            ))}
                                        </TableBody>
                                    </Table>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25]}
                                        component="div"
                                        count={totalRowsAdvance}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </TableContainer>
                            </div>
                        }
                        {
                            (tabTable === '3' || tabTable === 3) && <div className='tableContainerWrapper'>
                                <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }} component={Paper}>
                                    <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
                                        <TableHead >
                                            <TableRow>
                                                <TableCell >No.</TableCell>
                                                <TableCell>Given By</TableCell>
                                                <TableCell align="left">Fine Amount</TableCell>
                                                <TableCell align="left">Remaining Fine</TableCell>
                                                <TableCell align="left">Reason</TableCell>
                                                <TableCell align="left">Fine Status</TableCell>
                                                <TableCell align="left">Date</TableCell>
                                                <TableCell align="left">Time</TableCell>
                                                <TableCell align="left"></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {fineData?.map((row, index) => (
                                                totalRowsFine !== 0 ?
                                                    <TableRow
                                                        hover
                                                        key={row.fineId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        style={{ cursor: "pointer" }}
                                                        className='tableRow'
                                                    >
                                                        <TableCell align="left" >{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                        <Tooltip title={row.userName} placement="top-start" arrow>
                                                            <TableCell component="th" scope="row" >
                                                                {row.givenBy}
                                                            </TableCell>
                                                        </Tooltip>
                                                        <TableCell align="left" >{row.fineAmount}</TableCell>
                                                        <TableCell align="left" >{row.remainFineAmount}</TableCell>
                                                        {console.log(row.reduceFineReson != null)}
                                                        <Tooltip title={row.reason + `${row.reduceFineReson != null ? ' / ' + row.reduceFineReson : ''}`} placement="top-start" arrow><TableCell align="left" ><div className='fineReducedComment'>{row.reason + `${row.reduceFineReson != null ? ' / ' + row.reduceFineReson : ''}`}</div></TableCell></Tooltip>
                                                        <TableCell align="left" >{row.fineStatusName}</TableCell>
                                                        <TableCell align="left" >{row.fineDate}</TableCell>
                                                        <TableCell align="left" >{row.givenTime}</TableCell>
                                                        <TableCell align="right">
                                                            <MenuFine data={row} handleDeleteFine={handleDeleteFine} markAsIgnore={markAsIgnore} markAsConsider={markAsConsider} handleReduceFine={handleReduceFine} />
                                                        </TableCell>
                                                    </TableRow> :
                                                    <TableRow
                                                        key={row.userId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell align="left" style={{ fontSize: "18px" }} >{"No Data Found...!"}</TableCell>
                                                    </TableRow>

                                            ))}
                                        </TableBody>
                                    </Table>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25]}
                                        component="div"
                                        count={totalRowsFine}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </TableContainer>
                            </div>
                        }
                        {
                            (tabTable === '4' || tabTable === 4) && <div className='tableContainerWrapper'>
                                <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }} component={Paper}>
                                    <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
                                        <TableHead >
                                            <TableRow>
                                                <TableCell >No.</TableCell>
                                                <TableCell>Trasaction Id</TableCell>
                                                <TableCell>Given By</TableCell>
                                                <TableCell align="left">Salary Pay</TableCell>
                                                <TableCell align="left">Advance Cut</TableCell>
                                                <TableCell align="left">Fine Cut</TableCell>
                                                <TableCell align="left">Comment</TableCell>
                                                <TableCell align="left">Date</TableCell>
                                                <TableCell align="left">Time</TableCell>
                                                <TableCell align="left"></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {transactionData?.map((row, index) => (
                                                totalRowsTransaction !== 0 ?
                                                    <TableRow
                                                        hover
                                                        key={row.trasactionId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        style={{ cursor: "pointer" }}
                                                        className='tableRow'
                                                    >
                                                        <TableCell align="left" >{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                        <TableCell align="left" >{row.trasactionId}</TableCell>
                                                        <Tooltip title={row.userName} placement="top-start" arrow>
                                                            <TableCell component="th" scope="row" >
                                                                {row.givenBy}
                                                            </TableCell>
                                                        </Tooltip>
                                                        <TableCell align="left" >{row.salaryPay}</TableCell>
                                                        <TableCell align="left" >{row.advanceCut}</TableCell>
                                                        <TableCell align="left" >{row.fineCut}</TableCell>
                                                        <Tooltip title={row.salaryComment} placement="top-start" arrow><TableCell align="left" ><div className='Comment'>{row.salaryComment}</div></TableCell></Tooltip>
                                                        <TableCell align="left" >{row.salaryDate}</TableCell>
                                                        <TableCell align="left" >{row.salaryTime}</TableCell>
                                                        <TableCell align="right">
                                                            <MenuTransaction data={row} handleDeleteTransaction={handleDeleteTransaction} getInvoice={getInvoice} handleOpenModelCalculation={handleOpenModelCalculation} />
                                                        </TableCell>
                                                    </TableRow> :
                                                    <TableRow
                                                        key={row.userId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell align="left" style={{ fontSize: "18px" }} >{"No Data Found...!"}</TableCell>
                                                    </TableRow>

                                            ))}
                                        </TableBody>
                                    </Table>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25]}
                                        component="div"
                                        count={totalRowsTransaction}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </TableContainer>
                            </div>
                        }
                        {
                            (tabTable === '5' || tabTable === 5) && <div className='tableContainerWrapper'>
                                <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }} component={Paper}>
                                    <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
                                        <TableHead >
                                            <TableRow>
                                                <TableCell >No.</TableCell>
                                                <TableCell>Given By</TableCell>
                                                <TableCell align="left">Credit Amount</TableCell>
                                                <TableCell align="left">Credit Type</TableCell>
                                                <TableCell align="left">Comment</TableCell>
                                                <TableCell align="left">Date</TableCell>
                                                <TableCell align="left">Time</TableCell>
                                                <TableCell align="left"></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {creditData?.map((row, index) => (
                                                totalRowsCredit !== 0 ?
                                                    <TableRow
                                                        hover
                                                        key={row.fineId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        style={{ cursor: "pointer" }}
                                                        className='tableRow'
                                                    >
                                                        <TableCell align="left" >{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                        <Tooltip title={row.userName} placement="top-start" arrow>
                                                            <TableCell component="th" scope="row" >
                                                                {row.givenBy}
                                                            </TableCell>
                                                        </Tooltip>
                                                        <TableCell align="left" >{row.creditAmount}</TableCell>
                                                        <TableCell align="left" >{row.creditType}</TableCell>
                                                        <Tooltip title={row.creditComent} placement="top-start" arrow><TableCell align="left" ><div className='Comment'>{row.creditComent}</div></TableCell></Tooltip>
                                                        <TableCell align="left" >{row.creditDate}</TableCell>
                                                        <TableCell align="left" >{row.givenTime}</TableCell>
                                                        <TableCell align="right">
                                                            <MenuCredit data={row} handleDeleteCredit={handleDeleteCredit} />
                                                        </TableCell>
                                                    </TableRow> :
                                                    <TableRow
                                                        key={row.userId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell align="left" style={{ fontSize: "18px" }} >{"No Data Found...!"}</TableCell>
                                                    </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25]}
                                        component="div"
                                        count={totalRowsCredit}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </TableContainer>
                            </div>
                        }
                        {
                            (tabTable === '6' || tabTable === 6) && <div className='tableContainerWrapper'>
                                <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }} component={Paper}>
                                    <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
                                        <TableHead >
                                            <TableRow>
                                                <TableCell >No.</TableCell>
                                                <TableCell>Given By</TableCell>
                                                <TableCell align="left">Bonus Amount</TableCell>
                                                <TableCell align="left">Reason</TableCell>
                                                <TableCell align="left">Date</TableCell>
                                                <TableCell align="left">Time</TableCell>
                                                <TableCell align="left"></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {bonusData?.map((row, index) => (
                                                totalRowsBonus !== 0 ?
                                                    <TableRow
                                                        hover
                                                        key={row.fineId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        style={{ cursor: "pointer" }}
                                                        className='tableRow'
                                                    >
                                                        <TableCell align="left" >{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                        <Tooltip title={row.userName} placement="top-start" arrow>
                                                            <TableCell component="th" scope="row" >
                                                                {row.givenBy}
                                                            </TableCell>
                                                        </Tooltip>
                                                        <TableCell align="left" >{row.bonusAmount}</TableCell>
                                                        <Tooltip title={row.bonusComment} placement="top-start" arrow><TableCell align="left" ><div className='Comment'>{row.bonusComment}</div></TableCell></Tooltip>
                                                        <TableCell align="left" >{row.bonusDate}</TableCell>
                                                        <TableCell align="left" >{row.givenTime}</TableCell>
                                                        <TableCell align="right">
                                                            <MenuBonus data={row} handleDeleteBonus={handleDeleteBonus} />
                                                        </TableCell>
                                                    </TableRow> :
                                                    <TableRow
                                                        key={row.userId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell align="left" style={{ fontSize: "18px" }} >{"No Data Found...!"}</TableCell>
                                                    </TableRow>

                                            ))}
                                        </TableBody>
                                    </Table>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25]}
                                        component="div"
                                        count={totalRowsBonus}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </TableContainer>
                            </div>
                        }

                    </div>
                </div>
            </div>
            <Modal
                open={openModal}
                onClose={handleCloseModel}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleStockIn}>
                    <div className='flex justify-between'>
                        <Typography id="modal-modal" variant="h6" component="h2">
                            <span className='makePaymentHeader'>Make Payment to : </span><span className='makePaymentName'>{formData.nickName}</span>
                        </Typography>
                        <Typography id="modal-modal" variant="h6" component="h2">
                            <span className='makePaymentHeader'>{'Payment Due :'}&nbsp;&nbsp;&nbsp;&nbsp;</span><span className='makePaymentName'>{formData.paymentDue}</span>
                        </Typography>
                    </div>
                    <div className='flex justify-between mt-3 mb-2'>
                        <Typography id="modal-modal" variant="h6" component="h2">
                            <span className='makePaymentHeader'>{'Salary (From - To) :'} </span><span className='makePaymentName'>{formData.dateOfPayment}</span>
                        </Typography>
                        <Typography id="modal-modal" variant="h6" component="h2">
                            <span className='makePaymentHeader'>{'Total Salary(With Leave) :'}&nbsp;&nbsp;&nbsp;&nbsp;</span><span className='makePaymentName'>{formData.totalSalary}</span>
                        </Typography>
                    </div>
                    <div className='mt-6 grid grid-cols-12 gap-6'>
                        <div className='col-span-4'>
                            <TextField
                                onBlur={(e) => {
                                    if (e.target.value < 0) {
                                        setFormDataError((perv) => ({
                                            ...perv,
                                            payAmount: true
                                        }))
                                    }
                                    else {
                                        setFormDataError((perv) => ({
                                            ...perv,
                                            payAmount: false
                                        }))
                                    }
                                }}
                                type="number"
                                label="Paid Amount"
                                fullWidth
                                onChange={onChange}
                                value={formData.payAmount}
                                error={formDataError.payAmount}
                                // helperText={formData.supplierName && !formDataError.productQty ? `Remain Payment  ${formData.remainingAmount}` : formDataError.paidAmount ? formData.paidAmount > formData.remainingAmount ? `Payment Amount can't be more than ${formData.remainingAmount}` : "Please Enter Amount" : ''}
                                // helperText={formData.amountType == 1 ? formData.payAmount ? formData.payAmount > formData.totalSalary ? `Amount can't be more than ${formData.totalSalary}` : `Remaining Payment ${formData.paymentDue}` : formDataError.totalSalary ? "Please Enter Amount" : `Remaining Payment ${formData.paymentDue}` : ''}
                                name="payAmount"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><CurrencyRupeeIcon /></InputAdornment>,
                                }}
                            />
                        </div>
                        <div className="col-span-4">
                            <FormControl style={{ minWidth: '100%' }}>
                                <InputLabel id="demo-simple-select-label" required error={formDataError.amountType}>Payment Type</InputLabel>
                                <Select
                                    onBlur={(e) => {
                                        if (!e.target.value) {
                                            setFormDataError((perv) => ({
                                                ...perv,
                                                amountType: true
                                            }))
                                        }
                                        else {
                                            setFormDataError((perv) => ({
                                                ...perv,
                                                amountType: false
                                            }))
                                        }
                                    }}
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={formData.amountType}
                                    error={formDataError.amountType}
                                    name="amountType"
                                    label="Payment Type"
                                    onChange={onChange}
                                >
                                    <MenuItem key={1} value={1}>{"Salary"}</MenuItem>
                                    <MenuItem key={2} value={2}>{"Advanced"}</MenuItem>
                                    <MenuItem key={3} value={3}>{"Fine"}</MenuItem>
                                    <MenuItem key={4} value={4}>{"Advance Credit"}</MenuItem>
                                    <MenuItem key={5} value={5}>{"Fine Credit"}</MenuItem>
                                    <MenuItem key={6} value={6}>{"Bonus"}</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div className='col-span-4'>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DesktopDatePicker
                                    textFieldStyle={{ width: '100%' }}
                                    InputProps={{ style: { fontSize: 14, width: '100%' } }}
                                    InputLabelProps={{ style: { fontSize: 14 } }}
                                    label="Payment Date"
                                    format="DD/MM/YYYY"
                                    required
                                    error={formDataError.amountDate}
                                    value={dayjs(formData.amountDate)}
                                    onChange={handlePaymentData}
                                    name="amountDate"
                                    renderInput={(params) => <TextField {...params} sx={{ width: '100%' }} />}
                                />
                            </LocalizationProvider>
                        </div>
                    </div>
                    <div className='mt-4 grid grid-cols-12 gap-6'>
                        <div className='col-span-12'>
                            <TextField
                                disabled={formData.remainingAmount == 0}
                                onChange={onChange}
                                value={formData.comment}
                                name="comment"
                                id="outlined-required"
                                label="Comment"
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                fullWidth
                            />
                        </div>
                    </div>
                    <div className='mt-4 grid grid-cols-12 gap-6'>
                        {
                            isToggel &&
                            <div className='col-span-3'>
                                <button className='keepItAsItIsBtn' onClick={() => {
                                    makeInActive(false)
                                }}>Just InActive</button>
                            </div>
                        }
                        <div className='col-span-3 col-start-7'>
                            <button className='addCategorySaveBtn' onClick={() => {
                                isToggel ? makeInActive(true) : submit();
                            }}>Make Payment</button>
                        </div>
                        <div className='col-span-3'>
                            <button className='addCategoryCancleBtn' onClick={() => {
                                handleCloseModel();
                            }}>Cancle</button>
                        </div>
                    </div>
                </Box>
            </Modal>
            <Modal
                open={openAddLeave}
                onClose={handleCloseAddLeave}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleStockIn}>
                    <div className='flex justify-between'>
                        <Typography id="modal-modal" variant="h6" component="h2">
                            <span className='makePaymentHeader'> {editLeave ? 'Edit Leave for : ' : 'Add Leave for : '} </span><span className='makePaymentName'>{addLeaveFormData.nickName}</span>
                        </Typography>
                        <Typography id="modal-modal" variant="h6" component="h2">
                            <span className='makePaymentHeader'>{`Available Leave(${'Max leave:' + addLeaveFormData.totalMaxLeave}) :`}&nbsp;&nbsp;&nbsp;&nbsp;</span><span className='makePaymentName'>{addLeaveFormData.availableLeave}</span>
                        </Typography>
                    </div>
                    <div className='mt-6 grid grid-cols-12 gap-6'>
                        <div className='col-span-6'>
                            <TextField
                                onBlur={(e) => {
                                    if (e.target.value < 0) {
                                        setAddLeaveFormDataError((perv) => ({
                                            ...perv,
                                            numLeave: true
                                        }))
                                    }
                                    else {
                                        setAddLeaveFormDataError((perv) => ({
                                            ...perv,
                                            numLeave: false
                                        }))
                                    }
                                }}
                                type="number"
                                label="Add Leave"
                                fullWidth
                                onChange={onChangeLeave}
                                value={addLeaveFormData.numLeave}
                                error={addLeaveFormDataError.numLeave || (addLeaveFormData.numLeave > addLeaveFormData.maxLeave)}
                                helperText={addLeaveFormData.numLeave && addLeaveFormData.numLeave > addLeaveFormData.maxLeave ? `Leaves can not be greater than ${addLeaveFormData.maxLeave}` : addLeaveFormDataError.numLeave ? 'Please enter leave' : `Max Leave is ${addLeaveFormData.maxLeave}`}
                                name="numLeave"
                            />
                        </div>
                        <div className='col-span-6'>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DesktopDatePicker
                                    textFieldStyle={{ width: '100%' }}
                                    InputProps={{ style: { fontSize: 14, width: '100%' } }}
                                    InputLabelProps={{ style: { fontSize: 14 } }}
                                    label="Leave Date"
                                    format="DD/MM/YYYY"
                                    required
                                    maxDate={dayjs(addLeaveFormData.maxDate)}
                                    minDate={dayjs(addLeaveFormData.minDate)}
                                    error={addLeaveFormDataError.leaveDate}
                                    value={dayjs(addLeaveFormData.leaveDate)}
                                    onChange={handleLeaveDate}
                                    name="leaveDate"
                                    renderInput={(params) => <TextField {...params} sx={{ width: '100%' }} />}
                                />
                            </LocalizationProvider>
                        </div>
                    </div>
                    <div className='mt-4 grid grid-cols-12 gap-6'>
                        <div className='col-span-12'>
                            <TextField
                                onBlur={(e) => {
                                    if (e.target.value < 4) {
                                        setAddLeaveFormDataError((perv) => ({
                                            ...perv,
                                            leaveReason: true
                                        }))
                                    }
                                    else {
                                        setAddLeaveFormDataError((perv) => ({
                                            ...perv,
                                            leaveReason: false
                                        }))
                                    }
                                }}
                                onChange={onChangeLeave}
                                value={addLeaveFormData.leaveReason ? addLeaveFormData.leaveReason : ''}
                                name="leaveReason"
                                id="outlined-required"
                                label="Reason"
                                InputProps={{ style: { fontSize: 14 } }}
                                InputLabelProps={{ style: { fontSize: 14 } }}
                                error={addLeaveFormDataError.leaveReason}
                                helperText={addLeaveFormDataError.leaveReason ? 'Please enter Reason' : ''}
                                fullWidth
                            />
                        </div>
                    </div>
                    <div className='mt-4 grid grid-cols-12 gap-6'>
                        <div className='col-span-3 col-start-7'>
                            <button className='addCategorySaveBtn' onClick={() => {
                                editLeave ? submitEditLeave() : submitLeave()
                            }}>{editLeave ? 'Edit Leave' : 'Add Leave'}</button>
                        </div>
                        <div className='col-span-3'>
                            <button className='addCategoryCancleBtn' onClick={() => {
                                handleCloseAddLeave();
                            }}>Cancle</button>
                        </div>
                    </div>
                </Box>
            </Modal>
            <Modal
                open={openModalEditInActiveDate}
                onClose={handleCloseModelInActiveDateEdit}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleStockIn}>
                    <div className='flex justify-between'>
                        <Typography id="modal-modal" variant="h6" component="h2">
                            <span className='makePaymentHeader'>Edit InActive Date</span>
                        </Typography>
                    </div>
                    <div className='mt-6 grid grid-cols-12 gap-6'>
                        <div className='col-span-4'>
                            {editFormData &&
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DesktopDatePicker
                                        textFieldStyle={{ width: '100%' }}
                                        InputProps={{ style: { fontSize: 14, width: '100%' } }}
                                        InputLabelProps={{ style: { fontSize: 14 } }}
                                        label="Inactive Date"
                                        format="DD/MM/YYYY"
                                        required
                                        minDate={dayjs(editFormData.minDate)}
                                        maxDate={dayjs(editFormData.maxDate)}
                                        // error={editFormData.amountDate}
                                        value={editFormData.newDate}
                                        onChange={handleInactiveDate}
                                        name="newDate"
                                        renderInput={(params) => <TextField {...params} sx={{ width: '100%' }} />}
                                    />
                                </LocalizationProvider>}
                        </div>
                    </div>
                    <div className='mt-4 grid grid-cols-12 gap-6'>
                        <div className='col-span-3 col-start-7'>
                            <button className='addCategorySaveBtn' onClick={() => {
                                editInActiveDate(editFormData.monthlySalaryId)
                            }}>Edit Date</button>
                        </div>
                        <div className='col-span-3'>
                            <button className='addCategoryCancleBtn' onClick={() => {
                                handleCloseModelInActiveDateEdit()
                            }}>Cancle</button>
                        </div>
                    </div>
                </Box>
            </Modal>
            <Modal
                open={openModalEditFine}
                onClose={handleCloseModelFineEdit}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleStockIn}>
                    <div className='flex justify-between'>
                        <Typography id="modal-modal" variant="h6" component="h2">
                            <span className='makePaymentHeader'>Reduce Fine</span>
                        </Typography>
                    </div>
                    <div className='mt-6 grid grid-cols-12 gap-6'>
                        <div className='col-span-6'>
                            {editFormData &&
                                <TextField
                                    label="Fine Amount"
                                    fullWidth
                                    onChange={onChangeFine}
                                    value={editFormData.reducedFine}
                                    error={editFormData.reducedFine > editFormData.currentFine || editFormData.reducedFine <= 0}
                                    helperText={editFormData.reducedFine > editFormData.currentFine ? `Fine Can not be more than ${editFormData.currentFine}` : editFormData.reducedFine <= 0 ? `Fine Can not be 0 or less than 0` : `Current Fine value is ${editFormData.currentFine} and reduced fine amount is ${editFormData.currentFine - editFormData.reducedFine}`}
                                    name="reducedFine"
                                />}
                        </div>
                    </div>
                    <div className='mt-4 grid grid-cols-12 gap-6'>
                        <div className='col-span-3 col-start-7'>
                            <button className='addCategorySaveBtn' onClick={() => {
                                updateFine(editFormData.fineId)
                            }}>Reduce Fine</button>
                        </div>
                        <div className='col-span-3'>
                            <button className='addCategoryCancleBtn' onClick={() => {
                                handleCloseModelFineEdit()
                            }}>Cancle</button>
                        </div>
                    </div>
                </Box>
            </Modal>
            <Modal
                open={openModalCalculation}
                onClose={handleCloseModelCalculation}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={viewCutTable}>
                    <div className='flex justify-between'>
                        <div className='pt-1 pl-2'>
                            <Typography id="modal-modal" variant="h6" component="h2">
                                <span className='makePaymentHeader'>Paid Salary Calculation</span>
                            </Typography>
                        </div>
                        <div>
                            <IconButton aria-label="delete" onClick={handleCloseModelCalculation}>
                                <CloseIcon />
                            </IconButton>
                        </div>
                    </div>
                    <div className='flex justify-between'>
                        <div className='pt-1 pl-2'>
                            <Typography id="modal-modal" variant="h6" component="h2">
                                <span className='makePaymentHeader'>Total Payment : </span><span className='makePaymentName'>{"10000"}</span>
                            </Typography>
                        </div>
                    </div>
                    <div className='displayTable' style={{ maxHeight: '85%', overflow: "scroll" }}>
                        {/* <div className='mt-4 pb-2 displayTable mb-4' style={{ maxHeight: '320px', overflow: 'hidden' }}> */}
                        {/* <Paper sx={{ width: '100%', overflow: 'hidden' }}> */}
                        {/* <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', maxHeight: '300px' }} component={Paper}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead >
                                        <TableRow>
                                            <TableCell >No.</TableCell>
                                            <TableCell>Month</TableCell>
                                            <TableCell>Total Salary</TableCell>
                                            <TableCell align="left">Remaining Salary</TableCell>
                                            <TableCell align="left">Salary Cut</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {transactionData?.map((row, index) => (
                                            totalRowsTransaction !== 0 ?
                                                <TableRow
                                                    hover
                                                    key={row.trasactionId}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    style={{ cursor: "pointer" }}
                                                    className='tableRow'
                                                >
                                                    <TableCell align="left" >{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                    <TableCell align="left" >{row.trasactionId}</TableCell>
                                                    <Tooltip title={row.userName} placement="top-start" arrow>
                                                        <TableCell component="th" scope="row" >
                                                            {row.givenBy}
                                                        </TableCell>
                                                    </Tooltip>
                                                    <TableCell align="left" onClick={() => handleOpenModelCalculation(row.trasactionId, 1)}>{row.salaryPay}</TableCell>
                                                    <TableCell align="left" onClick={() => handleOpenModelCalculation(row.trasactionId, 2)}>{row.advanceCut}</TableCell>
                                                </TableRow> :
                                                <TableRow
                                                    key={row.userId}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell align="left" style={{ fontSize: "18px" }} >{"No Data Found...!"}</TableCell>
                                                </TableRow>
                                        ))}
                                        {transactionData?.map((row, index) => (
                                            totalRowsTransaction !== 0 ?
                                                <TableRow
                                                    hover
                                                    key={row.trasactionId}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    style={{ cursor: "pointer" }}
                                                    className='tableRow'
                                                >
                                                    <TableCell align="left" >{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                    <TableCell align="left" >{row.trasactionId}</TableCell>
                                                    <Tooltip title={row.userName} placement="top-start" arrow>
                                                        <TableCell component="th" scope="row" >
                                                            {row.givenBy}
                                                        </TableCell>
                                                    </Tooltip>
                                                    <TableCell align="left" onClick={() => handleOpenModelCalculation(row.trasactionId, 1)}>{row.salaryPay}</TableCell>
                                                    <TableCell align="left" onClick={() => handleOpenModelCalculation(row.trasactionId, 2)}>{row.advanceCut}</TableCell>
                                                </TableRow> :
                                                <TableRow
                                                    key={row.userId}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell align="left" style={{ fontSize: "18px" }} >{"No Data Found...!"}</TableCell>
                                                </TableRow>
                                        ))}
                                        {transactionData?.map((row, index) => (
                                            totalRowsTransaction !== 0 ?
                                                <TableRow
                                                    hover
                                                    key={row.trasactionId}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    style={{ cursor: "pointer" }}
                                                    className='tableRow'
                                                >
                                                    <TableCell align="left" >{(index + 1) + (page * rowsPerPage)}</TableCell>
                                                    <TableCell align="left" >{row.trasactionId}</TableCell>
                                                    <Tooltip title={row.userName} placement="top-start" arrow>
                                                        <TableCell component="th" scope="row" >
                                                            {row.givenBy}
                                                        </TableCell>
                                                    </Tooltip>
                                                    <TableCell align="left" onClick={() => handleOpenModelCalculation(row.trasactionId, 1)}>{row.salaryPay}</TableCell>
                                                    <TableCell align="left" onClick={() => handleOpenModelCalculation(row.trasactionId, 2)}>{row.advanceCut}</TableCell>
                                                </TableRow> :
                                                <TableRow
                                                    key={row.userId}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell align="left" style={{ fontSize: "18px" }} >{"No Data Found...!"}</TableCell>
                                                </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer> */}
                        {/* </Paper> */}
                        <div className='mt-6'>
                            <Accordion square='false' sx={{ width: "100%", borderRadius: '12px', boxShadow: 'rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem', padding: '0px' }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography>Salary Cut Details</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }} component={Paper}>
                                        <Table stickyHeader aria-label="sticky table">
                                            <TableHead >
                                                <TableRow>
                                                    <TableCell >No.</TableCell>
                                                    <TableCell>Month</TableCell>
                                                    <TableCell>Total Salary</TableCell>
                                                    <TableCell align="left">Remaining Salary</TableCell>
                                                    <TableCell align="left">Salary Cut</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {calculationData && calculationData.monthlySalaryCut.length > 0 ? calculationData.monthlySalaryCut.map((row, index) => (
                                                    <TableRow
                                                        hover
                                                        key={row.monthlySalaryId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        style={{ cursor: "pointer" }}
                                                        className='tableRow'
                                                    >
                                                        <TableCell align="left" >{(index + 1)}</TableCell>
                                                        <TableCell align="left" >{row.monthYear}</TableCell>
                                                        {/* <Tooltip title={row.userName} placement="top-start" arrow> */}
                                                        <TableCell component="th" scope="row" >
                                                            {row.originalTotalSalary}
                                                        </TableCell>
                                                        {/* </Tooltip> */}
                                                        <TableCell align="left">{row.totalSalary}</TableCell>
                                                        <TableCell align="left">{row.cutSalaryAmount}</TableCell>
                                                    </TableRow>

                                                ))
                                                    : <TableRow
                                                        key={"salary"}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell align="left" style={{ fontSize: "18px" }} >{"No Data"}</TableCell>
                                                    </TableRow>
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </AccordionDetails>
                            </Accordion>
                        </div>
                        <div className='mt-6'>
                            <Accordion square='false' sx={{ width: "100%", borderRadius: '12px', boxShadow: 'rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem', padding: '0px' }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography>Advance Cut Details</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }} component={Paper}>
                                        <Table stickyHeader aria-label="sticky table">
                                            <TableHead >
                                                <TableRow>
                                                    <TableCell >No.</TableCell>
                                                    <TableCell>Advance Amount</TableCell>
                                                    <TableCell>Advance Remaining</TableCell>
                                                    <TableCell align="left">Advance Cut</TableCell>
                                                    <TableCell align="left">Advance Date</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {calculationData && calculationData.advanceSalaryCut.length > 0 ? calculationData.advanceSalaryCut.map((row, index) => (
                                                    <TableRow
                                                        hover
                                                        key={row.advanceId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        style={{ cursor: "pointer" }}
                                                        className='tableRow'
                                                    >
                                                        <TableCell align="left" >{(index + 1)}</TableCell>
                                                        <TableCell align="left" >{row.advanceAmount}</TableCell>
                                                        {/* <Tooltip title={row.userName} placement="top-start" arrow> */}
                                                        <TableCell component="th" scope="row" >
                                                            {row.remainAdvanceAmount}
                                                        </TableCell>
                                                        {/* </Tooltip> */}
                                                        <TableCell align="left">{row.cutAdvanceAmount}</TableCell>
                                                        <TableCell align="left">{row.advanceDate}</TableCell>
                                                    </TableRow>
                                                ))
                                                    : <TableRow
                                                        key={'advance'}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell align="left" style={{ fontSize: "18px" }} >{"No Data"}</TableCell>
                                                    </TableRow>
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </AccordionDetails>
                            </Accordion>
                        </div>
                        <div className='mt-6'>
                            <Accordion square='false' sx={{ width: "100%", borderRadius: '12px', boxShadow: 'rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem', padding: '0px' }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography>Fine Cut Details</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <TableContainer sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }} component={Paper}>
                                        <Table stickyHeader aria-label="sticky table">
                                            <TableHead >
                                                <TableRow>
                                                    <TableCell >No.</TableCell>
                                                    <TableCell>Fine Amount</TableCell>
                                                    <TableCell>Fine Remaining</TableCell>
                                                    <TableCell align="left">Fine Cut</TableCell>
                                                    <TableCell align="left">Fine Date</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {calculationData && calculationData.fineSalaryCut.length > 0 ? calculationData.fineSalaryCut.map((row, index) => (
                                                    <TableRow
                                                        hover
                                                        key={row.fineId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        style={{ cursor: "pointer" }}
                                                        className='tableRow'
                                                    >
                                                        <TableCell align="left" >{(index + 1)}</TableCell>
                                                        <TableCell align="left" >{row.fineAmount}</TableCell>
                                                        {/* <Tooltip title={row.userName} placement="top-start" arrow> */}
                                                        <TableCell component="th" scope="row" >
                                                            {row.remainFineAmount}
                                                        </TableCell>
                                                        {/* </Tooltip> */}
                                                        <TableCell align="left">{row.cutFineAmount}</TableCell>
                                                        <TableCell align="left">{row.fineDate}</TableCell>
                                                    </TableRow>
                                                ))
                                                    : <TableRow
                                                        key={'advance'}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell align="left" style={{ fontSize: "18px" }} >{"No Data"}</TableCell>
                                                    </TableRow>
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </AccordionDetails>
                            </Accordion>
                        </div>
                        <div className='mt-10'>
                            <div className='calculationWrp'>
                                <div className='grid grid-cols-12 calculationFont'>
                                    <div className='col-span-3'>
                                        Total Salary
                                    </div>
                                    <div>
                                        :
                                    </div>
                                    <div className='col-span-3 '>
                                        10000
                                    </div>
                                </div>
                                <div className='grid grid-cols-12 calculationFont'>
                                    <div className='col-span-3 '>
                                        Total Advance
                                    </div>
                                    <div>
                                        :
                                    </div>
                                    <div className='col-span-3'>
                                        10000
                                    </div>
                                </div>
                                <div className='grid grid-cols-12 calculationFont'>
                                    <div className='col-span-3 '>
                                        Total Fine
                                    </div>
                                    <div>
                                        :
                                    </div>
                                    <div className='col-span-3 calculationFont'>
                                        10000
                                    </div>
                                </div>
                                <div className='lineBreak mt-4 mb-4'>
                                    <hr className='lineBreakHr'></hr>
                                </div>
                                <div className='grid grid-cols-12 calculationFont'>
                                    <div className='col-span-3'>
                                        Salary Pay
                                    </div>
                                    <div>
                                        :
                                    </div>
                                    <div className='col-span-3 '>
                                        {editFormData && editFormData.salary}
                                    </div>
                                </div>
                                <div className='grid grid-cols-12 calculationFont'>
                                    <div className='col-span-3 '>
                                        Advance Cut
                                    </div>
                                    <div>
                                        :
                                    </div>
                                    <div className='col-span-3'>
                                        {editFormData && editFormData.advance}
                                    </div>
                                </div>
                                <div className='grid grid-cols-12 calculationFont'>
                                    <div className='col-span-3 '>
                                        Fine Cut
                                    </div>
                                    <div>
                                        :
                                    </div>
                                    <div className='col-span-3 calculationFont'>
                                        {editFormData && editFormData.fine}
                                    </div>
                                </div>
                                <div className='lineBreak mt-4 mb-4'>
                                    <hr className='lineBreakHr'></hr>
                                </div>
                                <div className='grid grid-cols-12 calculationFont'>
                                    <div className='col-span-3'>
                                        Remaining Salary
                                    </div>
                                    <div>
                                        :
                                    </div>
                                    <div className='col-span-3 '>
                                        10000
                                    </div>
                                </div>
                                <div className='grid grid-cols-12 calculationFont'>
                                    <div className='col-span-3 '>
                                        Remaining Advance
                                    </div>
                                    <div>
                                        :
                                    </div>
                                    <div className='col-span-3'>
                                        10000
                                    </div>
                                </div>
                                <div className='grid grid-cols-12 calculationFont'>
                                    <div className='col-span-3 '>
                                        Remaining Fine
                                    </div>
                                    <div>
                                        :
                                    </div>
                                    <div className='col-span-3 calculationFont'>
                                        10000
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Box>
            </Modal>
            <ToastContainer />
        </div >
    )
}

export default EmployeeDetails;