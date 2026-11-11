/*this basically holds shared tools for all 3 views*/ 

/*what it does is swap missing values for “Not listed”*/ 
export function orNotListed(value) {
  return value === '------' || value === 'N/A' || value === undefined || value === ''
    ? 'Not listed'
    : value;
}

/*this basically turns the ugly date into “Dec 5, 2023” :)*/
export function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

/*what it does is match all 15 check names to readable labels*/
export const CHECKS = {
  food_from_approved_source: 'Food from approved source',
  food_protected_from: 'Food protected from contamination',
  ill_workers_restricted: 'Ill workers restricted',
  proper_hand_washing: 'Proper hand washing',
  cooling_time_and_temperature: 'Cooling time and temperature',
  cold_holding_temperature: 'Cold holding temperature',
  hot_holding_temperature: 'Hot holding temperature',
  cooking_time_and_temperature: 'Cooking time and temperature',
  reheating_time_and_temperature: 'Reheating time and temperature',
  hot_and_cold_running_water: 'Hot and cold running water',
  proper_sewage_disposal: 'Proper sewage disposal',
  no_bare_hand_contact: 'No bare hand contact',
  adequate_hand_washing: 'Adequate hand washing facilities',
  rodent_and_insects: 'Rodents and insects',
  food_contact_surfaces_and: 'Food contact surfaces',
};

/*just counts how many checks a place failed*/
export function countFailedChecks(inspection) {
  return Object.keys(CHECKS).filter((field) => inspection[field] === 'Out of Compliance').length;
}
