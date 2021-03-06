<?php declare(strict_types=1);

namespace Codein\IbexaSeoToolkit\Analysis;

use Codein\IbexaSeoToolkit\Model\AnalysisDTO;

/**
 * Interface ParentAnalyzerInterface.
 */
interface ParentAnalyzerInterface
{
    public function addAnalyzer(string $className, AnalyzerInterface $analyzer): void;

    public function analyze(AnalysisDTO $analysisDTO): array;

    public function isAllowed(string $contentTypeIdentifier, string $analyzerClassName, ?string $siteAccess = null): bool;
}
