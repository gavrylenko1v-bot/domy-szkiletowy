import { faq } from "@/content/site";
import { Plus } from "./icons";
export function FAQ({ limit }: { limit?: number }) {
  return (
    <div className="faq-list">
      {faq.slice(0, limit).map(([q, a], i) => (
        <details key={q}>
          <summary>
            <span className="faq-index">0{i + 1}</span>
            <span>{q}</span>
            <Plus size={18} />
          </summary>
          <p>{a}</p>
        </details>
      ))}
    </div>
  );
}
