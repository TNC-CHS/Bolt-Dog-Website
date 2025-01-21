import Image from 'next/image'
    import { BreedData } from '@/lib/breeds'

    export default function BreedDetails({ breed }: { breed: BreedData }) {
      return (
        <div className="container mx-auto p-4">
          <h1 className="text-4xl font-bold mb-4">{breed.name}</h1>
          <div className="grid md:grid-cols-2 gap-8">
            {breed.image?.url && (
              <div className="relative h-96">
                <Image
                  src={breed.image.url}
                  alt={breed.name}
                  fill
                  className="object-cover rounded-lg"
                  priority
                />
              </div>
            )}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Breed Information</h2>
              <div className="space-y-2">
                {breed.origin && <p><strong>Origin:</strong> {breed.origin}</p>}
                {breed.temperament && <p><strong>Temperament:</strong> {breed.temperament}</p>}
                {breed.life_span && <p><strong>Life Span:</strong> {breed.life_span}</p>}
                <p><strong>Weight:</strong> {breed.weight.metric} kg</p>
                <p><strong>Height:</strong> {breed.height.metric} cm</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
