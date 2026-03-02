import { useState, useEffect, useCallback } from 'react';

interface Breakpoints {
  sm: number;
  md?: number;
  lg?: number;
}

/**
 * Returns the number of grid columns based on current viewport width
 * using Tailwind-compatible breakpoints (md: 768px, lg: 1024px).
 */
export function useGridColumns({ sm, md, lg }: Breakpoints): number {
  const calc = useCallback(() => {
    const w = window.innerWidth;
    if (lg !== undefined && w >= 1024) return lg;
    if (md !== undefined && w >= 768) return md;
    return sm;
  }, [sm, md, lg]);

  const [cols, setCols] = useState(calc);

  useEffect(() => {
    const onResize = () => setCols(calc());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [calc]);

  return cols;
}
