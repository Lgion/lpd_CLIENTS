import Link from 'next/link';
import "./index.scss"

export default function EcoleAdminLayout({ children }) {
  return (
    <main style={{ padding: 32 }}>
      <h1>Administration École</h1>
      <nav style={{ display: 'flex', gap: 24, marginTop: 32 }}>
        <Link href="/admin/ecole/eleves">
          <button>Gérer les élèves</button>
        </Link>
        <Link href="/admin/ecole/enseignants">
          <button>Gérer les enseignants</button>
        </Link>
        <Link href="/admin/ecole/classes">
          <button>Gérer les classes</button>
        </Link>
      </nav>
      <section style={{ marginTop: 32 }}>
        {children}
      </section>
    </main>
  );
}
