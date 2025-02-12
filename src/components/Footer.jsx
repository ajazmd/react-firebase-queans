import './footer.css'

const Footer = () => {
  return (
    <footer className="footer mt-auto py-2  text-muted text-center">
      <p className="mb-1" style={{ fontFamily: 'Poppins , sanc-serif' }}>&copy; {new Date().getFullYear()} Brain Trainer Academy. All rights reserved.</p>
    </footer>
  );
};

export default Footer;