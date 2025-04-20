import { FaImdb, FaYoutube, FaSpotify } from 'react-icons/fa'
import Image from 'next/image'

export default function RecommendationCard({ recommendation }: { recommendation: any }) {
  const {
    title,
    media_type,
    artist,
    description,
    languages,
    genres,
    imdb_rating,
    review_link,
    youtube_link,
    spotify_link,
    cover_url,
    release_year,
    director,
    cast,
    category_tags,
  } = recommendation

  const getNames = (arr: any[], label: string, icon: string) =>
    Array.isArray(arr) &&
    arr.length > 0 && (
      <span>
        {icon} {label}:{' '}
        {arr
          .slice(0, 5)
          .map((person) => (typeof person === 'string' ? person : person?.name || ''))
          .filter(Boolean) // removes empty strings
          .join(', ')}
        {arr.length > 5 && '...'}
      </span>
    )

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4 flex flex-col sm:flex-row gap-4">
      {cover_url && (
        <div className="flex-shrink-0">
          <Image
            alt={title}
            width={250}
            height={250}
            quality={100}
            src={cover_url}
            className="w-full sm:w-24 sm:h-36 rounded-lg object-cover"
          />
        </div>
      )}
      <div>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-sm text-gray-500 capitalize">{media_type}</p>
        {description &&
          (Array.isArray(description) ? (
            description.map(
              (text: string, idx: number) =>
                idx <= 0 && (
                  <p key={idx} className="mt-2 text-gray-700 dark:text-gray-300">
                    {text}
                  </p>
                )
            )
          ) : (
            <p className="mt-2 text-gray-700 dark:text-gray-300">{description}</p>
          ))}
        <div className="mt-3 flex flex-wrap gap-2 text-sm text-gray-700 dark:text-gray-300">
          {languages?.length > 0 && <span>🌍 {languages.join(', ')}</span>}
          {artist?.length > 0 && <span>🎤 {artist.join(', ')}</span>}
          {genres?.length > 0 && <span>🎭 {genres.join(', ')}</span>}
          {category_tags?.length > 0 && <span>🏷️ {category_tags.join(', ')}</span>}
          {imdb_rating && <span>⭐ {imdb_rating}</span>}
          {release_year && <span>📅 {release_year}</span>}
          {getNames(cast, 'Cast', '🎬')}
          {getNames(director, 'Director', '🎥')}
        </div>
        <div className="flex gap-4 mt-4 text-lg">
          {review_link && (
            <a href={review_link} target="_blank" rel="noopener noreferrer" className="text-yellow-500">
              <FaImdb />
            </a>
          )}
          {youtube_link && (
            <a href={youtube_link} target="_blank" rel="noopener noreferrer" className="text-red-500">
              <FaYoutube />
            </a>
          )}
          {spotify_link && spotify_link.trim() !== '' && (
            <a href={spotify_link} target="_blank" rel="noopener noreferrer" className="text-green-500">
              <FaSpotify />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
