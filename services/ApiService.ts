export async function TravelApiCall(url: string, method: string = "GET", body?: any, headers: any = {}) {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_TRAVEL_API_BASE_URL}${url}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : null,
    });
    console.log("Response", response);
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
