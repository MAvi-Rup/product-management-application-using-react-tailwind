const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h3 className="font-bold mb-2">Zones Park</h3>
          <p className="text-gray-400">
            Your one-stop destination for the latest fashion trends and styles.
          </p>
        </div>
        <div>
          <h3 className="font-bold mb-2">Links</h3>
          <ul className="text-gray-400">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/products">Products</a>
            </li>
            <li>
              <a href="/about">About</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-2">Contact Us</h3>
          <p className="text-gray-400">
            123 Main Street
            <br />
            Anytown, USA 12345
            <br />
            Phone: (123) 456-7890
            <br />
            Email: info@fashionhub.com
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
