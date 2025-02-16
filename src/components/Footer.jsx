import './footer.css'

const Footer = () => {
  return (
    <footer className="footer mt-auto py-2 px-3 text-muted text-center fs-8">
      <p className="mb-0" style={{ fontFamily: 'Merriweather, Open Sans, sans-serif' }}>&copy; {new Date().getFullYear()} Brain Trainer Academy. All rights reserved.</p>
    </footer>
  );
};

export default Footer;