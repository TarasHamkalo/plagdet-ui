export interface SentenceComparatorParameters {
  maxGap: number;
  sentenceVectorSimilarityThreshold: number;
  minClusterSize: number;
  minFragmentSideSim: number;
  minFragmentCharLength: number;
  diceSimilarityThreshold: number;
}

export interface ShingleComparatorParameters {
  size: number;
  overlap: number;
  plagiarizedLevel: number;
  discardLevel: number;
  bypassFiltering: boolean;
}

export interface MetadataComparatorParameters {
  bypassFiltering: boolean;
}

export interface SimilarDocumentSourceParameters {
  similarDocumentsLimit: number;
}

export interface ResultsFilterParameters {
  maxResultsPerDocument: number;
  minSimilarityToInclude: number;
  bypassResultsFiltering: boolean;
}

export interface PlagdetConfiguration {
  luceneIndexDirectoryPath: string;
  templateDocumentPath: string | null;
  sentenceComparatorParameters: SentenceComparatorParameters;
  shingleComparatorParameters: ShingleComparatorParameters;
  metadataComparatorParameters: MetadataComparatorParameters;
  similarDocumentSourceParameters: SimilarDocumentSourceParameters;
  resultsFilterParameters: ResultsFilterParameters;
}
