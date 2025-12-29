import { useEffect, useMemo, useState } from "react";
import { fetchPhrases } from "../../lib/phrasesRepo";
import type { Phrase } from "../../lib/phrasesRepo";

export function usePhrases() {
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [category, setCategory] = useState<string>("");

  useEffect(() => {
    fetchPhrases().then((list) => {
      setPhrases(list);
      setCategory(list[0]?.category ?? "");
    });
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(phrases.map((p) => p.category))),
    [phrases]
  );

  const filtered = useMemo(
    () => phrases.filter((p) => p.category === category),
    [phrases, category]
  );

  return {
    phrases,
    categories,
    category,
    setCategory,
    filtered,
  };
}
