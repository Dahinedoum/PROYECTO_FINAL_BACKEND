const ALLERGIES = {
  GLUTEN: 'Gluten',
  CRUSTACEANS: 'Crustaceans',
  EGGS: 'Eggs',
  FISH: 'Fish',
  PEANUTS: 'Peanuts',
  SOY: 'Soy',
  DAIRY: 'Dairy',
  NUTS: 'Nuts',
  CELLERY: 'Celery',
  MUSTARD: 'Mustard',
  SESAME: 'Sesame',
  SULPHITES: 'Sulphites',
  LUPINS: 'Lupins',
  MOLLUSKS: 'Mollusks',
}

/**
 *
 * @param {Array<string>} allergies
 */

export const validatePostAllergies = (allergies) => {
  if (!allergies) {
    throw new Error('Missing required fields from available time data')
  }

  const validAllergies = Object.values(ALLERGIES)
  for (const allergie of allergies) {
    if (!validAllergies.includes(allergie)) {
      throw new Error(`Invalid ${allergie} allergie`)
    }
  }
}
