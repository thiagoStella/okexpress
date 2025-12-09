import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import locais from '../data/locais-curitiba.json';

export function useAddressSearch() {
    const [results, setResults] = useState([]);

    const fuse = useMemo(() => {
        return new Fuse(locais, {
            includeScore: true,
            threshold: 0.3, // Lower = more strict
        });
    }, []);

    const search = (query) => {
        if (!query) {
            setResults([]);
            return;
        }

        const searchResults = fuse.search(query);
        // Return just the items (strings)
        setResults(searchResults.map(result => result.item));
    };

    return {
        results,
        search
    };
}
