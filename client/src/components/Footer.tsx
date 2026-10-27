import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-inner mono-sm">
        <span className="footer-brand">
          <Logo height={44} />
          © {new Date().getFullYear()} Santa Cecilia Brewing Co. · Home-brewed · Not sold commercially · Poured at the occasional event · 21+
        </span>
        <span className="footer-links">
          <a href="#top">Back to top ↑</a>
        </span>
      </div>
    </footer>
  )
}
