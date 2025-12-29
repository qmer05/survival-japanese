import { supabase, AUDIO_BUCKET } from "./supabase";

export type Phrase = {
  id: string;
  category: string;
  da: string;
  jp: string;
  romaji: string;
  audio_path: string;
  order_index: number;
};

export async function fetchPhrases(): Promise<Phrase[]> {
  const { data, error } = await supabase
    .from("phrases")
    .select("*")
    .order("category", { ascending: true })
    .order("order_index", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Phrase[];
}

export function getAudioUrl(audioPath: string): string {
  const { data } = supabase.storage
    .from(AUDIO_BUCKET)
    .getPublicUrl(audioPath);

  return data.publicUrl;
}
