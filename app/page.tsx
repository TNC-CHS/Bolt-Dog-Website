import Link from 'next/link'
    import { getBreeds } from '@/lib/breeds'

    export default async function Home() {
      const breeds = await getBreeds()

      if (!breeds.length) {
        return (
          <main className="container mx-auto p-4">
            <h1 className="text-4xl font-bold mb-8">Dog Breeds</h1>
            <p className="text-red-500">Failed to load breeds. Please try again later.</p>
          </main>
        )
      }

      return (
        <main className="container mx-auto p-4">
          <h1 className="text-4xl font-bold mb-8">Dog Breeds</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {breeds.map((breed) => (
              <Link
                key={breed.id}
                href={`/breeds/${breed.id}`}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <h2 className="text-xl font-semibold">{breed.name}</h2>
                {breed.origin && (
                  <p className="text-sm text-gray-600">Origin: {breed.origin}</p>
                )}
              </Link>
            ))}
          </div>
        </main>
      )
    }
