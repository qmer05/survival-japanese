import { getAudioUrl } from "../../lib/phrasesRepo";
import type { Phrase } from "../../lib/phrasesRepo";

type Props = {
  phrase: Phrase;
};

export function PhraseCard({ phrase }: Props) {
  return (
    <article className="card">
      <div className="card-header">
        <div className="da">{phrase.da}</div>
      </div>

      <div className="jp">{phrase.jp}</div>
      <div className="romaji">{phrase.romaji}</div>

      <div className="actions">
        <button
          className="btn primary"
          onClick={() => playAudio(getAudioUrl(phrase.audio_path))}
        >
          ▶ Play
        </button>

        <button
          className="btn ghost"
          onClick={() => navigator.clipboard.writeText(phrase.jp)}
        >
          Copy JP
        </button>

        <button
          className="btn ghost"
          onClick={() => navigator.clipboard.writeText(phrase.romaji)}
        >
          Copy Romaji
        </button>
      </div>
    </article>
  );
}

function playAudio(url: string) {
  const audio = new Audio(url);
  audio.play();
}
