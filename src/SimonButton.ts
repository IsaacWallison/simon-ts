export const SimonButton = (color: string) => `
    <button data-id='${color}' class='simon-button ${color}' style='--color: ${color};' disabled></button>
`;
