const flagModules = import.meta.glob("../assets/flags/*.svg", {
    eager: true,
    import: "default",
});

// código ISO -> URL del asset (resuelta por Vite)
const flagsByCode = {};
for (const path in flagModules) {
    const code = path.split("/").pop().replace(".svg", "");
    flagsByCode[code] = flagModules[path];
}

const NAME_TO_CODE = {
    argentina: "ar",
    austria: "at",
    australia: "au",
    "bosnia y herzegovina": "ba",
    belgica: "be",
    bélgica: "be",
    brasil: "br",
    canada: "ca",
    canadá: "ca",
    "republica democratica del congo": "cd",
    "república democrática del congo": "cd",
    congo: "cd",
    suiza: "ch",
    "costa de marfil": "ci",
    colombia: "co",
    "cabo verde": "cv",
    curazao: "cw",
    "republica checa": "cz",
    "república checa": "cz",
    chequia: "cz",
    alemania: "de",
    argelia: "dz",
    ecuador: "ec",
    egipto: "eg",
    espana: "es",
    españa: "es",
    francia: "fr",
    inglaterra: "gb-eng",
    escocia: "gb-sct",
    ghana: "gh",
    croacia: "hr",
    haiti: "ht",
    haití: "ht",
    irak: "iq",
    iraq: "iq",
    iran: "ir",
    irán: "ir",
    jordania: "jo",
    japon: "jp",
    japón: "jp",
    "corea del sur": "kr",
    marruecos: "ma",
    mexico: "mx",
    méxico: "mx",
    "paises bajos": "nl",
    "países bajos": "nl",
    holanda: "nl",
    noruega: "no",
    "nueva zelanda": "nz",
    panama: "pa",
    panamá: "pa",
    portugal: "pt",
    paraguay: "py",
    qatar: "qa",
    catar: "qa",
    "arabia saudita": "sa",
    suecia: "se",
    senegal: "sn",
    tunez: "tn",
    túnez: "tn",
    turquia: "tr",
    turquía: "tr",
    "estados unidos": "us",
    uruguay: "uy",
    uzbekistan: "uz",
    uzbekistán: "uz",
    sudafrica: "za",
    sudáfrica: "za",
};

const normalize = (str) =>
    (str || "")
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

const NAME_TO_CODE_NORMALIZED = Object.fromEntries(
    Object.entries(NAME_TO_CODE).map(([name, code]) => [normalize(name), code])
);

export function getFlagSrc(teamName) {
    const code = NAME_TO_CODE_NORMALIZED[normalize(teamName)];
    if (!code) return undefined;
    return flagsByCode[code];
}

export default getFlagSrc;