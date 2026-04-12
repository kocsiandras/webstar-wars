export const environment = {
  baseUrl: 'https://developer.webstar.hu/rest/frontend-felveteli/v2/',
  /** When true, login POST is not sent; a mock `ILoginResponse` is returned (dev only). */
  mockLogin: true,
  /** When true, GET `characters/` is not sent; mock list from `dummy-characters.json` is returned. */
  mockCharacters: true,
  /** When true, POST `simulate/` is not sent; a mock `ISimulationResponse` is returned. */
  mockSimulate: true,
};