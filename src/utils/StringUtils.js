export const camelCaseToSpacedString = (stringToChange) => {
    return stringToChange.replace(/([A-Z])/g, ' $1').trim();
  };
