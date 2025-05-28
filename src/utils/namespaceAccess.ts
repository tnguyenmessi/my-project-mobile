export const getAllowedNamespaces = (username: string, allNamespaces: string[]): string[] => {
    console.log(' getAllowedNamespaces - username:', username, 'allNamespaces:', allNamespaces);
    if (!username) {
        console.warn('No username provided, returning empty list');
        return [];
    }

    if (username === 'admin') {
        console.log('Admin user, returning all namespaces:', allNamespaces);
        return allNamespaces;
    }

    if (username === 'guest') {
        const filtered = allNamespaces.filter(ns =>
            ns === 'playground' || ns === 'solutions' || ns.startsWith('user:guest')
        );
        console.log('Guest user, filtered namespaces:', filtered);
        return filtered;
    }

    const filtered = allNamespaces.filter(ns =>
        ns.startsWith(`user:${username}`) || ns.startsWith('shared') || ns.startsWith('projects')
    );
    console.log('Regular user, filtered namespaces:', filtered);
    return filtered;
};