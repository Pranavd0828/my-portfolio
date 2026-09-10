"use client";
type Item = { id: string; label: string };
export default function StoryNavigation({ items }: { items: Item[] }) {
  const links = items.map((item) => <a key={item.id} href={`#${item.id}`}>{item.label}</a>);
  return <aside className="story-toc">
    <nav className="story-toc-desktop" aria-label="On this page"><p className="eyebrow">In this story</p>{links}</nav>
    <details className="story-toc-mobile" onClick={(event) => {
      if ((event.target as HTMLElement).closest("a")) event.currentTarget.open = false;
    }}><summary>In this story</summary><nav aria-label="On this page">{links}</nav></details>
  </aside>;
}
