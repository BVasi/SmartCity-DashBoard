import { jwtDecode } from "jwt-decode";

export const isUserAdmin = () => {
    const token = localStorage.getItem('authToken');
    if (!token)
    {
        return false;
    }
    try
    {
        const decodedToken = jwtDecode(token);
        return decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === 'Admin';
    } catch (error)
    {
        return false;
    }
}

export const isJwtExpired = () => {
    const token = localStorage.getItem('authToken');
    if (!token)
    {
        return true;
    }
    try
    {
        const decodedToken = jwtDecode(token);
        return decodedToken.exp < (Date.now() / 1000);
    } catch (error)
    {
        return true;
    }
}

export const getUserEmail = () => {
    const token = localStorage.getItem('authToken');
    if (!token)
    {
        return false;
    }
    try
    {
        const decodedToken = jwtDecode(token);
        return decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
    } catch (error)
    {
        return false;
    }
}