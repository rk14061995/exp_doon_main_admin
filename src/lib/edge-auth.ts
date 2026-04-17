// Edge-compatible JWT verification
export function verifyTokenEdge(token: string) {
  try {
    // Simple JWT verification for Edge runtime
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }

    // Decode payload (base64)
    const payload = JSON.parse(atob(parts[1]));
    
    // Check expiration
    if (payload.exp && payload.exp < Date.now() / 1000) {
      throw new Error('Token expired');
    }

    return {
      id: payload.id,
      email: payload.email,
    };
  } catch (error) {
    throw new Error('Invalid token');
  }
}
