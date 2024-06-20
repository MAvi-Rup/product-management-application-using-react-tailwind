import { useEffect } from "react";
import { FaShoppingCart, FaSignOutAlt, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

const Header = ({
  isLoggedIn,
  setIsLoggedIn,
  cartItemCount,
  fetchCartItemCount,
}) => {
  const handleLogout = () => {
    // Perform logout logic (e.g., call an API, update state)
    setIsLoggedIn(false);
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchCartItemCount();
    }
  }, [isLoggedIn, fetchCartItemCount]);

  return (
    <header className="bg-gray-800 text-white py-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="font-bold text-xl">
          <Link to="/">Zones Park</Link>
        </div>
        <nav>
          <ul className="flex space-x-4 items-center">
            <li>
              <Link to="/">Home</Link>
            </li>

            {isLoggedIn ? (
              <>
                <li>
                  <Link to="/cart" className="relative">
                    <FaShoppingCart />
                    {cartItemCount > 0 && (
                      <span className="absolute top-0 right-0 transform -translate-y-1/2 rounded-full bg-red-600 text-white text-xs w-4 h-4 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login" className="flex items-center space-x-1">
                  <FaUser />
                  <span>Login</span>
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
