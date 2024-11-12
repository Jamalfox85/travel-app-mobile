import { TRAVEL_API_BASE_URL } from "@env";

export async function TravelApiCall(url: string, method: string = "GET", body?: any, headers: any = {}) {
  try {
    const response = await fetch(`${TRAVEL_API_BASE_URL}${url}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : null,
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
