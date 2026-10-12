import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'

function PageLayout({ children }) {
  return (
    <div className="app-shell">
      <Navbar />
      {children}
      <Footer />
    </div>
  )
}

export default PageLayout
