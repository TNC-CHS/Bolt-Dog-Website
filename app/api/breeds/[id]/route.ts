import { NextResponse } from 'next/server'
    import { Redis } from '@upstash/redis'
    import axios from 'axios'

    const redis = new Redis({
      url: process.env.REDIS_URL!,
      token: process.env.REDIS_TOKEN!,
    })

    export async function GET(
      request: Request,
      { params }: { params: { id: string } }
    ) {
      const cacheKey = `breed:${params.id}`
      const cachedData = await redis.get(cacheKey)

      if (cachedData) {
        return NextResponse.json(cachedData)
      }

      try {
        const response = await axios.get(
          `https://api.thedogapi.com/v1/breeds/${params.id}`,
          {
            headers: {
              'x-api-key': process.env.NEXT_PUBLIC_DOG_API_KEY!,
            },
          }
        )

        await redis.set(cacheKey, response.data, { ex: 86400 }) // Cache for 24 hours
        return NextResponse.json(response.data)
      } catch (error) {
        return NextResponse.json(
          { error: 'Failed to fetch breed data' },
          { status: 500 }
        )
      }
    }
