import { NavLink } from 'react-router'
import './NavBar.css'

function NavBar() {
    return (
        <>
        <nav>
            <a>TKMarket</a>
            <ul>
                <li><NavLink to="/">Home</NavLink></li>
                <li><NavLink to="/products">Products</NavLink></li>
                <li><NavLink to="/account">Account</NavLink></li>
                <li><NavLink to="/register">Register</NavLink></li>
            </ul>
        </nav>
        </>
    )
}

export default NavBar