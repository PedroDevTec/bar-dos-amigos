import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { email, password } = await request.json();

  // Substitua esta URL pela URL do seu backend Express
  const backendUrl = "http://localhost:3002/api/users/login";

  try {
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error },
        { status: response.status }
      );
    }

    const data = await response.json();
    cookies().set("auth", data.token, { httpOnly: true });
    return NextResponse.json({ message: "Successo." });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to authenticate" },
      { status: 500 }
    );
  }
}
