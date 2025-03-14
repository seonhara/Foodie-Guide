export const naver = async (input) => {
  try {
    const response = await fetch('/v1/search/local.json?display=5&query=' + input, {
      method: 'GET',
      headers: {
        'Content-Type': 'plain/text',
        'X-Naver-Client-Id': import.meta.env.VITE_X_NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': import.meta.env.VITE_X_NAVER_CLIENT_SECRET,
      },
    })

    const data = await response.json()
    console.log('response', data.items)
    return data.items
  } catch (error) {
    console.error('Error fetching prediction:', error)
    return null
  }
}
