import logo from '../public/logo.png'

export default function Header() {
    return(
        <div className="header">
            <div className="container">
                <div className="header__inner">
                    <img className="header__logo" src={logo} alt="logo" />
                </div>
            </div>
        </div>
    )
}