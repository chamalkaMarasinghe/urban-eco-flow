/**
 * Compares two profile objects to detect if any changes were made
 * @param {Object} before - The original data before editing
 * @param {Object} after - The new data after editing
 * @returns {boolean} - Returns true if changes were detected, false otherwise
 */
function detectChanges(before, after) {
  // Check for simple property differences
  const simpleProps = [
    "firstName",
    "lastName",
    "email",
    "phoneNumber",
    "idNumber",
    "aboutMe",
    "mobileMoneyProvider",
    "payoutMobileNumber",
    "mobileMoneyAccHolderFullName",
    "bankName",
    "bankAccHolderFullName",
    "accNumber",
    "branchName",
    "paymentType",
    "profilePicture",
  ];

  for (const prop of simpleProps) {
    if (before[prop] !== after[prop]) {
      return true;
    }
  }

  // Check ID images
  if (!areArraysEqual(before.idImages, after.idImages)) {
    return true;
  }

  // check Proof of Address images
  if (!areArraysEqual(before.proofAddress, after.proofAddress)) {
    return true;
  }

  // Check serving areas
  if (!areServingAreasEqual(before.servingAreas, after.servingAreas)) {
    return true;
  }

  // Check professional details
  if (
    !areProfessionalDetailsEqual(
      before.professionalDetails,
      after.professionalDetails
    )
  ) {
    return true;
  }

  // No changes detected
  return false;
}

/**
 * Compare two simple arrays for equality
 */
function areArraysEqual(arr1, arr2) {
  if (!arr1 || !arr2) return arr1 === arr2;
  if (arr1.length !== arr2.length) return false;

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }

  return true;
}

/**
 * Compare serving areas for equality
 */
function areServingAreasEqual(areas1, areas2) {
  if (!areas1 || !areas2) return areas1 === areas2;
  if (areas1.length !== areas2.length) return false;

  // Create a map of cityName -> subcities for the first array
  const areaMap1 = new Map();
  for (const area of areas1) {
    areaMap1.set(area.cityName, [...area.subcities].sort());
  }

  // Check if all cities in areas2 match with areas1
  for (const area of areas2) {
    const subcities1 = areaMap1.get(area.cityName);

    // If city doesn't exist in areas1 or subcities don't match
    if (!subcities1) return false;

    const subcities2 = [...area.subcities].sort();
    if (subcities1.length !== subcities2.length) return false;

    for (let i = 0; i < subcities1.length; i++) {
      if (subcities1[i] !== subcities2[i]) return false;
    }

    // Remove the matched city from the map
    areaMap1.delete(area.cityName);
  }

  // If there are any cities left in the map, they don't exist in areas2
  return areaMap1.size === 0;
}

/**
 * Compare professional details for equality
 */
function areProfessionalDetailsEqual(details1, details2) {
  if (!details1 || !details2) return details1 === details2;
  if (details1.length !== details2.length) return false;

  // Create a map of categoryName -> skills for the first array
  const detailsMap1 = new Map();
  for (const category of details1) {
    // Normalize skills to handle both name and skillName formats
    const normalizedSkills = category.skills.map((skill) => ({
      name: skill.name || skill.skillName,
      description: skill.description,
    }));

    detailsMap1.set(category.categoryName, normalizedSkills);
  }

  // Check if all categories in details2 match with details1
  for (const category of details2) {
    const skills1 = detailsMap1.get(category.categoryName);

    // If category doesn't exist in details1
    if (!skills1) return false;

    // Normalize skills from details2
    const skills2 = category.skills.map((skill) => ({
      name: skill.name || skill.skillName,
      description: skill.description,
    }));

    // Compare skills counts
    if (skills1.length !== skills2.length) return false;

    // Create a map of skill names to descriptions for easier comparison
    const skillMap1 = new Map();
    for (const skill of skills1) {
      skillMap1.set(skill.name, skill.description);
    }

    // Check if all skills in skills2 match with skills1
    for (const skill of skills2) {
      const desc1 = skillMap1.get(skill.name);

      // If skill doesn't exist in skills1 or descriptions don't match
      if (desc1 === undefined || desc1 !== skill.description) {
        return false;
      }

      // Remove the matched skill from the map
      skillMap1.delete(skill.name);
    }

    // If there are any skills left in the map, they don't exist in skills2
    if (skillMap1.size > 0) return false;

    // Remove the matched category from the map
    detailsMap1.delete(category.categoryName);
  }

  // If there are any categories left in the map, they don't exist in details2
  return detailsMap1.size === 0;
}

export default detectChanges;
