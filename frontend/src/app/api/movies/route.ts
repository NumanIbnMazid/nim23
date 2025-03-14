import { NextResponse } from 'next/server'
import { getAllMovies } from '@/lib/api/movies'

export async function GET() {
  try {
    const movies = await getAllMovies()
    return NextResponse.json(movies, { status: 200 })
  } catch (error) {
    console.error('Error fetching movies:', error)
    return NextResponse.json({ error: 'Failed to fetch movies' }, { status: 500 })
  }
}
