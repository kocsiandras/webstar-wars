
/** Force / ability details for a character (nested object in API payload). */
export interface ICharacteristic {
    power: string;
    midichlorian: number;
}

export interface ICharacter {
    id: string;
    name: string;
    side: CharacterSide;
    characteristic: ICharacteristic;
    createdTimestamp: number;
    description: string;
}

export enum CharacterSide {
    LIGHT = 'LIGHT',
    DARK = 'DARK',
}

export const CharacterSideLabel: Record<CharacterSide, string> = {
    [CharacterSide.LIGHT]: 'Világos',
    [CharacterSide.DARK]: 'Sötét',
}

export interface ISimulationRequest {
    light: string;
    dark: string;
}

export interface ISimulationResponse {
    simulationId: string;
}
