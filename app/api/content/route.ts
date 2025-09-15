import { NextRequest, NextResponse } from 'next/server';

// Mock database - in real app, this would be a proper database
let contentStore: any[] = [];
let engagementStore: any[] = [];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const creatorId = searchParams.get('creatorId');
    const contentId = searchParams.get('contentId');

    if (contentId) {
      // Get specific content
      const content = contentStore.find(c => c.contentId === contentId);
      if (!content) {
        return NextResponse.json({ error: 'Content not found' }, { status: 404 });
      }
      return NextResponse.json(content);
    }

    if (creatorId) {
      // Get content by creator
      const creatorContent = contentStore.filter(c => c.creatorId === creatorId);
      return NextResponse.json(creatorContent);
    }

    // Get all content
    return NextResponse.json(contentStore);
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      contentId,
      creatorId,
      title,
      description,
      mediaUrl,
      tags,
      revenueShareSplitId
    } = body;

    // Validate required fields
    if (!contentId || !creatorId || !title || !mediaUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if content already exists
    const existingContent = contentStore.find(c => c.contentId === contentId);
    if (existingContent) {
      return NextResponse.json(
        { error: 'Content with this ID already exists' },
        { status: 409 }
      );
    }

    // Create new content
    const newContent = {
      contentId,
      creatorId,
      title,
      description: description || '',
      mediaUrl,
      tags: tags || [],
      revenueShareSplitId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      remixes: 0
    };

    contentStore.push(newContent);

    return NextResponse.json(newContent, { status: 201 });
  } catch (error) {
    console.error('Error creating content:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { contentId, ...updates } = body;

    if (!contentId) {
      return NextResponse.json(
        { error: 'Content ID is required' },
        { status: 400 }
      );
    }

    const contentIndex = contentStore.findIndex(c => c.contentId === contentId);
    if (contentIndex === -1) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    // Update content
    contentStore[contentIndex] = {
      ...contentStore[contentIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json(contentStore[contentIndex]);
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contentId = searchParams.get('contentId');

    if (!contentId) {
      return NextResponse.json(
        { error: 'Content ID is required' },
        { status: 400 }
      );
    }

    const contentIndex = contentStore.findIndex(c => c.contentId === contentId);
    if (contentIndex === -1) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    // Remove content
    const deletedContent = contentStore.splice(contentIndex, 1)[0];

    // Also remove related engagements
    engagementStore = engagementStore.filter(e => e.contentId !== contentId);

    return NextResponse.json({ message: 'Content deleted successfully', content: deletedContent });
  } catch (error) {
    console.error('Error deleting content:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Engagement endpoints
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { contentId, engagementType, userId } = body;

    if (!contentId || !engagementType || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find content
    const content = contentStore.find(c => c.contentId === contentId);
    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    // Check if user already engaged
    const existingEngagement = engagementStore.find(
      e => e.contentId === contentId && e.userId === userId && e.type === engagementType
    );

    if (existingEngagement) {
      return NextResponse.json(
        { error: 'User already engaged with this content' },
        { status: 409 }
      );
    }

    // Add engagement
    const newEngagement = {
      id: `engagement-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      contentId,
      userId,
      type: engagementType,
      createdAt: new Date().toISOString()
    };

    engagementStore.push(newEngagement);

    // Update content stats
    const statField = engagementType + 's'; // likes, comments, shares, remixes
    if (content[statField] !== undefined) {
      content[statField]++;
      content.updatedAt = new Date().toISOString();
    }

    return NextResponse.json({
      message: 'Engagement recorded successfully',
      engagement: newEngagement,
      content: content
    });
  } catch (error) {
    console.error('Error recording engagement:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

