import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Generate frame metadata for Farcaster
  const frameMetadata = {
    'fc:frame': 'vNext',
    'fc:frame:image': `${process.env.NEXT_PUBLIC_APP_URL}/api/frame/image`,
    'fc:frame:button:1': 'Explore Content',
    'fc:frame:button:2': 'Create Content',
    'fc:frame:button:3': 'View Dashboard',
    'fc:frame:post_url': `${process.env.NEXT_PUBLIC_APP_URL}/api/frame/action`,
  }

  return new NextResponse(null, {
    status: 200,
    headers: frameMetadata,
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { untrustedData } = body

    // Handle different button presses
    let redirectUrl = process.env.NEXT_PUBLIC_APP_URL

    switch (untrustedData.buttonIndex) {
      case 1: // Explore Content
        redirectUrl += '/'
        break
      case 2: // Create Content
        redirectUrl += '/create'
        break
      case 3: // View Dashboard
        redirectUrl += '/dashboard'
        break
      default:
        redirectUrl += '/'
    }

    // Return frame response
    const frameResponse = {
      'fc:frame': 'vNext',
      'fc:frame:image': `${process.env.NEXT_PUBLIC_APP_URL}/api/frame/image`,
      'fc:frame:button:1': 'Back to Home',
      'fc:frame:post_url': `${process.env.NEXT_PUBLIC_APP_URL}/api/frame`,
    }

    return new NextResponse(null, {
      status: 200,
      headers: {
        ...frameResponse,
        'Location': redirectUrl,
      },
    })
  } catch (error) {
    console.error('Frame action error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

