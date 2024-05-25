export function useIdHandler() {
  const stringToDigits = (str: String): number[] =>
    str.split("").map((char) => Number(char));

  const sumArray = (arr: number[]): number =>
    arr.reduce((total, currentValue, idx) => {
      return total + currentValue;
    });

  const sumWithMod2 = (arr: number[], modRes: number) =>
    arr.reduce((total, currentValue, idx) => {
      if (idx % 2 == modRes) {
        return total + currentValue;
      } else return total;
    });

  const isValidId = (id: String) => {
    const checkDigit = Number(id.slice(12));
    const payload = id.slice(0, 12);
    const digits = stringToDigits(payload);
    const oddPositionsSum = sumWithMod2(digits, 0);

    let concat = "";
    digits.forEach((digit, idx) => {
      if (idx % 2 == 1) {
        concat += String(digit);
      }
    });

    const evenPositionSum = Number(concat) * 2;
    const evenDigits = stringToDigits(String(evenPositionSum));
    const evenDigitsSum = sumArray(evenDigits);

    const total = oddPositionsSum + evenDigitsSum;
    const lastDigit = total % 10;
    const calc1 = (10 - lastDigit) % 10;
    console.log(`Original: ${checkDigit}, calc1: ${calc1}`);

    return checkDigit == calc1;
  };

  const getAge = (dateOfBirth: String) => {
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDay = today.getDay();

    let year = Number(dateOfBirth.slice(0, 2));
    year += year < todayYear - 2000 ? 2000 : 1900;
    const month = Number(dateOfBirth.slice(2, 4));
    const day = Number(dateOfBirth.slice(4, 6));

    console.log(`Year: ${year}, month: ${month}, day: ${day}`);

    let yearDiff = todayYear - year;
    yearDiff -= todayMonth < month && todayDay < day ? 1 : 0;

    return yearDiff;
  };

  const getSex = (sex: String) => {
    // females -> 0000-4999,  males -> 5000-9999
    const sexNum = Number(sex);
    return sexNum < 5000 ? "female" : "male";
  };

  const extractInfo = (id: String) => {
    const dateOfBirth = id.slice(0, 6);
    console.log(dateOfBirth);
    const sexSlice = id.slice(6, 10);
    const isRsa = Boolean(id.slice(10, 11));

    const age = getAge(dateOfBirth);
    const sex = getSex(sexSlice);

    console.log(`Age: ${age}, sex: ${sex}, isRsa: ${isRsa}`);

    return { age: age, sex: sex, isForeign: isRsa };
  };

  return {
    isValidId,
    extractInfo,
  };
}
