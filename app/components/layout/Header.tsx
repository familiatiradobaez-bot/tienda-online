import { useState } from "react";
import { Link, useNavigate } from "react-router";
import type { Category, PublicUser } from "~/lib/types";
interface HeaderProps { user: PublicUser | null; categories: Category[]; cartCount: number; }
export function Header({ user, categories, cartCount }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); if (searchQuery.trim()) { navigate(`/buscar?q=${encodeURIComponent(searchQuery.trim())}`); setMobileMenuOpen(false); } };
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur">
      <div className="bg-brand-600 text-white text-xs text-center py-2"><p>🚚 Envío gratis +50€ · 🔄 Devoluciones 30 días</p></div>
      <div className="container-app"><div className="flex items-center justify-between gap-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-brand-600"><span className="text-2xl">🛍️</span><span className="hidden sm:inline">TiendaOnline</span></Link>
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl"><div className="relative"><input type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Buscar..." className="input pr-10" /><button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-brand-600"><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></button></div></form>
        <div className="flex items-center gap-3">
          <Link to="/carrito" className="relative btn-ghost"><svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.145a3.75 3.75 0 00-3.75 3.75h11.25a3.75 3.75 0 00-3.75-3.75" /></svg>{cartCount > 0 && <span className="badge bg-brand-600 text-white absolute -top-1 -right-1 min-w-5 h-5 justify-center">{cartCount}</span>}</Link>
          {user ? (
            <div className="relative group"><button className="btn-ghost"><span className="h-8 w-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold text-sm">{user.name.charAt(0).toUpperCase()}</span></button>
              <div className="absolute right-0 top-full mt-2 w-56 card p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all"><Link to="/cuenta" className="block px-3 py-2 rounded-lg hover:bg-muted/10 text-sm">📊 Mi cuenta</Link><Link to="/cuenta/pedidos" className="block px-3 py-2 rounded-lg hover:bg-muted/10 text-sm">📦 Pedidos</Link>{user.role_id <= 4 && <Link to="/admin" className="block px-3 py-2 rounded-lg hover:bg-muted/10 text-sm font-medium text-brand-600">🔧 Admin</Link>}<Link to="/logout" className="block px-3 py-2 rounded-lg hover:bg-muted/10 text-sm text-red-600">🚪 Salir</Link></div>
            </div>
          ) : <div className="flex items-center gap-2"><Link to="/login" className="btn-secondary">Login</Link><Link to="/register" className="btn-primary hidden sm:inline-flex">Registro</Link></div>}
        </div>
      </div>
      <nav className="hidden lg:flex items-center gap-6 py-2 border-t border-border"><Link to="/productos" className="text-sm font-medium hover:text-brand-600">Todos</Link>{categories.map((cat) => <Link key={cat.id} to={"/categoria/" + cat.slug} className="text-sm font-medium hover:text-brand-600">{cat.icon && <span className="mr-1">{cat.icon}</span>}{cat.name}</Link>)}</nav>
      </div>
    </header>
  );
}
