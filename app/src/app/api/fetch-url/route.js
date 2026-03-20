export async function POST(request) {
  const { url } = await request.json()

  try {
    const response = await fetch(url)
    const html = await response.text()
    return Response.json({ html })
  } catch (error) {
    return Response.json({ error: "Could not fetch URL" }, { status: 400 })
  }
}