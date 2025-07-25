"use client";
// Function to extract information
export function extractInformation(data) {
  const accountRegex = /Account:\s*(\d+)/;
  const macRegex = /Mac Addr:\s*([0-9A-Fa-f]{12})/;
  const nodeNameRegex = /Node Name:\s*([A-Z\s\d.]+)/;
  const zipRegex = /->\s*([A-Za-z0-9]+)/;
  const streetAddressRegex =
    /Street:\s*([A-Za-z0-9\s'`\/\-]+)(?=\s*Locality|$)/;
  const regionRegex = /([A-Za-z]+(?:\s+\d+[A-Za-z]*)?)\s*->/;

  // Extract and format Account Number
  const accountMatch = data.match(accountRegex);
  const accountNumber = accountMatch ? accountMatch[1] : "Not found";

  // Extract and format MAC Address
  const macMatch = data.match(macRegex);
  const macAddress = macMatch
    ? macMatch[1].replace(/(.{2})(?=.)/g, "$1:")
    : "Not found"; // Insert colons every two characters

  // Extract and format Node Name in CamelCase
  const nodeNameMatch = data.match(nodeNameRegex);
  const nodeName = nodeNameMatch
    ? nodeNameMatch[1]
        .trim()
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase()) // Camel case
    : "Not found";

  // Extract ZIP (whatever follows "->")
  const zipMatch = data.match(zipRegex);
  const zip = zipMatch ? zipMatch[1] : "Not found";

  // Extract and format Street Address in CamelCase
  const streetAddressMatch = data.match(streetAddressRegex);
  const streetAddress = streetAddressMatch
    ? streetAddressMatch[1]
        .trim()
        .toLowerCase()
        .replace(/(\b\w|!(?<=[`'])\w)/g, (char) => char.toUpperCase())
        .replace(/(?<=[`'])\w/g, (char) => char.toLowerCase()) // Lowercase letters after backticks/apostrophes
    : "Not found";

  // Extract Region (here, "Dublin 22")
  const regionMatch = data.match(regionRegex);
  const region = regionMatch
    ? regionMatch[1]
        .trim()
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase())
    : "Not found";

  const areaRegex = new RegExp(
    `${streetAddress}\\s+([\\w\\s'\`]+?)\\s+${region}`,
    "i"
  );

  // Extract Area
  const areaMatch = data.match(areaRegex);
  const area = areaMatch
    ? areaMatch[1]
        .trim()
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase())
    : "Not found";
  if (
    accountMatch ||
    macMatch ||
    nodeNameMatch ||
    streetAddressMatch ||
    areaMatch ||
    regionMatch ||
    zipMatch
  ) {
    // Return the extracted information
    return {
      accountNumber,
      macAddress,
      nodeName,
      streetAddress,
      area,
      region,
      zip,
    };
  }
  return null;
}

const zipToAreaMap = {
  // AR1 mappings
  AA: "AR1",
  AB: "AR1",
  AC: "AR1",
  AE: "AR1",
  AJ: "AR1",
  AK: "AR1",
  DS: "AR1",

  // AR2 mappings
  BA: "AR2",
  BB: "AR2",
  BC: "AR2",
  BD: "AR2",
  BE: "AR2",
  BF: "AR2",
  BG: "AR2",
  BH: "AR2",
  RS: "AR2",
  RT: "AR2",
  DO: "AR2",

  // AR3 mappings
  CA: "AR3",
  CB: "AR3",
  CC: "AR3",
  CD: "AR3",
  CE: "AR3",
  CG: "AR3",
  AD: "AR3",
  AF: "AR3",
  AG: "AR3",
  AR: "AR3",
  AH: "AR3",
  DSW: "AR3",
  DZ: "AR3",

  // AR4 mappings
  DA: "AR4",
  DB: "AR4",
  DC: "AR4",
  DD: "AR4",
  DE: "AR4",
  DF: "AR4",
  DG: "AR4",
  DI: "AR4",
  CF: "AR4",
  WK: "AR4",
  DSE: "AR4",

  //NOR mappings
  AS: "NOR",
  AT: "NOR",
  AL: "NOR",
  CR: "NOR",
  ML: "NOR",
  DK: "NOR",
  TU: "NOR",
  BR: "NOR",
  NV: "NOR",
  TM: "NOR",
  SL: "NOR",
  GA: "NOR",
  TL: "NOR",
  BN: "NOR",
  ST: "NOR",

  //SOU mappings
  SA: "SOU",
  SB: "SOU",
  SH: "SOU",
  AI: "SOU",
  NS: "SOU",
  KK: "SOU",
  PL: "SOU",
  KL: "SOU",
  ES: "SOU",
  NB: "SOU",
  PR: "SOU",
  AY: "SOU",
  ON: "SOU",
  OS: "SOU",
  MN: "SOU",
  KY: "SOU",
  SD: "SOU",
  TH: "SOU",
  CL: "SOU",
  DV: "SOU",
  LK: "SOU",
  WA: "SOU",
  CW: "SOU",
  EY: "SOU",
  GO: "SOU",
  NR: "SOU",
};

// Function to get the area code for a given ZIP code
export function getAreaCodeFor(zip) {
  const area = zipToAreaMap[zip];
  return area ? area : "Area not found";
}

export function getPriorityFor(customersCount) {
  if (customersCount > 0 && customersCount <= 50) {
    return "P4";
  } else if (customersCount > 50 && customersCount <= 499) {
    return "P3";
  } else if (customersCount > 499 && customersCount <= 999) {
    return "P2";
  } else if (customersCount > 999) {
    return "P1";
  }
}
