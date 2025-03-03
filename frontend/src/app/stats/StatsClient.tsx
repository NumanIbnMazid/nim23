'use client'

import { FadeContainer } from '@/content/FramerMotionVariants'
import React, { useState } from 'react'
import AnimatedDiv from '@/components/FramerMotion/AnimatedDiv'
import StatsCard from '@/components/Stats/StatsCard'
import PageTop from '@/components/PageTop'

export default function StatsClient({ initialStats }: { initialStats: any }) {
  const [stats] = useState([
    { title: 'Github Repos', value: initialStats.repos },
    { title: 'Github Gists', value: initialStats.gists },
    { title: 'Github Followers', value: initialStats.followers },
    { title: 'Github Stars', value: initialStats.githubStars },
    { title: 'Repositories Forked', value: initialStats.forks },
  ])

  return (
    <>
      <section className="pageTop font-inter bg-darkWhitePrimary dark:bg-darkPrimary">
        <PageTop pageTitle="Statistics">Here are some statistics about my personal GitHub.</PageTop>

        <AnimatedDiv className="my-10" variants={FadeContainer}>
          <div className="grid xs:grid-cols-2 sm:!grid-cols-3 xl:!grid-cols-4 gap-5">
            {stats.map((stat, index) => (
              <StatsCard key={index} title={stat.title} value={stat.value} />
            ))}
          </div>
        </AnimatedDiv>
      </section>
    </>
  )
}
