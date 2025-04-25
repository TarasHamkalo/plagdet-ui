export interface PlagdetConfiguration {
  luceneIndexDirectoryPath: string;
  templateDocumentPath: string | null;
  pipelineParameters: {
    canBypassTemplateRemoval: boolean;
  }
  metadataComparatorParameters: {
    canBypassFiltering: boolean;
  };
  shingleOverlapComparisonFilterParameters: {
    size: number;
    overlap: number;
    plagiarizedLevel: number;
    discardLevel: number;
    canBypassFiltering: boolean;
  };
  lengthComparisonFilterParameters: {
    canBypassFiltering: boolean;
    sentenceSizeRatioThreshold: number;
  };
  comparisonsStoreParameters: { //
    canBypassFiltering: boolean;
    maxResultsPerDocument: number;
    minSimilarityToRecord: number;
  };
  luceneFileDataSourceParameters: {
    similarDocumentsLimit: number;
    maxMetadataSimilarDoc: number;
  };
  seedingStrategyParameters: {
    vectorSimilarityThreshold: number;
    alignmentSimilarityThreshold: number;
    sizeRatioThreshold: number;
    minSentencesToConsider: number;
    portionOfSentencesToConsider: number;
    maxPortionOfSentencesToConsiderMultiSearch: number;
    sentencesPerDocumentToConsiderMultiSearch: number;
  };
  extensionStrategyParameters: {
    minFragmentSideSim: number;
    minClusterSize: number;
    sentMaxGap: number;
  };
  filteringStrategyParameters: {
    minCharacterLength: number;
  }
}
