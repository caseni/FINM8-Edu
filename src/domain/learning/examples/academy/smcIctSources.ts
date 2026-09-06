import type { ContentSource } from '../../types';

const reviewedAt = '2026-08-11T20:53:00+03:00';

export const SMC_ICT_SOURCES: Readonly<Record<string, ContentSource>> = {
  methodology: {
    id: 'source.finm8.smc-ict-methodology',
    title: 'FINM8 SMC / ICT Methodology Boundary and Terminology Guide',
    publisher: 'FINM8',
    reviewedAt,
  },
  structure: {
    id: 'source.finm8.smc-ict-structure',
    title: 'FINM8 Advanced Market Structure, Liquidity, and Context Methodology',
    publisher: 'FINM8',
    reviewedAt,
  },
};
