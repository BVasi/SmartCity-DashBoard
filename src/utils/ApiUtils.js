import { camelCaseToSpacedString } from './StringUtils';

export const CITY_NAMES = {
  Timisoara: 0,
  Bucharest: 1,
};

export const STREET_NAMES = {
  BulevardulMihaiViteazu: 0,
  StradaFeldioara: 1,
  StradaCluj: 2,
  BulevardulLiviuRebreanu: 3,
  BulevardulMirceaEliade: 4,
  BulevardulPrimaverii: 5,
  StradaRacari: 6,
  CaleaDorobantilor: 7,
  BulevardulCamilRessu: 8,
};

export const PROBLEM_TYPE = {
  0: 'Broken Road',
  1: 'Falling Roof',
  2: 'Pothole',
  3: 'Water Leak',
  4: 'Power Outage',
  5: 'Street Light Not Working',
  6: 'Illegal Dumping',
  7: 'Noise Complaint',
  8: 'Vandalism',
  9: 'Traffic Signal Malfunction',
  10: 'Blocked Drain',
  11: 'Fallen Tree',
  12: 'Graffiti',
  13: 'Unsafe Building',
  14: 'Animal Control',
  15: 'Public Safety Concern',
  16: 'Playground Damage',
  17: 'Flooding',
  18: 'Littering',
  19: 'Other',
};

const PROBLEM_STATUS = {
  0: 'New',
  1: 'Fixing',
  2: 'Fixed',
};

export const CITY_STREETS = {
  Timisoara: [
    'BulevardulMihaiViteazu',
    'StradaFeldioara',
    'StradaCluj',
    'BulevardulLiviuRebreanu',
  ],
  Bucharest: [
    'BulevardulMirceaEliade',
    'BulevardulPrimaverii',
    'StradaRacari',
    'CaleaDorobantilor',
    'BulevardulCamilRessu',
  ],
};

export const convertApiAddressToString = (apiAddress) => {
  const city = Object.entries(CITY_NAMES).find(([_, value]) => value === apiAddress.city)?.[0];
  const street = camelCaseToSpacedString(
    Object.entries(STREET_NAMES).find(([_, value]) => value === apiAddress.street)?.[0]
  );
  return `${city}, ${street}`;
};

export const convertApiProblemStatusToString = (apiProblemStatus) => {
  return PROBLEM_STATUS[apiProblemStatus] || 'Unknown';
};

export const convertApiProblemTypeToString = (apiProblemType) => {
  return PROBLEM_TYPE[apiProblemType] || 'Unknown';
};

export const convertStringToCityName = (cityName) => {
  return CITY_NAMES[cityName] ?? -1;
};

export const convertStringToStreetName = (streetName) => {
  const camelCaseStreet = streetName.replace(/\s+/g, '');
  return STREET_NAMES[camelCaseStreet] ?? -1;
};

export const convertStringToProblemType = (problemType) => {
  const problemEntry = Object.entries(PROBLEM_TYPE).find(([_, value]) => value === problemType);
  return problemEntry ? parseInt(problemEntry[0], 10) : -1;
};

export const convertStringToProblemStatus = (problemStatus) => {
  const statusEntry = Object.entries(PROBLEM_STATUS).find(([_, value]) => value === problemStatus);
  return statusEntry ? parseInt(statusEntry[0], 10) : -1;
};