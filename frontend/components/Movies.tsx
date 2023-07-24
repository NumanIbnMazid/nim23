import { MovieType } from '@lib/types'
import { motion } from 'framer-motion'
import MovieCard from '@components/MovieCard'
import { FadeContainer, opacityVariant } from '@content/FramerMotionVariants'
import AnimatedDiv from '@components/FramerMotion/AnimatedDiv'

export default function MovieSection({ movies }: { movies: MovieType[] }) {
  return (
    <div className="-mt-5 pageTop print:hidden">
      <motion.h3
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={opacityVariant}
        className="w-full my-2 text-3xl font-bold font-inter flex justify-center items-center text-slate-500 dark:text-slate-100"
      >
        Recent watched Movies & TV Series
      </motion.h3>

      <AnimatedDiv
        variants={FadeContainer}
        className="flex items-center gap-2 pt-10 pb-5 overflow-x-scroll md:gap-4 horizontal-scrollbar"
      >
        {movies.map((movie: MovieType) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </AnimatedDiv>
    </div>
  )
}
