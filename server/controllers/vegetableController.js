// Function to add a new vegetable
export async function addVegetable(db, vegetable) {
  const {
    name, firstPlantingDate, lastPlantingDate, fruitsInDays,
    stopsFruitingInDays, sunHoursRequired, spacingCM, gardenId
  } = vegetable;

  const result = await db.run(
    `INSERT INTO vegetables (name, firstPlantingDate, lastPlantingDate, 
    fruitsInDays, stopsFruitingInDays, sunHoursRequired, spacingCM, gardenId)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name, firstPlantingDate, lastPlantingDate,
      fruitsInDays, stopsFruitingInDays, sunHoursRequired,
      spacingCM, gardenId
    ]
  );

  return {
    id: result.lastID,
    ...vegetable
  };
}

// Function to get all vegetables
export async function getAllVegetables(db) {
  try {
    return await db.all('SELECT * FROM vegetables');
  }
  catch (error) {
    console.error('❌ Error fetching vegetables:', error.message);
    throw new Error('Database query failed');
  }
}

// Function to get a vegetable by ID
export async function getVegetableById(db, id) {
  return await db.get('SELECT * FROM vegetables WHERE id = ?', [id]);
}

// Function to update a vegetable
export async function updateVegetable(db, id, updatedVegetable) {
  const {
    name, firstPlantingDate, lastPlantingDate, fruitsInDays,
    stopsFruitingInDays, sunHoursRequired, spacingCM, gardenId
  } = updatedVegetable;

  await db.run(
    `UPDATE vegetables 
     SET name=?, firstPlantingDate=?, lastPlantingDate=?, fruitsInDays=?, 
     stopsFruitingInDays=?, sunHoursRequired=?, spacingCM=?, gardenId=? 
     WHERE id=?`,
    [
      name, firstPlantingDate, lastPlantingDate, fruitsInDays,
      stopsFruitingInDays, sunHoursRequired, spacingCM, gardenId, id
    ]
  );

  return {
    id,
    ...updatedVegetable
  };
}

// Function to delete a vegetable
export async function deleteVegetable(db, id) {
  await db.run('DELETE FROM vegetables WHERE id=?', [id]);
  return { message: 'Vegetable deleted successfully' };
}
