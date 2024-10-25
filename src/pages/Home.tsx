import { Link } from 'react-router-dom';
import '../styles.css';


function Home(){
    return(
        <div>
    <header>
    <nav className='navbar navbar-light bg-secondary'>
        <div className="container">
            <Link to="/cart/add-item" className='navbar-brand'>Add to cart</Link>
            <Link to="/category" className='navbar-brand'>Category</Link>
            <Link to="/stocks" className='navbar-brand'>Stock</Link>
            <Link to="/items" className='navbar-brand'>Item</Link>
        </div>
    </nav>
    </header>
    <main>
        <div className='container mt-3'>
            <div className="bg-light p-5 mt-4 rounded-3">
                <h1>Welcome to pos</h1>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui dignissimos consequuntur minus, impedit nobis similique velit porro consequatur aliquid quaerat beatae. Iure sint itaque sunt quis corrupti atque eaque ad.</p>
            </div>
          
        </div>
    </main>
    </div>
          
    )
}
export default Home;