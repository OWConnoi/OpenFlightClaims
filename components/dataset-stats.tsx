interface DatasetStatsProps {
  className?: string;
  total: number;
  active: number;
  labels: {
    airlines: string;
    active: string;
  };
}

export function DatasetStats({ className, total, active, labels }: DatasetStatsProps) {
  return (
    <dl className={className ?? "stats"} aria-label="Dataset status">
      <div>
        <dt>{total}</dt>
        <dd>{labels.airlines}</dd>
      </div>
      <div>
        <dt>{active}</dt>
        <dd>{labels.active}</dd>
      </div>
    </dl>
  );
}
