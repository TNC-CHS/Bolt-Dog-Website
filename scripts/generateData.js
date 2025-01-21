import fs from 'fs/promises'
    import path from 'path'
    import OpenAI from 'openai'
    import pLimit from 'p-limit'
    import axios from 'axios'

    const DOG_API_KEY = process.env.NEXT_PUBLIC_DOG_API_KEY
    const OPENAI_KEY = process.env.NEXT_PUBLIC_OPENAI_KEY
    const ITEMS_PER_MINUTE = 30000
    const BATCH_SIZE = 300
    const DELAY_BETWEEN_BATCHES = Math.floor(60000 / (ITEMS_PER_MINUTE / BATCH_SIZE))

    const openai = new OpenAI({
      apiKey: OPENAI_KEY,
      dangerouslyAllowBrowser: true
    })

    const limit = pLimit(BATCH_SIZE)

    interface BreedData {
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

    async function fetchDogBreeds(): Promise<BreedData[]> {
      const response = await axios.get('https://api.thedogapi.com/v1/breeds', {
        headers: { 'x-api-key': DOG_API_KEY }
      })
      return response.data
    }

    async function generateSeoContent(breed: BreedData): Promise<BreedData> {
      const prompt = `Generate SEO content for ${breed.name} dog breed in JSON format:
      {
        "title": "SEO optimized title",
        "description": "SEO optimized description",
        "keywords": ["array", "of", "keywords"]
      }`

      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [{
            role: "system",
            content: "You are an SEO expert specializing in dog breeds"
          }, {
            role: "user",
            content: prompt
          }],
          response_format: { type: "json_object" },
          temperature: 0.7,
        })

        const content = response.choices[0]?.message?.content
        if (content) {
          breed.seo = JSON.parse(content)
        }
      } catch (error) {
        console.error('Error generating SEO content:', error)
      }

      return breed
    }

    async function generateBreedPages(breeds: BreedData[]) {
      const outputDir = path.join(process.cwd(), 'data/breeds')
      await fs.mkdir(outputDir, { recursive: true })

      for (const breed of breeds) {
        const breedWithSeo = await generateSeoContent(breed)
        const filePath = path.join(outputDir, `${breed.id}.json`)
        await fs.writeFile(filePath, JSON.stringify(breedWithSeo, null, 2))
      }
    }

    async function generateSitemap(breeds: BreedData[]) {
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${breeds.map(breed => `
          <url>
            <loc>https://yourdomain.com/breeds/${breed.id}</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
          </url>
        `).join('')}
      </urlset>`

      await fs.writeFile(path.join(process.cwd(), 'public/sitemap.xml'), sitemap)
    }

    async function main() {
      try {
        console.log('Fetching dog breeds...')
        const breeds = await fetchDogBreeds()
        console.log('Generating breed pages...')
        await generateBreedPages(breeds)
        console.log('Generating sitemap...')
        await generateSitemap(breeds)
        console.log('Data generation completed!')
      } catch (error) {
        console.error('Error:', error)
        process.exit(1)
      }
    }

    main()
