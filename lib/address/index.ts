// Google Maps Geocoding API Integration
const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export async function searchAddresses(query: string) {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query + ', Riverhead, New Zealand')}&key=${API_KEY}&components=country:nz`
    );
    
    const data = await response.json();

    if (data.status !== 'OK') return [];

    return data.predictions?.slice(0, 10).map((pred: any) => ({
      full_address: pred.description,
      place_id: pred.place_id,
    })) || [];
  } catch (error) {
    console.error('Address search error:', error);
    return [];
  }
}

export async function validateRiverheadAddress(address: string) {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address + ', New Zealand')}&key=${API_KEY}`
    );
    const data = await response.json();

    if (data.status !== 'OK' || !data.results?.[0]) {
      return { valid: false, normalized: null, error: 'address_not_found' };
    }

    const result = data.results[0];
    const components = result.address_components;
    
    // Check if address is in Riverhead
    const suburb = components.find((c: any) => 
      c.types.includes('locality') || c.types.includes('sublocality')
    )?.long_name;

    const isRiverhead = suburb?.toLowerCase() === 'riverhead';

    return {
      valid: isRiverhead,
      normalized: result.formatted_address,
      suburb: suburb,
      city: components.find((c: any) => c.types.includes('administrative_area_level_1'))?.long_name,
      postcode: components.find((c: any) => c.types.includes('postal_code'))?.long_name,
      latitude: result.geometry.location.lat,
      longitude: result.geometry.location.lng,
      error: isRiverhead ? null : 'not_riverhead',
    };
  } catch (error) {
    console.error('Google Maps API error:', error);
    return { valid: false, normalized: null, error: 'validation_failed' };
  }
}
