import { pipeline, env } from '@xenova/transformers';

// Skip local model checks since we might not have a cache dir configured easily in all envs
env.allowLocalModels = false;

class PipelineSingleton {
  static task = 'feature-extraction';
  static model = 'Supabase/gte-small'; // Using gte-small or Xenova/all-MiniLM-L6-v2
  static instance: any = null;

  static async getInstance(progress_callback?: Function) {
    if (this.instance === null) {
      this.instance = await pipeline(this.task as any, 'Xenova/all-MiniLM-L6-v2', { progress_callback });
    }
    return this.instance;
  }
}

export interface EmbeddingProvider {
  embedText(text: string): Promise<number[]>;
  embedTexts(texts: string[]): Promise<number[][]>;
}

export class LocalEmbeddingProvider implements EmbeddingProvider {
  async embedText(text: string): Promise<number[]> {
    const embedder = await PipelineSingleton.getInstance();
    const output = await embedder(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
  }

  async embedTexts(texts: string[]): Promise<number[][]> {
    const embedder = await PipelineSingleton.getInstance();
    const output = await embedder(texts, { pooling: 'mean', normalize: true });
    
    // Output is a tensor. We need to split it by texts
    const vectors: number[][] = [];
    for (let i = 0; i < texts.length; i++) {
      const start = i * 384;
      const end = start + 384;
      vectors.push(Array.from(output.data.slice(start, end)));
    }
    return vectors;
  }
}

export const getEmbeddingProvider = (): EmbeddingProvider => {
  return new LocalEmbeddingProvider();
};
