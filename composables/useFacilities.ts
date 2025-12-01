import { orderBy } from 'firebase/firestore'

export const useFacilities = () => {
  const { getCollection, getDocument } = useFirestore()

  /**
   * ดึงสิ่งอำนวยความสะดวกทั้งหมด
   */
  const getAllFacilities = async () => {
    return await getCollection(
      'facilities',
      orderBy('order', 'asc')
    )
  }

  /**
   * ดึงสิ่งอำนวยความสะดวกตาม ID
   */
  const getFacilityById = async (id: string) => {
    return await getDocument('facilities', id)
  }

  /**
   * ดึงสิ่งอำนวยความสะดวกหลายตัวตาม IDs
   */
  const getFacilitiesByIds = async (ids: string[]) => {
    const facilities = []

    for (const id of ids) {
      const facility = await getFacilityById(id)
      if (facility) {
        facilities.push(facility)
      }
    }

    return facilities
  }

  return {
    getAllFacilities,
    getFacilityById,
    getFacilitiesByIds
  }
}
