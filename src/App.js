import './App.css';
import LogInPage from './pages/LogIn';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './shared/Navbar';
import UsersPage from './pages/Users';
import VendorsPage from './pages/Vendors';
import OrdersPage from './pages/Orders';
import CategoriesPage from './pages/Categories';
import SubCategoriesPage from './pages/SubCategories';
import ProductsPage from './pages/Products';
import { LogInGuard,LogOutGuard } from './auth/authGuards'
function App() {
  return (
    <BrowserRouter>
      <Navbar />  
      <Routes>
        <Route exact path='/log-in' element={<LogOutGuard />}>
          <Route path="/log-in" element={<LogInPage />} />
        </Route>
        <Route exact path='/users' element={<LogInGuard />}>
          <Route path="/users" element={<UsersPage />} />
        </Route>
        <Route exact path='/vendors' element={<LogInGuard />}>
          <Route path="/vendors" element={<VendorsPage />} />
        </Route>
        <Route exact path='/orders' element={<LogInGuard />}>
          <Route path="/orders" element={<OrdersPage />} />
        </Route>
        <Route exact path='/categories' element={<LogInGuard />}>
          <Route path="/categories" element={<CategoriesPage />} />
        </Route>
        <Route exact path='/subCategories/:categoryName' element={<LogInGuard />}>
          <Route path="/subCategories/:categoryName" element={<SubCategoriesPage />} />
        </Route>
        <Route exact path='/products' element={<LogInGuard />}>
          <Route path="/products" element={<ProductsPage />} />
        </Route>
        <Route path="*" element={<div>404 - NotFound</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
