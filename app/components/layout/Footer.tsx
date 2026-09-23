import { Link } from "react-router";
export function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-16">
      <div className="container-app py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1"><h3 className="text-lg font-extrabold text-brand-600 mb-3">🛍️ TiendaOnline</h3><p className="text-sm text-muted">Tu tienda online de confianza.</p></div>
          <div><h4 className="font-semibold mb-3 text-sm">Tienda</h4><ul className="space-y-2 text-sm text-muted"><li><Link to="/productos" className="hover:text-brand-600">Todos</Link></li><li><Link to="/categoria/electronica" className="hover:text-brand-600">Electrónica</Link></li><li><Link to="/categoria/ropa" className="hover:text-brand-600">Ropa</Link></li></ul></div>
          <div><h4 className="font-semibold mb-3 text-sm">Cuenta</h4><ul className="space-y-2 text-sm text-muted"><li><Link to="/login" className="hover:text-brand-600">Login</Link></li><li><Link to="/register" className="hover:text-brand-600">Registro</Link></li><li><Link to="/cuenta/pedidos" className="hover:text-brand-600">Pedidos</Link></li></ul></div>
          <div><h4 className="font-semibold mb-3 text-sm">Ayuda</h4><ul className="space-y-2 text-sm text-muted"><li><a href="#" className="hover:text-brand-600">Centro de ayuda</a></li><li><a href="#" className="hover:text-brand-600">Términos</a></li></ul></div>
        </div>
        <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted"><p>© 2026 TiendaOnline. Cloudflare Workers + React Router + D1.</p></div>
      </div>
    </footer>
  );
}
