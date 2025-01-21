import fs from 'fs/promises'
    import path from 'path'

    export interface BreedData {
      id: string
      name: string
      origin: string
      description: string
      temperament: string
      life_span: string
      weight: { metric: string }
      height: { metric: string }
      image?: { url: string }
      tags: string[]
      seo: {
        title: string
        description: string
        keywords: string[]
      }
    }

    export async function getBreedData(id: string): Promise<BreedData | null> {
      try {
        const filePath = path.join(process.cwd(), 'data/breeds', `${id}.json`)
        const data = await fs.readFile(filePath, 'utf-8')
        return JSON.parse(data)
      } catch (error) {
        return null
      }
    }

    export async function getAllBreeds(): Promise<BreedData[]> {
      try {
        const dirPath = path.join(process.cwd(), 'data/breeds')
        const files = await fs.readdir(dirPath)
        const breeds = await Promise.all(
          files.map(async (file) => {
            const data = await fs.readFile(path.join(dirPath, file), 'utf-8')
            return JSON.parse(data)
          })
        )
        return breeds
      } catch (error) {
        return []
      }
    }
