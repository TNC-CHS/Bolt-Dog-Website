import { NextResponse } from 'next/server'
    import { Redis } from '@upstash/redis'

    const redis = Redis.fromEnv()

    export async function GET() {
      try {
        const cacheKey = 'all-breeds'
        const cachedData = await redis.get(cacheKey)

        if (cachedData) {
          return NextResponse.json(cachedData)
        }

        const response = await fetch('https://api.thedogapi.com/v1/breeds', {
          headers: {
            'x-api-key': process.env.NEXT_PUBLIC_DOG_API_KEY!,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch breeds')
        }

        const data = await response.json()
        await redis.set(cacheKey, data, { ex: 86400 }) // Cache for 24 hours

        return NextResponse.json(data)
      } catch (error) {
        return NextResponse.json(
          { error: 'Failed to fetch breeds' },
          { status: 500 }
        )
      }
    }
