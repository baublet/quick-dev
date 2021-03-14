let secret = process.env.SECRET;
let strapYardUrl = process.env.STRAPYARD_URL;

export const config = {
  getSecret: () => secret,
  getStrapYardUrl: () => strapYardUrl,
  setSecret: (newVal: string) => (secret = newVal),
  setStrapYardUrl: (newVal: string) => (strapYardUrl = newVal),
};
