export function convertStringToData(stringData: string) {
    // Parse the ISO 8601 string to a Date object
    const date = new Date(stringData);

    // Extract day, month, and year
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getUTCFullYear();

    // Return the formatted date string
    return `${day}/${month}/${year}`;
}