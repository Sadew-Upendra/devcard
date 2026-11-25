const ALIASES: Record<string, string> = {
  "sri lanka": "lk", lk: "lk", colombo: "lk", kandy: "lk", galle: "lk",
  kelaniya: "lk", gampaha: "lk", matara: "lk", jaffna: "lk",
  india: "in", bangalore: "in", bengaluru: "in", mumbai: "in", delhi: "in",
  hyderabad: "in", chennai: "in", pune: "in",
  usa: "us", us: "us", "united states": "us", "san francisco": "us",
  "new york": "us", seattle: "us", austin: "us",
  uk: "gb", "united kingdom": "gb", england: "gb", london: "gb",
  germany: "de", berlin: "de", munich: "de",
  france: "fr", paris: "fr",
  canada: "ca", toronto: "ca", vancouver: "ca",
  australia: "au", sydney: "au", melbourne: "au",
  china: "cn", beijing: "cn", shanghai: "cn",
  japan: "jp", tokyo: "jp",
  brazil: "br", pakistan: "pk", bangladesh: "bd", dhaka: "bd",
  singapore: "sg", netherlands: "nl", amsterdam: "nl",
  nigeria: "ng", indonesia: "id", vietnam: "vn",
};

/** Returns a lowercase ISO country code, or null if unknown. */
export function countryFromLocation(location: string | null): string | null {
  if (!location) return null;
  const tokens = location
    .toLowerCase()
    .split(/[,/|·]+/)
    .map((t) => t.replace(/[^a-z\s]/g, "").trim())
    .filter(Boolean);
  // The country is usually the last part ("Colombo, Sri Lanka").
  for (const token of tokens.reverse()) {
    if (ALIASES[token]) return ALIASES[token];
  }
  return null;
}

export const COUNTRY_NAMES: Record<string, string> = {
  lk: "Sri Lanka", in: "India", us: "United States", gb: "United Kingdom",
  de: "Germany", fr: "France", ca: "Canada", au: "Australia", cn: "China",
  jp: "Japan", br: "Brazil", pk: "Pakistan", bd: "Bangladesh",
  sg: "Singapore", nl: "Netherlands", ng: "Nigeria", id: "Indonesia",
  vn: "Vietnam",
};