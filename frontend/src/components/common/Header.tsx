interface HeaderProps {
    siteName?: string;
    pageName: string;
}

const Header: React.FC<HeaderProps> = ({siteName="Trade Holding AMS", pageName}) => {
    return(
        <div className="header">

            <div className="text-light text-lg font-bold">{siteName}</div>
            <div className="text-accent text-2xl font-medium">{pageName}</div>
            <div className="flex items-center gap-4">
                <button className="btn">Tema</button>
                <button className="btn">Perfil</button>
            </div>
        
        </div>
    )
}

export default Header;