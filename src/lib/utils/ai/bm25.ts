/**
 * BM25 keyword search implementation for DiscoveryOS.
 * Implements the Okapi BM25 ranking function for text retrieval.
 */

interface DocumentStats {
  docId: string;
  tokens: string[];
  length: number;
}

/**
 * BM25 search engine implementation.
 */
export class BM25 {
  private documents: DocumentStats[] = [];
  private tokenIndex: Map<string, number[]> = new Map();
  private avgDocLength = 0;
  private k1: number;
  private b: number;

  constructor(k1: number = 1.5, b: number = 0.75) {
    this.k1 = k1;
    this.b = b;
  }

  /**
   * Adds a document to the index.
   */
  addDocument(docId: string, text: string): void {
    const tokens = this.tokenize(text);
    const stats: DocumentStats = {
      docId,
      tokens,
      length: tokens.length,
    };

    this.documents.push(stats);

    // Update token index
    tokens.forEach((token, pos) => {
      if (!this.tokenIndex.has(token)) {
        this.tokenIndex.set(token, []);
      }
      this.tokenIndex.get(token)!.push(this.documents.length - 1);
    });

    this.updateAvgDocLength();
  }

  /**
   * Searches for documents matching query.
   */
  search(query: string, topK: number = 10): Array<[string, number]> {
    const queryTokens = this.tokenize(query);
    const scores: Map<string, number> = new Map();

    queryTokens.forEach((token) => {
      const docIndices = this.tokenIndex.get(token) || [];
      const idf = this.calculateIdf(docIndices.length);

      docIndices.forEach((docIdx) => {
        const doc = this.documents[docIdx];
        const freq = doc.tokens.filter((t) => t === token).length;
        const bm25Score = this.calculateBM25(freq, idf, doc.length);

        const current = scores.get(doc.docId) || 0;
        scores.set(doc.docId, current + bm25Score);
      });
    });

    return Array.from(scores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, topK);
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .split(/\W+/)
      .filter((token) => token.length > 0);
  }

  private calculateIdf(docFreq: number): number {
    const n = this.documents.length;
    return Math.log(
      (n - docFreq + 0.5) / (docFreq + 0.5) + 1
    );
  }

  private calculateBM25(
    freq: number,
    idf: number,
    docLength: number
  ): number {
    const numerator = freq * (this.k1 + 1);
    const denominator =
      freq + this.k1 * (1 - this.b + this.b * (docLength / this.avgDocLength));
    return idf * (numerator / denominator);
  }

  private updateAvgDocLength(): void {
    if (this.documents.length === 0) {
      this.avgDocLength = 0;
      return;
    }
    const totalLength = this.documents.reduce((sum, doc) => sum + doc.length, 0);
    this.avgDocLength = totalLength / this.documents.length;
  }
}
