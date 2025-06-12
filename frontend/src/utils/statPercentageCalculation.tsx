export function statToPercentage(metricSuccess: number, metricTotal: number, round: number = 2): number {
    if (metricTotal === 0) {
        metricTotal = 100;
    }
    return parseFloat(((100 * metricSuccess) / metricTotal).toFixed(round));
}

export function percentageToStat(metricPercentage: number, metricTotal: number, round: number = 2): number {
    if (metricTotal === 0) {
        metricTotal = 100;
    }
    return parseFloat(((metricPercentage * metricTotal) / 100).toFixed(round));
}