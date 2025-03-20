export const getAiagent = async (features) => {
  try {
    const response = await fetch('/api/aiagent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: features }),
    })

    const data = await response.json()
    console.log('chat response data', data)

    return data
  } catch (error) {
    console.error('Error fetching chat:', error)
    return null
  }
}
