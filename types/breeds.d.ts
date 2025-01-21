declare module '@/lib/breeds' {
      import { Breed } from '@/lib/breeds'
      export function getBreeds(): Promise<Breed[]>
      export function getBreedData(slug: string): Promise<Breed | null>
    }
