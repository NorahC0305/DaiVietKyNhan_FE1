import {
    QueryClient,
    defaultShouldDehydrateQuery,
    isServer,
} from '@tanstack/react-query'

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                // With SSR, we usually want to set some default staleTime
                // to avoid refetching immediately on the client
                staleTime: 60 * 1000, // 1 minute
                gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
                refetchOnWindowFocus: false,
                retry: 1,
            },
            dehydrate: {
                // Include pending queries in dehydration
                // This is important for SSR to work correctly
                shouldDehydrateQuery: (query) =>
                    defaultShouldDehydrateQuery(query) ||
                    query.state.status === 'pending',
            },
        },
    })
}

let browserQueryClient: QueryClient | undefined = undefined

export function getQueryClient() {
    if (isServer) {
        // Server: always make a new query client for each request
        // This ensures that data is not shared between requests
        return makeQueryClient()
    } else {
        // Browser: use singleton pattern to ensure we use the same client
        // This is very important so we don't re-make a new client if React
        // suspends during the initial render. This ensures proper hydration.
        if (!browserQueryClient) {
            browserQueryClient = makeQueryClient()
        }
        return browserQueryClient
    }
}