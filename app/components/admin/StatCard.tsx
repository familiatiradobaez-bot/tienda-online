export function StatCard({ icon, label, value }: { icon: string; label: string; value: string | number }) {
  return <div className="card p-5"><div className="flex items-center justify-between"><div><p className="text-sm text-muted">{label}</p><p className="text-2xl font-bold mt-1">{value}</p></div><span className="text-3xl">{icon}</span></div></div>;
}
