import api from "./api";

const USE_MOCKS = false;

const TEAMS_RESOURCE = "/teams";
const STADIUMS_RESOURCE = "/stadiums";
const REFEREES_RESOURCE = "/referees";

const MOCK_TEAMS = [
    { id_team: "t-arg", name: "Argentina" },
    { id_team: "t-bra", name: "Brasil" },
    { id_team: "t-fra", name: "Francia" },
    { id_team: "t-esp", name: "España" },
    { id_team: "t-ale", name: "Alemania" },
    { id_team: "t-ing", name: "Inglaterra" },
    { id_team: "t-por", name: "Portugal" },
    { id_team: "t-uru", name: "Uruguay" },
];

const MOCK_STADIUMS = [
    { id_stadium: "s-1", name: "Estadio Monumental", city: "Buenos Aires" },
    { id_stadium: "s-2", name: "Maracaná", city: "Río de Janeiro" },
    { id_stadium: "s-3", name: "Santiago Bernabéu", city: "Madrid" },
    { id_stadium: "s-4", name: "Lusail Stadium", city: "Lusail" },
];

const MOCK_REFEREES = [
    { id_referee: "r-1", name: "Néstor Pitana", nationality: "Argentina" },
    { id_referee: "r-2", name: "Howard Webb", nationality: "Inglaterra" },
    { id_referee: "r-3", name: "Björn Kuipers", nationality: "Países Bajos" },
];

const simulateLatency = (data) =>
    new Promise((resolve) => setTimeout(() => resolve(data), 250));

export const catalogService = {
    getTeams: async () => {
        if (USE_MOCKS) return simulateLatency(MOCK_TEAMS);
        const response = await api.get(TEAMS_RESOURCE);
        return response.data;
    },

    getStadiums: async () => {
        if (USE_MOCKS) return simulateLatency(MOCK_STADIUMS);
        const response = await api.get(STADIUMS_RESOURCE);
        return response.data;
    },

    getReferees: async () => {
        if (USE_MOCKS) return simulateLatency(MOCK_REFEREES);
        const response = await api.get(REFEREES_RESOURCE);
        return response.data;
    },
};

export default catalogService;