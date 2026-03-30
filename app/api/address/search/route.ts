import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.ADDRESSFINDER_API_KEY;
const BASE_URL = 'https://api.addressfinder.io/api/nz/address';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query required' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `${BASE_URL}/autocomplete?key=${API_KEY}&q=${encodeURIComponent(query)}&format=json&max=10`
    );
    
    const data = await response.json();

    // Filter for Riverhead only
    const riverheadResults = data.completions?.filter((addr: any) => 
      addr.suburb?.toLowerCase() === 'riverhead'
    ) || [];

    return NextResponse.json({ 
      results: riverheadResults.map((addr: any) => ({
        full_address: addr.full_address,
        suburb: addr.suburb,
        city: addr.city,
        postcode: addr.postcode,
      }))
    });

  } catch (error) {
    console.error('AddressFinder error:', error);
    return NextResponse.json(
      { error: 'Address search failed' },
      { status: 500 }
    );
  }
}
