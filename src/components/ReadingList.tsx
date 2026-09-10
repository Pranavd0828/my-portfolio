"use client";
import { useState } from "react";
import Image from "next/image";
type Year = "2026" | "2025" | "2024";

interface Book {
  title: string;
  author: string;
  status: "Read" | "Reading" | "Planned";
  coverUrl?: string;
}

const readingData: Record<Year, Book[]> = {
  "2026": [
    {
      title: "Nexus",
      author: "Yuval Noah Harari",
      status: "Read",
      coverUrl: "/covers/nexus.jpg",
    },
    {
      title: "The Hitchhiker's Guide to the Galaxy",
      author: "Douglas Adams",
      status: "Read",
      coverUrl: "/covers/hitchhikers_guide.jpg",
    }, // Note: 4th read
    {
      title: "The Body",
      author: "Bill Bryson",
      status: "Read",
      coverUrl: "/covers/the_body.jpg",
    }, // Note: 3rd Read-through
  ],
  "2025": [
    {
      title: "Dune Messiah",
      author: "Frank Herbert",
      status: "Read",
      coverUrl: "/covers/dune_messiah.jpg",
    },
    {
      title: "The Three-Body Problem",
      author: "Cixin Liu",
      status: "Read",
      coverUrl: "/covers/three_body.jpg",
    },
    {
      title: "The Dark Forest",
      author: "Cixin Liu",
      status: "Read",
      coverUrl: "/covers/dark_forest.jpg",
    },
    {
      title: "Death's End",
      author: "Cixin Liu",
      status: "Read",
      coverUrl: "/covers/deaths_end.jpg",
    },
    {
      title: "A Short History of Nearly Everything",
      author: "Bill Bryson",
      status: "Read",
      coverUrl: "/covers/short_history.jpg",
    },
    {
      title: "The Wager",
      author: "David Grann",
      status: "Read",
      coverUrl: "/covers/the_wager.jpg",
    },
    {
      title: "Thinking, Fast and Slow",
      author: "Daniel Kahneman",
      status: "Read",
    },
    {
      title: "Recursion",
      author: "Blake Crouch",
      status: "Read",
      coverUrl: "/covers/recursion.jpg",
    },
    {
      title: "Dark Matter",
      author: "Blake Crouch",
      status: "Read",
      coverUrl: "/covers/dark_matter.jpg",
    },
    {
      title: "Project Hail Mary",
      author: "Andy Weir",
      status: "Read",
      coverUrl: "/covers/project_hail_mary.jpg",
    },
    {
      title: "The Psychology of Money",
      author: "Morgan Housel",
      status: "Read",
      coverUrl: "/covers/psychology_money.jpg",
    },
    {
      title: "Decode and Conquer",
      author: "Lewis C. Lin",
      status: "Read",
      coverUrl: "/covers/decode_conquer.jpg",
    },
    {
      title: "Rock Paper Scissors",
      author: "Alice Feeney",
      status: "Read",
      coverUrl: "/covers/rock_paper_scissors.jpg",
    },
    {
      title: "The Word is Murder",
      author: "Anthony Horowitz",
      status: "Read",
      coverUrl: "/covers/word_is_murder.jpg",
    },
  ],
  "2024": [
    {
      title: "The Silent Patient",
      author: "Alex Michaelides",
      status: "Read",
      coverUrl: "/covers/silent_patient.jpg",
    },
    {
      title: "The Guest List",
      author: "Lucy Foley",
      status: "Read",
      coverUrl: "/covers/guest_list.jpg",
    },
    {
      title: "The Kind Worth Killing",
      author: "Peter Swanson",
      status: "Read",
      coverUrl: "/covers/kind_worth_killing.jpg",
    },
    { title: "Close to Home", author: "Cara Hunter", status: "Read" },
    {
      title: "The Decagon House Murders",
      author: "Yukito Ayatsuji",
      status: "Read",
      coverUrl: "/covers/decagon_house.jpg",
    },
    {
      title: "A Good Girl's Guide to Murder",
      author: "Holly Jackson",
      status: "Read",
      coverUrl: "/covers/good_girls_guide.jpg",
    },
    { title: "Good Girl, Bad Blood", author: "Holly Jackson", status: "Read" },
    {
      title: "As Good As Dead",
      author: "Holly Jackson",
      status: "Read",
      coverUrl: "/covers/as_good_as_dead.jpg",
    },
    {
      title: "Norse Mythology",
      author: "Neil Gaiman",
      status: "Read",
      coverUrl: "/covers/norse_mythology.jpg",
    },
    {
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      status: "Read",
    },
    {
      title: "Rework",
      author: "Jason Fried",
      status: "Read",
      coverUrl: "/covers/rework.jpg",
    },
    {
      title: "All Good People Here",
      author: "Ashley Flowers",
      status: "Read",
      coverUrl: "/covers/all_good_people.jpg",
    },
    {
      title: "Finlay Donovan is Killing It",
      author: "Elle Cosimano",
      status: "Read",
      coverUrl: "/covers/finlay_donovan.jpg",
    },
    {
      title: "A Haunting in Venice",
      author: "Agatha Christie",
      status: "Read",
    },
    { title: "The Feeling Economy", author: "Roland T. Rust", status: "Read" },
  ],
};

export default function ReadingList() {
  const [year, setYear] = useState<Year>("2026");
  const years: Year[] = ["2026", "2025", "2024"];
  return (
    <section className="shell section-space">
      <p className="eyebrow">Beyond work / Reading</p>
      <h1 className="section-heading mt-5">A shelf for curiosity.</h1>
      <p className="body-copy mt-6 max-w-xl">
        Science fiction, psychology, a good mystery, and the occasional return
        to an old favorite.
      </p>
      <div
        className="reading-years"
        role="group"
        aria-label="Choose a reading year"
      >
        {years.map((y) => (
          <button
            key={y}
            onClick={() => setYear(y)}
            aria-pressed={year === y}
            className="button"
          >
            {y}
          </button>
        ))}
      </div>
      <p className="eyebrow mb-6" role="status">
        {readingData[year].length} books · {year}
      </p>
      <div className="book-list">
        {readingData[year].map((book) => (
          <div className="book-row" key={book.title}>
            {book.coverUrl ? (
              <details>
                <summary>
                  <span className="book-title">{book.title}</span>
                  <span className="book-author">{book.author}</span>
                  <span className="book-cover-label">View cover +</span>
                </summary>
                <Image
                  src={book.coverUrl}
                  alt={`Cover of ${book.title}`}
                  width={120}
                  height={180}
                  sizes="120px"
                  className="book-cover"
                />
              </details>
            ) : (
              <div className="book-summary">
                <span className="book-title">{book.title}</span>
                <span className="book-author">{book.author}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
