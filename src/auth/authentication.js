import axios from "axios"
class Authentication {
    LogIn(data){
        return axios.put('http://localhost:3000/auth',data)
    }

    LogOut(){
        localStorage.removeItem('token');
    }

    isAuthinticated(){
        return localStorage.getItem('token');
    }
}

export default new Authentication()