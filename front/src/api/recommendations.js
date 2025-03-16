export const recommendations = async (features) => {
  try {
    const response = await fetch('/api/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ features }),
    })
    console.log('response', response)

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching recommendations:', error)
    return null
  }
}
