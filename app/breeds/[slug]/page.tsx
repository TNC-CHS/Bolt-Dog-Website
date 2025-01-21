import { Metadata } from 'next'
    import { notFound } from 'next/navigation'
    import BreedDetails from '@/components/BreedDetails'
    import { getBreedData } from '@/lib/breeds'

    type Props = {
      params: { slug: string }
    }

    export async function generateMetadata({ params }: Props): Promise<Metadata> {
      const breed = await getBreedData(params.slug)
      if (!breed) return {}

      return {
        title: `${breed.name} - Breed Information`,
        description: breed.description || `Learn about ${breed.name} dog breed`,
        openGraph: {
          images: breed.image?.url ? [{ url: breed.image.url }] : [],
        },
      }
    }

    export default async function BreedPage({ params }: Props) {
      const breed = await getBreedData(params.slug)
      if (!breed) notFound()

      return <BreedDetails breed={breed} />
    }
