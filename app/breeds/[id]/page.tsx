import { notFound } from 'next/navigation'
    import BreedDetails from '@/components/BreedDetails'
    import { getBreedData } from '@/lib/breeds'

    export async function generateMetadata({ params }: { params: { id: string } }) {
      const breed = await getBreedData(params.id)
      if (!breed) return {}

      return {
        title: breed.seo.title,
        description: breed.seo.description,
        keywords: breed.seo.keywords.join(', '),
        openGraph: {
          images: breed.image?.url ? [{ url: breed.image.url }] : [],
        },
      }
    }

    export default async function BreedPage({ params }: { params: { id: string } }) {
      const breed = await getBreedData(params.id)
      if (!breed) notFound()

      return <BreedDetails breed={breed} />
    }
