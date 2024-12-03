/**
 * Format date to a readable string with fallback
 */
export const formatDate = (date: string | Date | null | undefined): string => {
    if (!date) return '-';

    try {
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) return '-';

        return dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return '-';
    }
};

/**
 * Format date with time
 */
export const formatDateTime = (date: string | Date | null | undefined): string => {
    if (!date) return '-';

    try {
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) return '-';

        return dateObj.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return '-';
    }
};

/**
 * Search in object values
 */
export const searchInObject = (obj: any, searchTerm: string): boolean => {
    return Object.values(obj)
        .some(value =>
            value &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
};