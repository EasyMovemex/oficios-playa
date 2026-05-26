import { Badge } from '@/components/ui';
import type { JobStatus } from '@/types';

type BadgeVariant = 'primary' | 'secondary' | 'accent' | 'warning' | 'danger' | 'neutral';

const CONFIG: Record<JobStatus, { label: string; variant: BadgeVariant }> = {
  open:        { label: 'Abierta',    variant: 'primary' },
  in_progress: { label: 'En proceso', variant: 'warning' },
  completed:   { label: 'Completado', variant: 'accent' },
  cancelled:   { label: 'Cancelado',  variant: 'danger' },
};

type JobStatusBadgeProps = {
  status: JobStatus;
  size?: 'sm' | 'md';
};

export function JobStatusBadge({ status, size = 'sm' }: JobStatusBadgeProps) {
  const { label, variant } = CONFIG[status];
  return <Badge variant={variant} size={size}>{label}</Badge>;
}
