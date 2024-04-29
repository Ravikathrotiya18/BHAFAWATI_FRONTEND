/* eslint-disable no-unused-vars */
import logo from './logo.svg';
import './App.css';
import PageNotFoundRedirect from "./pageNotFound";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from './pages/login/login';
import Dashboard from './pages/inventory/dashboard/dashboard';
import ProtectedUserRoutes from './protectedUserRoutes';
import NavBar from './pages/navBar/nav';
import AddUser from './pages/users/addUser/addUser'
import UserTable from './pages/users/userTable/userTable';
import EditUser from './pages/users/editUser/editUser';
import AddSuppiler from './pages/inventory/addSuppiler/addSuppiler';
import SuppilerTable from './pages/inventory/suppilerTable/suppilerTable';
import EditSuppiler from './pages/inventory/editSuppiler/editSuppiler';
import ProductList from './pages/inventory/product/productList';
import CategoriesTable from './pages/inventory/categoriesTable/categoriesTable';
import StockInOut from './pages/inventory/stockManagement/stockInOut';
import TransactionTable from './pages/inventory/transactionTable/transactionTable';
import SuppilerDetail from './pages/inventory/suppilerDetails/suppilerDetail';
import ProductDetails from './pages/inventory/productDetails/productDetails';
import ProductListTable from './pages/inventory/productListTable/productListTable';
import 'react-toastify/dist/ReactToastify.css';
import EditHistory from './pages/inventory/editHistory/editHistory';
import StockOut from './pages/inventory/stockOut/stockOut';
import ProtectedStockManagerRoutes from './protectedStockManageRoutes';
import AddEditStaff from './pages/staffManagement/addStaff/addStaff';
import StaffList from './pages/staffManagement/staffList/staffList';
import StaffCategoryTable from './pages/staffManagement/staffCategoriesTable/staffCategoriesTable';
import EmployeeDetails from './pages/staffManagement/employeeDetail/employDetails';
import ProtectedAdminRoutes from './protectedAdminRoutes';
import AllPayments from './pages/staffManagement/allPayment/allPayment';
import Leaves from './pages/staffManagement/leaves/leaves';
import PrintButton from './testThermal';
import ProductDetailsManager from './pages/inventory/stockOut/productDetailsManager';
import StockOutByCategory from './pages/inventory/categoryDetail/categoryDetail';
import ExpenseDashboard from './pages/expense/dashboard/dashboard';
import SubCategoryTable from './pages/expense/subCategory/subCategory';
import SubCategoryDetail from './pages/expense/subCategoryDetail/subCategoryDetail';
import BankDashboard from './pages/bank/dashboard/dashboard';
import BankDetail from './pages/bank/bankDetail/bankDetail';
import ExpenseTable from './pages/expense/expenseTable/expenseTable';
import ExpenseTableSubCategory from './pages/expense/subCategoryExpenseTable/expenseTable';
import BillingDashboard from './biling/bilingPages/Dashboard/Dashboard'
import BusinessReport from './pages/businessReport/businessReport';
import AddCategory from './biling/bilingPages/Category/AddCategory';
import Unit from './biling/bilingPages/Unit/Unit';
// import SetPrinter from './setPrinter';
import SubCategory from './biling/bilingPages/SubCategory/SubCategory';
import MenuCategory from './biling/bilingPages/MenuCategory/MenuCategory';



function App() {
  return (
    <div className="">
      <BrowserRouter>
        <NavBar />
        <div className='mainBody'>
          <Routes>
            <Route path="/" element={<ProtectedStockManagerRoutes />}>
              <Route path="/stockOut" element={<StockOut />} />
              <Route path="/stockManager/productDetail/:id/:name/:unit/:remainingQty" element={<ProductDetailsManager />} />
              {/* <Route path='list' exact element={<AgentList />}/> */}
              <Route path='*' element={<PageNotFoundRedirect />} />
            </Route>
            <Route path="/" element={<ProtectedAdminRoutes />}>
              <Route path="/staff/addStaff" element={<AddEditStaff />} />
              <Route path="/staff/staffList" element={<StaffList />} />
              <Route path="/staff/staffCategory" element={<StaffCategoryTable />} />
              <Route path="/staff/allPayments" element={<AllPayments />} />
              <Route path="/staff/leaves" element={<Leaves />} />
              <Route path="/staff/editStaff/:id" element={<AddEditStaff />} />
              <Route path="/staff/employeeDetail/:id" element={<EmployeeDetails />} />
            </Route>
            <Route path="/" element={<ProtectedAdminRoutes />}>
              <Route path="/businessReport" element={<BusinessReport />} />
              <Route path="/expense/dashboard" element={<ExpenseDashboard />} />
              {/* <Route path="/expense/subCategories/:categoryId" element={<SubCategoryTable/>}/> */}
              <Route path="/expense/subCategory/:categoryName/:subCategoryName/expenses/:categoryId/:subCategoryId" element={<ExpenseTableSubCategory />} />
              <Route path="/expense/mainCategory/:categoryName/expenses/:categoryId" element={<ExpenseTable />} />
              <Route path="/expense/mainCategory/:categoryName/:categoryId" element={<SubCategoryTable />} />
              {/* <Route path="/staff/addStaff" element={<AddEditStaff/>}/>
                  <Route path="/staff/staffList" element={<StaffList/>}/>
                  <Route path="/staff/staffCategory" element={<StaffCategoryTable/>}/>
                  <Route path="/staff/allPayments" element={<AllPayments/>}/>
                  <Route path="/staff/leaves" element={<Leaves/>}/>
                  <Route path="/staff/editStaff/:id" element={<AddEditStaff/>}/>
                  <Route path="/staff/employeeDetail/:id" element={<EmployeeDetails/>}/> */}
            </Route>
            <Route path="/" element={<ProtectedAdminRoutes />}>
              <Route path="/bank/dashboard" element={<BankDashboard />} />
              <Route path="/bank/detail/:id" element={<BankDetail />} />
              {/* <Route path="/expense/subCategories/:categoryId" element={<SubCategoryTable/>}/>
                  <Route path="/expense/subCategory/:categoryId" element={<SubCategoryDetail/>}/> */}
              {/* <Route path="/staff/addStaff" element={<AddEditStaff/>}/>
                  <Route path="/staff/staffList" element={<StaffList/>}/>
                  <Route path="/staff/staffCategory" element={<StaffCategoryTable/>}/>
                  <Route path="/staff/allPayments" element={<AllPayments/>}/>
                  <Route path="/staff/leaves" element={<Leaves/>}/>
                  <Route path="/staff/editStaff/:id" element={<AddEditStaff/>}/>
                  <Route path="/staff/employeeDetail/:id" element={<EmployeeDetails/>}/> */}
            </Route>
            <Route path="/" element={<ProtectedUserRoutes />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/addUser" element={<AddUser />} />
              <Route path="/addSuppiler" element={<AddSuppiler />} />
              <Route path="/userTable" element={<UserTable />} />
              <Route path="/productList" element={<ProductList />} />
              <Route path="/productTable" element={<ProductListTable />} />
              <Route path="/stockInOut" element={<StockInOut />} />
              <Route path="/transactionTable" element={<TransactionTable />} />
              <Route path="/suppilerTable" element={<SuppilerTable />} />
              <Route path="/categories" element={<CategoriesTable />} />
              <Route path="/editUser/:id" element={<EditUser />} />
              <Route path="/editHistory/:id" element={<EditHistory />} />
              <Route path="/editSuppiler/:id" element={<EditSuppiler />} />
              <Route path="/suppilerDetails/:id" element={<SuppilerDetail />} />
              <Route path="/stockOutByCategory/:category/:categoryId" element={<StockOutByCategory />} />
              <Route path="/productDetails/:id/:name/:unit/:remainingQty" element={<ProductDetails />} />
              {/* <Route path="/dashboard" element={<Dashboard/>}/>
                  <Route path="/dealer/:id" element={<DealerDetail/>}/>
                  <Route path="/editDealer/:id" element={<EditDealer/>}/>
                  <Route path="/vehicleDetail/:id" element={<VehicleDetail/>}/>
                  <Route path="/editVehicleDetail/:id" element={<EditBook/>}/>
                  <Route path="/TTO" element={<TtoBookList/>}/>
                  <Route path="/RRF" element={<RrfBookList/>}/>
                  <Route path="/OTHER" element={<OtherBookList/>}/>
                  <Route path="/bookList" element={<AllBookList/>}/> */}
            </Route>
            <Route path='/thermal' exact element={<PrintButton />} />
            {/* <Route path='/setPrinter' exact element={<SetPrinter />}/> */}
            <Route path='/login' exact element={<LoginPage />} />
            <Route path='*' element={<PageNotFoundRedirect />} />
            {/* Billing Routes */}
            <Route path='/billing/Dashboard' element={<BillingDashboard />} />
            <Route path='/billing/Category' element={<AddCategory />} />
            <Route path='/billing/Unit' element={<Unit />} />
            <Route path='/billing/SubCategory' element={<SubCategory />} />
            <Route path='/billing/MenuCategory' element={<MenuCategory />} />
          </Routes>
          <Routes>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
