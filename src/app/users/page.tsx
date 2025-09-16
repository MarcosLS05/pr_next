"use client"; // 👈 necesario para usar hooks en Next

import { useState } from "react";

export default function UsersPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [users, setUsers] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 👇 hacemos las 2 peticiones en paralelo
      const [usersRes, postsRes] = await Promise.all([
        fetch("https://jsonplaceholder.typicode.com/users"),
        fetch("https://jsonplaceholder.typicode.com/posts"),
      ]);

      if (!usersRes.ok || !postsRes.ok) {
        throw new Error("Error en la carga de datos");
      }

      const usersData = await usersRes.json();
      const postsData = await postsRes.json();

      setUsers(usersData);
      setPosts(postsData);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6">
        <input type="text" className="border border-gray-300 rounded p-2 mr-2" />
        
      <button
        onClick={fetchData}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Cargar datos
      </button>

      {/* Estado de carga */}
      {loading && <p className="mt-4">Cargando...</p>}

      {/* Errores */}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      {/* Usuarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white shadow-md rounded-lg p-4 border"
          >
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p>{user.phone}</p>
            <p>{user.address.city}</p>
            <p className="italic">{user.company.name}</p>

            <h3 className="mt-4 font-semibold">Posts:</h3>
            <ul className="list-disc list-inside">
              {posts
                .filter((post) => post.userId === user.id)
                .map((post) => (
                  <li key={post.id}>{post.title}</li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}
