"use client";

import { useState } from "react";

export default function UsersPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [users, setUsers] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

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
    <main className="p-6 bg-gray-50 min-h-screen">

      {/* Barra de acciones */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0 mb-6">
        <button
          onClick={fetchData}
          className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg shadow 
                     hover:bg-blue-700 transition-colors duration-200"
        >
          Cargar datos
        </button>

        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg shadow-sm text-gray-700
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Estado de carga */}
      {loading && <p className="mt-4 text-blue-600 font-medium">Cargando...</p>}

      {/* Errores */}
      {error && <p className="mt-4 text-red-500 font-semibold">{error}</p>}

      {/* Usuarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users
          .filter((user) =>
            user.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((user) => (
            <div
              key={user.id}
              onClick={() =>
                setExpandedUserId(expandedUserId === user.id ? null : user.id)
              }
              className="bg-white shadow-lg rounded-xl p-6 border cursor-pointer 
                         hover:shadow-2xl hover:scale-[1.02] transition-transform duration-200"
            >
              <h2 className="text-2xl font-bold text-blue-700 mb-2">{user.name}</h2>
              <p className="text-gray-700"><span className="font-semibold">Email:</span> {user.email}</p>
              <p className="text-gray-700"><span className="font-semibold">Tel:</span> {user.phone}</p>
              <p className="text-gray-700"><span className="font-semibold">Ciudad:</span> {user.address.city}</p>
              <p className="text-gray-700"><span className="font-semibold">Empresa:</span> {user.company.name}</p>

              {/* Info extra expandida */}
              {expandedUserId === user.id && (
                <div className="mt-3 p-3 bg-gray-100 rounded-lg text-sm text-gray-800">
                  <p><span className="font-semibold">Username:</span> {user.username}</p>
                  <p><span className="font-semibold">Website:</span> {user.website}</p>
                </div>
              )}

              <h3 className="mt-5 mb-2 font-semibold text-lg text-black">Posts:</h3>
              <ul className="list-disc list-inside text-gray-800 space-y-3">
                {posts
                  .filter((post) => post.userId === user.id)
                  .map((post) => (
                    <li key={post.id} className="bg-gray-50 p-2 rounded-lg shadow-sm">
                      <p className="font-medium">{post.title}</p>
                      <p className="text-gray-600 text-sm">{post.body}</p>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
      </div>
    </main>
  );
}
