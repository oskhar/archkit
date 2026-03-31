export class MetricCalculator {
  /**
   * Calculates the percentage delta between base and experimental values.
   * Positive means experimental is larger.
   */
  public static calculateDelta(base: number, experimental: number): number {
    if (base === 0) return 0;
    return ((experimental - base) / base) * 100;
  }

  /**
   * Calculates churn ratio from modified/deleted and added lines.
   */
  public static calculateChurnRatio(modifiedDeleted: number, added: number): number {
    if (added === 0) return 0;
    return modifiedDeleted / added;
  }

  /**
   * Calculates average for a set of values.
   */
  public static calculateAverage(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, v) => sum + v, 0) / values.length;
  }
}
