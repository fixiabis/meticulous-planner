'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function QueryProvider(props: Readonly<React.PropsWithChildren>) {
  const [queryClient] = useState(() => {
    return new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000,
          refetchOnWindowFocus: false,
          throwOnError: true,
        },
        mutations: {
          throwOnError: true,
        },
      },
    });
  });

  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
