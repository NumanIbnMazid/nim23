import { MovieType } from '@lib/types'
import { motion } from 'framer-motion'
import MovieCard from '@components/MovieCard'
import { FadeContainer, opacityVariant } from '@content/FramerMotionVariants'
import AnimatedDiv from '@components/FramerMotion/AnimatedDiv'
import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'

export default function MovieSection({ movies, showHomeHeading = true }: { movies: MovieType[], showHomeHeading?: boolean }) {

  const [sliderRef] = useKeenSlider(
    {
      mode: 'free-snap',
      slides: {
        origin: 'center',
        perView: 5,
        spacing: 15,
      },
      breakpoints: {
        '(max-width: 300px)': {
          slides: { perView: 1, spacing: 5 },
        },
        '(min-width: 301px)': {
          slides: { perView: 2, spacing: 5 },
        },
        '(min-width: 500px)': {
          slides: { perView: 3, spacing: 5 },
        },
        '(min-width: 700px)': {
          slides: { perView: 4, spacing: 5 },
        },
        '(min-width: 1000px)': {
          slides: { perView: 5, spacing: 10 },
        },
      },
    },
    [
      // add plugins here
    ]
  )

  return (
    <div className="-mt-5 pageTop print:hidden">
      {showHomeHeading && (
        <motion.h3
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={opacityVariant}
          className="w-full my-2 text-3xl font-bold font-inter flex justify-center items-center text-slate-500 dark:text-slate-100"
        >
          Recent Watched Movies & TV Series
        </motion.h3>
      )}

      <AnimatedDiv
        variants={FadeContainer}
        className="flex items-center gap-2 pt-10 pb-5 overflow-x-scroll md:gap-4"
      >
        <div ref={sliderRef} className="keen-slider">
          {movies.map((movie: MovieType) => (
            <div key={movie.id} className="keen-slider__slide">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </AnimatedDiv>
    </div>
  )
}
