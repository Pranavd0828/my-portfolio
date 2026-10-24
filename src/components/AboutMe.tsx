import Link from 'next/link'
import Image from 'next/image'
import styles from './PortfolioHome.module.css'

const books = [
  { title: 'The Hitchhiker’s Guide to the Galaxy', image: 'hitchhikers_guide' },
  { title: 'The Body', image: 'the_body' },
  { title: 'The Wager', image: 'the_wager' },
]

export default function AboutMe() {
  return (
    <section
      className={`${styles.section} ${styles.personal} shell`}
      aria-labelledby="personal-title"
    >
      <div>
        <p className={styles.kicker}>Beyond the roadmap</p>
        <h2 id="personal-title" className={styles.heading}>
          Curiosity has
          <br />a few other outlets.
        </h2>
        <p className={styles.copy}>
          My reading shelf moves between science fiction, science, history, and
          mysteries. The playground is another place I follow an idea far enough
          to make it playable.
        </p>
        <div className={styles.actions}>
          <Link prefetch={false} className={styles.quietLink} href="/reading">
            Browse my reading shelf
          </Link>
          <Link
            prefetch={false}
            className={styles.quietLink}
            href="/playground"
          >
            Visit the playground
          </Link>
        </div>
      </div>
      <figure className={styles.books}>
        <div>
          {books.map((book) => (
            <Image
              key={book.image}
              src={`/covers/${book.image}.jpg`}
              alt={book.title}
              width={132}
              height={198}
              sizes="(max-width: 600px) 26vw, 132px"
            />
          ))}
        </div>
        <figcaption>A few books from my shelf</figcaption>
      </figure>
    </section>
  )
}
