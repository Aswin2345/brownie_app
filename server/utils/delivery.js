export const SERVICE_AREA_MESSAGE =
  'Delivery is currently available only in Pondicherry. We will be in more places soon.';

export const isPondicherryAddress = (customer = {}) => {
  const city = String(customer.city || '').trim().toLowerCase();
  const pincode = String(customer.pincode || '').trim();

  const cityMatches =
    city.includes('pondicherry') ||
    city.includes('puducherry') ||
    city.includes('pondy');

  return cityMatches && /^605\d{3}$/.test(pincode);
};
