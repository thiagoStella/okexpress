import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import locaisCuritiba from '../data/locais-curitiba.json';

export function useAddressSearch() {
    const [query, setQuery] = useState('');

    // Configuração do Fuse.js
    const fuse = useMemo(() => {
        return new Fuse(locaisCuritiba, {
            threshold: 0.3, // Sensibilidade (0.0 = exato, 1.0 = qualquer coisa)
            limit: 10,      // Máximo de resultados
        });
    }, []);

    const suggestions = useMemo(() => {
        if (!query || query.length < 3) return [];

        const results = fuse.search(query);
        return results.map(result => result.item);
    }, [query, fuse]);

    return {
        query,
        setQuery,
        suggestions
    };
}
