export const handleApiError = (error) => {
  console.error('API error', error)
  throw error
}
