export default function StoryFlow({
  steps,
  accent = "mint",
}: {
  steps: string[];
  accent?: string;
}) {
  return (
    <div className={`story-flow tone-${accent}`}>
      <p className="eyebrow">Product flow</p>
      <ol>
        {steps.map((step, i) => (
          <li key={step}>
            <span className="flow-step">0{i + 1}</span>
            <span>{step}</span>
            {i < steps.length - 1 && (
              <span className="flow-arrow" aria-hidden="true">
                ↓
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
