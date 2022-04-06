import { Outlet, Navigate } from 'react-router-dom';
import Authentication from './authentication';

export const LogOutGuard = () => {
    return (!Authentication.isAuthinticated()) ? <Outlet /> : <Navigate to="/" />
}

export const LogInGuard = () => {
    return Authentication.isAuthinticated() ? <Outlet /> : <Navigate to="/log-in" />
}